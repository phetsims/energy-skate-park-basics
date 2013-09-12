// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );

  function BackgroundNode( model, energySkateParkBasicsView ) {
    this.skater = model.skater;
    Node.call( this, { renderer: 'svg' } );

    //Wait for bounds to fill in the grass
    this.earth = new Rectangle( 0, 0, 100, 100, {fill: '#64aa64'} );
    this.addChild( this.earth );

    this.grass = new Line( 0, 0, 0, 0, {stroke: '#03862c', lineWidth: 3} );
    this.addChild( this.grass );
  }

  return inherit( Node, BackgroundNode, {

    //Exactly fit the geometry to the screen so no matter what aspect ratio it will always show something.  Perhaps it will improve performance too?
    layout: function( offsetX, offsetY, width, height, layoutScale ) {
      this.earth.setRect( -offsetX, 504 - 100, width / layoutScale, 100 );
      this.grass.setLine( -offsetX, 504 - 100, -offsetX + width / layoutScale, 504 - 100 );
    }
  } );
} );