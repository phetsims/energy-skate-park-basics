// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the skater, which is draggable.
 * TODO: if the skater is dragged close to the track, align him with the track so you can release him right on the track, with no energy loss.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var LinearFunction = require( 'DOT/LinearFunction' );

  function SkaterNode( model, modelViewTransform ) {
    var skater = model.skater;
    this.skater = model.skater;
    var skaterNode = this;

    //Map from mass(kg) to scale
    var massToScale = new LinearFunction( 60, 100, 0.33, 0.4 );

    //Make him 2 meters tall, with skateboard
    var scale = massToScale( this.skater.mass );
    Image.call( skaterNode, images.getImage( 'skater.png' ), { scale: scale, renderer: 'svg', rendererOptions: {cssTransform: true}, cursor: 'pointer'} );
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

      //TODO: Coalesce all of these calls into a single matrix for performance?
      //TODO: Or at least cache rotation value?
      skaterNode.setTranslation( view.x - imageWidth / 2, view.y - imageHeight );
      skaterNode.setRotation( 0 );

      //Keep angle when leaving a track, but optimize for straight up and down skater
      if ( skater.angle !== 0 ) {
        skaterNode.rotateAround( new Vector2( view.x, view.y ), skater.angle );
      }
    };
    this.skater.positionProperty.link( positionChanged );
    var targetTrack = null;

    //TODO: Some places it is 'u' some places it is 't', please unify, probably based on the paper (so 'u')
    var targetT = null;
    this.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          skater.dragging = true;
        },
        drag: function( event ) {

          //TODO: Translate based on deltas?  Or move the skater up so a bit above the finger/mouse?
          var t = skaterNode.globalToParentPoint( event.pointer.point );
          var modelPoint = modelViewTransform.viewToModelPosition( t );

          //TODO: lots of unnecessary allocations and computation here
          var closestTrack = model.getClosestTrack( skater, model.getPhysicalTracks() );
          var closestPointHash = closestTrack.getClosestPoint( modelPoint );
          var closestPoint = closestPointHash.point;
          var distance = closestPoint.distance( modelPoint );
          if ( distance < 0.5 ) {
            modelPoint = closestPoint;
            targetTrack = closestTrack;
            targetT = closestPointHash.t;
            skater.angle = targetTrack.getViewAngleAt( targetT );
          }
          else {
            targetTrack = null;
            targetT = null;

            //make skater upright if not near the track
            //TODO: make this continuous so it is a smooth motion?
            skater.angle = 0;
          }

          skater.position = modelPoint;
          skater.updateEnergy();
        },

        //TODO: The skater pops up sometimes when released, after being at an angle
        end: function( event ) {
          skater.dragging = false;
          skater.velocity = new Vector2( 0, 0 );
          skater.uD = 0;
          skater.startingPosition = new Vector2( skater.position.x, skater.position.y );

          if ( targetTrack ) {
            skater.track = targetTrack;
            skater.u = targetT;
            skater.startingU = targetT;
            skater.startingTrack = targetTrack;
          }
          else {
            skater.track = null;
            skater.u = 0;
            skater.startingU = null;
            skater.startingTrack = null;
          }
        }
      } ) );
  }

  return inherit( Image, SkaterNode );
} );