// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the skater, which is draggable.
 *
 * Converted to composition instead of inheritance for SkaterNode to work around updateSVGFragment problem, see #123
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var skaterLeftImage = require( 'image!ENERGY_SKATE_PARK_BASICS/skater-left.png' );
  var skaterRightImage = require( 'image!ENERGY_SKATE_PARK_BASICS/skater-right.png' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );

  //Map from mass(kg) to scale
  var massToScale = new LinearFunction( (100 + 25) / 2, 100, 0.34, 0.43 );

  /**
   * SkaterNode constructor
   *
   * @param {Skater} skater
   * @param {EnergySkateParkBasicsView} view
   * @param {ModelViewTransform} modelViewTransform
   * @param {function} getClosestTrackAndPositionAndParameter function that gets the closest track properties, used when the skater is being dragged close to the track
   * @param {function} getPhysicalTracks function that returns the physical tracks in the model, so the skater can try to attach to them while dragging
   * @constructor
   */
  function SkaterNode( skater, view, modelViewTransform, getClosestTrackAndPositionAndParameter, getPhysicalTracks ) {
    this.skater = skater;
    var skaterNode = this;

    var skaterImageNode = new Image( skaterRightImage, { cursor: 'pointer', rendererOptions: { cssTransform: true } } );
    Node.call( this, {children: [skaterImageNode]} );
    var imageWidth = this.width;
    var imageHeight = this.height;

    //Update the position and angle.  Normally the angle would only change if the position has also changed, so no need for a duplicate callback there
    this.skater.on( 'updated', function() {
      var mass = skater.mass;
      var position = skater.position;
      var direction = skater.direction;
      var angle = skater.angle;

      var view = modelViewTransform.modelToViewPosition( position );

      //Translate to the desired location
      var matrix = Matrix3.translation( view.x, view.y );

      //Rotation and translation can happen in any order
      matrix = matrix.multiplyMatrix( Matrix3.rotation2( angle ) );
      var scale = massToScale( mass );
      skaterImageNode.image = direction === 'left' ? skaterLeftImage : skaterRightImage;
      matrix = matrix.multiplyMatrix( Matrix3.scaling( scale, scale ) );

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

          //Clear thermal energy whenever skater is grabbed, see https://github.com/phetsims/energy-skate-park-basics/issues/32
          skater.thermalEnergy = 0;

          //Jump to the input location when dragged
          this.drag( event );
        },

        drag: function( event ) {

          var globalPoint = skaterNode.globalToParentPoint( event.pointer.point );
          var position = modelViewTransform.viewToModelPosition( globalPoint );

          //make sure it is within the visible bounds
          position = view.availableModelBounds.getClosestPoint( position.x, position.y, position );

          //PERFORMANCE/ALLOCATION: lots of unnecessary allocations and computation here, biggest improvement could be to use binary search for position on the track
          var closestTrackAndPositionAndParameter = getClosestTrackAndPositionAndParameter( position, getPhysicalTracks() );
          var closeEnough = false;
          if ( closestTrackAndPositionAndParameter && closestTrackAndPositionAndParameter.track && closestTrackAndPositionAndParameter.track.isParameterInBounds( closestTrackAndPositionAndParameter.u ) ) {
            var closestPoint = closestTrackAndPositionAndParameter.point;
            var distance = closestPoint.distance( position );
            if ( distance < 0.5 ) {
              position = closestPoint;
              targetTrack = closestTrackAndPositionAndParameter.track;
              targetU = closestTrackAndPositionAndParameter.u;

              //Choose the right side of the track, i.e. the side of the track that would have the skater upside up
              var normal = targetTrack.getUnitNormalVector( targetU );
              skater.up = normal.y > 0;

              skater.angle = targetTrack.getViewAngleAt( targetU ) + (skater.up ? 0 : Math.PI);

              closeEnough = true;
            }
          }
          if ( !closeEnough ) {
            targetTrack = null;
            targetU = null;

            //make skater upright if not near the track
            skater.angle = 0;
            skater.up = true;

            skater.position = position;
          }

          else {
            skater.position = targetTrack.getPoint( targetU );
          }

          skater.updateEnergy();
          skater.trigger( 'updated' );
        },

        end: function() {
          skater.dragging = false;
          skater.velocity = new Vector2( 0, 0 );
          skater.uD = 0;
          skater.track = targetTrack;
          skater.u = targetU;
          if ( targetTrack ) {
            skater.position = targetTrack.getPoint( skater.u );
          }
          skater.startingPosition = skater.position.copy();
          skater.startingU = targetU;
          skater.startingUp = skater.up;
          skater.startingTrack = targetTrack;
          skater.startingAngle = skater.angle;

          //Update the energy on skater release so it won't try to move to a different height to make up for the delta
          skater.updateEnergy();
          skater.trigger( 'updated' );
        }
      } ) );
  }

  return inherit( Node, SkaterNode );
} );