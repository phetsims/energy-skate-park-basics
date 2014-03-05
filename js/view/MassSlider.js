// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the mass slider, which changes the skater's mass.
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

  function MassSlider( massProperty ) {
    var range = {min: Constants.MIN_MASS, max: Constants.MAX_MASS};
    var slider = new HSlider( massProperty, range, Constants.SLIDER_OPTIONS );
    var tickFont = new PhetFont( 10 );
    slider.addMajorTick( Constants.MIN_MASS, new Text( smallString, { font: tickFont } ) );
    slider.addMajorTick( Constants.MAX_MASS, new Text( largeString, { font: tickFont } ) );
    VBox.call( this, {children: [new Text( skaterMassString, new PhetFont( 14 ) ), slider]} );
  }

  return inherit( VBox, MassSlider );
} );