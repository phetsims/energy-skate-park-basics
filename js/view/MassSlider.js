// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the mass slider.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HSlider = require( 'SUN/HSlider' );
  var skaterMassString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.mass' );
  var smallString = require( 'string!ENERGY_SKATE_PARK_BASICS/small' );
  var largeString = require( 'string!ENERGY_SKATE_PARK_BASICS/large' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/Constants' );

  function MassSlider( model ) {
    var range = {min: 10, max: 110};
    var slider = new HSlider( model.skater.massProperty, range, Constants.SLIDER_OPTIONS );
    var tickFont = new PhetFont( 10 );
    slider.addMajorTick( 10, new Text( smallString, { font: tickFont } ) );
    slider.addMajorTick( 110, new Text( largeString, { font: tickFont } ) );
    VBox.call( this, {children: [new Text( skaterMassString, new PhetFont( 14 ) ), slider]} );
  }

  return inherit( VBox, MassSlider );
} );