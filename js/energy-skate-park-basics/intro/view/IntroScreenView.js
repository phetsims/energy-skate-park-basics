// Copyright 2018-2019, University of Colorado Boulder

/**
 * ScreenView for the intro in Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkScreenView = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/EnergySkateParkScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {IntroModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroScreenView( model, tandem ) {
    var introControls = [ new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ) ];
    EnergySkateParkScreenView.call( this, model, introControls, tandem.createTandem( 'introScreenView' ), {
      includeMeasuringTapePanel: false,
      showReferenceHeight: false,
      showBarGraphZoomButtons: false
    } );
  }

  energySkateParkBasics.register( 'IntroScreenView', IntroScreenView );

  return inherit( EnergySkateParkScreenView, IntroScreenView );
} );