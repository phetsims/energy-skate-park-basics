// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node for the friction control, including on/off radio buttons and a slider. Only shown in screens 2-3.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
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
   * @param {Tandem} tandem
   * @constructor
   */
  function FrictionControl( frictionProperty, tandem ) {
    var frictionRange = { min: 0, max: frictionProperty.value * 2 };
    var slider = new HSlider( frictionProperty, frictionRange, _.extend( { tandem: tandem }, Constants.SLIDER_OPTIONS ) );
    var tickFont = new PhetFont( 10 );

    var textOptions = {
      font: tickFont,
      maxWidth: 54 // selected by choosing the length of widest English string in ?stringTest=double
    };
    slider.addMajorTick( frictionRange.min, new Text( controlsGravityNoneString, textOptions ) );
    slider.addMajorTick( frictionRange.max, new Text( controlsGravityLotsString, textOptions ) );

    // Space the label above the tick labels so that it won't overlap for i18n
    var text = new Text( controlsFrictionTitleString, {
      font: new PhetFont( { weight: 'bold', size: 13 } ),
      maxWidth: 100 // selected by choosing the length of widest English string in ?stringTest=double
    } );
    VBox.call( this, {
      resize: false,
      spacing: -3,
      children: [ text, slider ]
    } );
  }

  energySkateParkBasics.register( 'FrictionControl', FrictionControl );

  return inherit( VBox, FrictionControl );
} );