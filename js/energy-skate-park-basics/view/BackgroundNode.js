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
    this.earth = new Rectangle( 0, 0, 0, 0, {fill: '#64aa64'} );
    this.addChild( this.earth );

    this.grass = new Line( 0, 0, 0, 0, {stroke: '#03862c', lineWidth: 0.06} );
    this.addChild( this.grass );
  }

  return inherit( Node, BackgroundNode, {
    setVisibleModelBounds: function( bounds ) {
      this.earth.setRect( bounds.minX, bounds.minY, bounds.width, 1 );
      this.grass.setLine( bounds.minX, bounds.minY + 1, bounds.maxX, bounds.minY + 1 );
    }
  } );
} );