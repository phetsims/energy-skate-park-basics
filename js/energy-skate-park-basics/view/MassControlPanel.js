// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node for the mass slider, which changes the skater's mass (and correspondingly, the height)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HSlider = require( 'SUN/HSlider' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );

  // strings
  var controlsMassString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.mass' );
  var smallString = require( 'string!ENERGY_SKATE_PARK_BASICS/small' );
  var largeString = require( 'string!ENERGY_SKATE_PARK_BASICS/large' );

  /**
   * @param {Property.<number>} massProperty axon Property indicating the skater mass
   * @param {Tandem} tandem
   * @constructor
   */
  function MassControlPanel( massProperty, tandem ) {
    var range = { min: Constants.MIN_MASS, max: Constants.MAX_MASS };
    var slider = new HSlider( massProperty, range, _.extend( {
      tandem: tandem.createTandem( 'slider' )
    }, Constants.SLIDER_OPTIONS ) );
    var tickFont = new PhetFont( 10 );

    var textOptions = {
      font: tickFont,
      maxWidth: 54 // selected by choosing the length of widest English string in ?stringTest=double
    };
    slider.addMajorTick( Constants.MIN_MASS, new TandemText( smallString, _.extend( { tandem: tandem.createTandem( 'smallTextNode' ) }, textOptions ) ) );
    slider.addMajorTick( Constants.MAX_MASS, new TandemText( largeString, _.extend( { tandem: tandem.createTandem( 'largeTextNode' ) }, textOptions ) ) );

    // Space the label above the tick labels so that it won't overlap for i18n
    var text = new TandemText( controlsMassString, {
      tandem: tandem.createTandem( 'massStringTextNode' ),
      font: new PhetFont( { weight: 'bold', size: 13 } ),
      maxWidth: 100 // selected by choosing the length of widest English string in ?stringTest=double
    } );
    VBox.call( this, {
      resize: false,
      spacing: -3,
      children: [ text, slider ]
    } );
  }

  energySkateParkBasics.register( 'MassControlPanel', MassControlPanel );

  return inherit( VBox, MassControlPanel );
} );