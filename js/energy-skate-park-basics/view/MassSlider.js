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
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HSlider = require( 'SUN/HSlider' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );

  // strings
  var controlsMassString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.mass' );
  var smallString = require( 'string!ENERGY_SKATE_PARK_BASICS/small' );
  var largeString = require( 'string!ENERGY_SKATE_PARK_BASICS/large' );

  /**
   * @param {Property<Number>} massProperty axon Property indicating the skater mass
   * @constructor
   */
  function MassSlider( massProperty, options ) {
    var range = { min: Constants.MIN_MASS, max: Constants.MAX_MASS };
    var slider = new HSlider( massProperty, range, _.extend( { phetioID: options.phetioID }, Constants.SLIDER_OPTIONS ) );
    var tickFont = new PhetFont( 10 );

    var textOptions = {
      font: tickFont,
      maxWidth: 54 // selected by choosing the length of widest English string in ?stringTest=double
    };
    slider.addMajorTick( Constants.MIN_MASS, new Text( smallString, textOptions ) );
    slider.addMajorTick( Constants.MAX_MASS, new Text( largeString, textOptions ) );

    // Space the label above the tick labels so that it won't overlap for i18n
    var text = new Text( controlsMassString, {
      font: new PhetFont( { weight: 'bold', size: 13 } ),
      maxWidth: 100 // selected by choosing the length of widest English string in ?stringTest=double
    } );
    VBox.call( this, {
      resize: false,
      spacing: -3,
      children: [ text, slider ]
    } );
  }

  energySkateParkBasics.register( 'MassSlider', MassSlider );
  
  return inherit( VBox, MassSlider );
} );