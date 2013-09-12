// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );

  function SkaterNode( model, mvt ) {

    this.skater = model.skater;
    var skaterNode = this;
    Node.call( skaterNode, { renderer: 'svg' } );

    var skaterImage = new Image( images.getImage( 'skater.png' ) );
    skaterImage.scale( 1, -1 );
    skaterImage.translate( 0, -1 );
    var imageHeight = skaterImage.height;
    var modelHeight = 1;
    var sm = modelHeight / imageHeight;
    skaterImage.setScaleMagnitude( sm );
    console.log( sm );
//    this.addChild( new Rectangle( 0, 0, 1, 1, {fill: 'red'} ) );
    this.addChild( skaterImage );

    this.skater.positionProperty.link( function( position ) {
      skaterNode.setTranslation( position );
//      console.log( 'hello', position );
//      console.log( skaterImage.globalBounds );
    } );
    this.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
//          handleEvent( event );
        },
        drag: function( event ) {
//          console.log( event );
          var t = skaterNode.globalToParentPoint( event.pointer.point );
          skaterNode.skater.position = t;
        }
      } ) );
  }

  return inherit( Node, SkaterNode );
} );