// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the skater, which is draggable.
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

  function SkaterNode( model, modelViewTransform ) {

    this.skater = model.skater;
    var skaterNode = this;

    //Make him 2 meters tall, with skateboard
    var scale = 0.33;
    Image.call( skaterNode, images.getImage( 'skater.png' ), { scale: scale, renderer: 'svg', rendererOptions: {cssTransform: true}, cursor: 'pointer'} );
    var imageWidth = this.width;
    var imageHeight = this.height;

    //Show a red dot in the bottom center as the important particle model coordinate
    this.addChild( new Circle( 4, {fill: 'red', x: imageWidth / scale / 2, y: imageHeight / scale } ) );

    this.skater.positionProperty.link( function( position ) {
      var view = modelViewTransform.modelToViewPosition( position );

      //TODO: Coalesce all of these calls into a single matrix for performance?
      skaterNode.setTranslation( view.x - imageWidth / 2, view.y - imageHeight );
      skaterNode.setRotation( 0 );
      if ( skaterNode.skater.track ) {
        var angle = skaterNode.skater.track.getViewAngleAt( skaterNode.skater.u );
        skaterNode.rotateAround( new Vector2( view.x, view.y ), angle );
      }
    } );
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
        }
      } ) );
  }

  return inherit( Image, SkaterNode );
} );