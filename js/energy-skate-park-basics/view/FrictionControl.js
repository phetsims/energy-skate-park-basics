// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node for the friction control, including on/off radio buttons and a slider. Only shown in screens 2-3.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HSlider = require( 'SUN/HSlider' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );

  // strings
  var controlsFrictionTitleString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.friction.title' );
  var controlsGravityNoneString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.gravity.none' );
  var controlsGravityLotsString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.gravity.lots' );

  /**
   * @param {Property<Number>} frictionProperty the axon property representing the value of the friction
   * @constructor
   */
  function FrictionControl( frictionProperty, options ) {
    var frictionRange = { min: 0, max: frictionProperty.value * 2 };
    var slider = new HSlider( frictionProperty, frictionRange, _.extend( { phetioID: options.phetioID }, Constants.SLIDER_OPTIONS ) );
    var tickFont = new PhetFont( 10 );
    slider.addMajorTick( frictionRange.min, new Text( controlsGravityNoneString, { font: tickFont } ) );
    slider.addMajorTick( frictionRange.max, new Text( controlsGravityLotsString, { font: tickFont } ) );

    // Space the friction label above the tick labels so that it won't overlap for i18n
    VBox.call( this, {
      resize: false,
      spacing: -4,
      children: [ new Text( controlsFrictionTitleString, new PhetFont( 14 ) ), slider ]
    } );
  }

  return inherit( VBox, FrictionControl );
} );