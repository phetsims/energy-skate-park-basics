// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Image = require( 'SCENERY/nodes/Image' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function BackgroundNode( model, energySkateParkBasicsView ) {
    this.skater = model.skater;
    Node.call( this, { renderer: 'svg', pickable: false } );

    this.sky = new Rectangle( 0, 0, 0, 0 );
    this.addChild( this.sky );

    //Wait for bounds to fill in the grass
    this.earth = new Rectangle( 0, 0, 100, 100, {fill: '#64aa64'} );
    this.addChild( this.earth );

    this.grassY = 504 - 100;
    this.grass = new Line( 0, 0, 0, 0, {stroke: '#03862c', lineWidth: 3} );
    this.addChild( this.grass );

    this.mountain = new Image( images.getImage( 'mountains.png' ), {bottom: this.grassY} );
    this.addChild( this.mountain );
  }

  return inherit( Node, BackgroundNode, {

    //Exactly fit the geometry to the screen so no matter what aspect ratio it will always show something.  Perhaps it will improve performance too?
    layout: function( offsetX, offsetY, width, height, layoutScale ) {
      var grassY = this.grassY;
      this.earth.setRect( -offsetX, grassY, width / layoutScale, 100 );
      this.grass.setLine( -offsetX, grassY, -offsetX + width / layoutScale, grassY );
      this.sky.setRect( -offsetX, -offsetY, width / layoutScale, height / layoutScale - 100 );
      this.sky.fill = new LinearGradient( 0, 0, 0, height / 2 ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
    }
  } );
} );