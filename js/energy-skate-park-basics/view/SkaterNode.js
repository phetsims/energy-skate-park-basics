// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Vector2 = require( 'DOT/Vector2' );

  function SkaterNode( model, modelViewTransform ) {

    this.skater = model.skater;
    var skaterNode = this;
    var scale = 0.4;
    Image.call( skaterNode, images.getImage( 'skater.png' ), { scale: scale, renderer: 'svg' } );
    var imageWidth = this.width;
    var imageHeight = this.height;

    //Show a red dot in the bottom center as the important particle model coordinate
    this.addChild( new Circle( 4, {fill: 'red', x: imageWidth / scale / 2, y: imageHeight / scale } ) );

    this.skater.positionProperty.link( function( position ) {
      var viewX = modelViewTransform.modelToViewX( position.x );
      var viewY = modelViewTransform.modelToViewY( position.y );

      skaterNode.setTranslation( viewX - imageWidth / 2, viewY - imageHeight );
    } );
    this.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
//          handleEvent( event );
        },
        drag: function( event ) {
//          console.log( event );
          var t = skaterNode.globalToParentPoint( event.pointer.point );
          var modelX = modelViewTransform.viewToModelX( t.x );
          var modelY = modelViewTransform.viewToModelY( t.y );
          skaterNode.skater.position = new Vector2( modelX, modelY );
        }
      } ) );
  }

  return inherit( Image, SkaterNode );
} );