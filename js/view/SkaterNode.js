// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the skater, which is draggable.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var skaterImage = require( 'image!ENERGY_SKATE_PARK_BASICS/skater.png' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  function SkaterNode( model, view, modelViewTransform ) {
    var skater = model.skater;
    this.skater = model.skater;
    var skaterNode = this;

    //Map from mass(kg) to scale
    var massToScale = new LinearFunction( (100 + 25) / 2, 100, 0.34, 0.43 );

    //Make him 2 meters tall, with skateboard
    Image.call( skaterNode, skaterImage, { cursor: 'pointer'} );
    var imageWidth = this.width;
    var imageHeight = this.height;

    //Update the position and angle.  Normally the angle would only change if the position has also changed, so no need for a duplicate callback there
    this.skater.multilink( ['mass', 'position', 'direction', 'up' ], function( mass, position, direction, up ) {
      var matrix = Matrix3.IDENTITY;

      var view = modelViewTransform.modelToViewPosition( position );
      var displayAngle = skater.angle + (up ? 0 : Math.PI );

      //Translate to the desired location
      matrix = matrix.multiplyMatrix( Matrix3.translation( view.x, view.y ) );

      //Rotation and translation can happen in any order
      matrix = matrix.multiplyMatrix( Matrix3.rotation2( displayAngle ) );
      matrix = matrix.multiplyMatrix( Matrix3.scaling( (direction === 'left' ? 1 : -1 ) * massToScale( mass ), massToScale( mass ) ) );

      //Think of it as a multiplying the Vector2 to the right, so this step happens first actually.  Use it to center the registration point
      matrix = matrix.multiplyMatrix( Matrix3.translation( -imageWidth / 2, -imageHeight ) );

      skaterNode.setMatrix( matrix );
    } );

    //Show a red dot in the bottom center as the important particle model coordinate
    this.addChild( new Circle( 8, {fill: 'red', x: imageWidth / 2, y: imageHeight } ) );

    var targetTrack = null;

    var targetU = null;
    this.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          skater.dragging = true;

          //Jump to the input location when dragged
          this.drag( event );
        },

        drag: function( event ) {

          var globalPoint = skaterNode.globalToParentPoint( event.pointer.point );
          var position = modelViewTransform.viewToModelPosition( globalPoint );

          //make sure it is within the visible bounds
          position = view.availableModelBounds.getClosestPoint( position.x, position.y, position );

          //PERFORMANCE/ALLOCATION: lots of unnecessary allocations and computation here, biggest improvement could be to use binary search for position on the track
          var closestTrackAndPositionAndParameter = model.getClosestTrackAndPositionAndParameter( position, model.getPhysicalTracks() );
          var closeEnough = false;
          if ( closestTrackAndPositionAndParameter ) {
            var closestPoint = closestTrackAndPositionAndParameter.point;
            var distance = closestPoint.distance( position );
            if ( distance < 0.5 ) {
              position = closestPoint;
              targetTrack = closestTrackAndPositionAndParameter.track;
              targetU = closestTrackAndPositionAndParameter.u;
              skater.angle = targetTrack.getViewAngleAt( targetU );

              //Choose the right side of the track, i.e. the side of the track that would have the skater upside up
              var normal = targetTrack.getUnitNormalVector( targetU );
              skater.up = normal.y > 0;

              closeEnough = true;
            }
          }
          if ( !closeEnough ) {
            targetTrack = null;
            targetU = null;

            //make skater upright if not near the track
            skater.angle = 0;
            skater.up = true;
          }

          skater.position = position;
          skater.updateEnergy();
        },

        end: function() {
          skater.dragging = false;
          skater.velocity = new Vector2( 0, 0 );
          skater.uD = 0;
          skater.startingPosition = new Vector2( skater.position.x, skater.position.y );
          skater.track = targetTrack;
          skater.u = targetU;
          skater.startingU = targetU;
          skater.startingTrack = targetTrack;

          //Update the energy on skater release so it won't try to move to a different height to make up for the delta
          skater.updateEnergy();
        }
      } ) );
  }

  return inherit( Image, SkaterNode );
} );