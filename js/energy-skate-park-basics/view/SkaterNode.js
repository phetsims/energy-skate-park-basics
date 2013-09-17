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
        positionChanged( skaterNode.skater.position );
      }
    } );

    //Show a red dot in the bottom center as the important particle model coordinate
    this.addChild( new Circle( 4, {fill: 'red', x: imageWidth / scale / 2, y: imageHeight / scale } ) );

    //Update the position and angle.  Normally the angle would only change if the position has also changed.
    //TODO: Once on reset all the angle didn't update
    var positionChanged = function( position ) {
      var view = modelViewTransform.modelToViewPosition( position );

      //TODO: Coalesce all of these calls into a single matrix for performance?
      //TODO: Or at least cache rotation value?
      skaterNode.setTranslation( view.x - imageWidth / 2, view.y - imageHeight );
      skaterNode.setRotation( 0 );

      //Keep angle when leaving a track, but optimize for straight up and down skater
      if ( skaterNode.skater.angle !== 0 ) {
        skaterNode.rotateAround( new Vector2( view.x, view.y ), skaterNode.skater.angle );
      }
    };
    this.skater.positionProperty.link( positionChanged );
    this.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
//          handleEvent( event );
          skaterNode.skater.dragging = true;
        },
        drag: function( event ) {
//          console.log( event );
          var t = skaterNode.globalToParentPoint( event.pointer.point );
          var model = modelViewTransform.viewToModelPosition( t );
          skaterNode.skater.position = model;
          skaterNode.skater.updateEnergy();
        },
        end: function( event ) {
          skaterNode.skater.dragging = false;

          //TODO: search up to see if the skater's hot spot is right below a track.  Bump him up if the user meant to put him on the track
        }
      } ) );
  }

  return inherit( Image, SkaterNode );
} );