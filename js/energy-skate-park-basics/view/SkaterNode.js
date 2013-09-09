// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  function SkaterNode( model, mvt ) {

    this.skater = model.skater;
    var skaterNode = this;
    ScreenView.call( skaterNode, { renderer: 'svg' } );

    this.addChild( new Rectangle( 0, 0, 100, 100, {fill: 'blue'} ) );

    this.skater.positionProperty.link( function( position ) {
      skaterNode.setTranslation( position );
//      console.log( 'hello', position );
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

  inherit( ScreenView, SkaterNode );

  return SkaterNode;
} );