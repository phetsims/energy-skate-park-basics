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
  var skaterImage = require( 'image!ENERGY_SKATE_PARK/skater.png' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  function SkaterNode( model, view, modelViewTransform ) {
    var skater = model.skater;
    this.skater = model.skater;
    var skaterNode = this;

    //Map from mass(kg) to scale
    var massToScale = new LinearFunction( 60, 100, 0.33, 0.4 );

    //Make him 2 meters tall, with skateboard
    var scale = massToScale( this.skater.mass );
    Image.call( skaterNode, skaterImage, { scale: scale, renderer: 'svg', rendererOptions: {cssTransform: true}, cursor: 'pointer'} );
    var imageWidth = this.width;
    var imageHeight = this.height;

    this.skater.massProperty.link( function( mass ) {
      skaterNode.setScaleMagnitude( massToScale( mass ) );
      skaterNode.setRotation( 0 );
      imageWidth = skaterNode.width;
      imageHeight = skaterNode.height;
      if ( positionChanged ) {
        positionChanged( skater.position );
      }
    } );

    //Show a red dot in the bottom center as the important particle model coordinate
    this.addChild( new Circle( 4, {fill: 'red', x: imageWidth / scale / 2, y: imageHeight / scale } ) );

    //Update the position and angle.  Normally the angle would only change if the position has also changed.
    var positionChanged = function( position ) {
      var view = modelViewTransform.modelToViewPosition( position );

      //TODO: Coalesce all of these calls into a single matrix for performance, or at least cache rotation value?
      skaterNode.setTranslation( view.x - imageWidth / 2, view.y - imageHeight );
      skaterNode.setRotation( 0 );

      //Keep angle when leaving a track, but optimize for straight up and down skater
      if ( skater.angle !== 0 ) {
        skaterNode.rotateAround( new Vector2( view.x, view.y ), skater.angle );
      }
    };
    this.skater.positionProperty.link( positionChanged );
    var targetTrack = null;

    var targetU = null;
    this.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          skater.dragging = true;
        },

        drag: function( event ) {

          //TODO: Translate based on deltas?  Or move the skater up so a bit above the finger/mouse?
          //TODO: It is nice to have the skater centered above the finger, but maybe he should move there gradually instead of jumping there?
          var globalPoint = skaterNode.globalToParentPoint( event.pointer.point );
          var position = modelViewTransform.viewToModelPosition( globalPoint );

          //make sure it is within the visible bounds
          //TODO: don't let him be dragged below ground
          position = view.visibleModelBounds.getClosestPoint( position.x, position.y, position );

          //TODO: lots of unnecessary allocations and computation here, biggest improvement could be to use binary search for position on the track
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
              closeEnough = true;
            }
          }
          if ( !closeEnough ) {
            targetTrack = null;
            targetU = null;

            //make skater upright if not near the track
            //TODO: make this continuous based on deltas so it is a smooth motion?
            skater.angle = 0;
          }

          skater.position = position;
          skater.updateEnergy();
        },

        //TODO: The skater pops up sometimes when released, after being at an angle
        end: function( event ) {
          skater.dragging = false;
          skater.velocity = new Vector2( 0, 0 );
          skater.uD = 0;
          skater.startingPosition = new Vector2( skater.position.x, skater.position.y );
          skater.track = targetTrack;
          skater.u = targetU;
          skater.startingU = targetU;
          skater.startingTrack = targetTrack;
        }
      } ) );
  }

  return inherit( Image, SkaterNode );
} );