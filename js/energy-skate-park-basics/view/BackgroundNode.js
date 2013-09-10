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

  function BackgroundNode( model, energySkateParkBasicsView ) {
    this.skater = model.skater;
    Node.call( this, { renderer: 'svg' } );

    this.addChild( new Rectangle( 0, 0, energySkateParkBasicsView.layoutBounds.width, energySkateParkBasicsView.layoutBounds.height, {fill: 'yellow'} ) );
  }

  return inherit( Node, BackgroundNode );
} );