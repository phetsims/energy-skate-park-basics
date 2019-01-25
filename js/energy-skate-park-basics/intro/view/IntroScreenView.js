// Copyright 2018, University of Colorado Boulder

/**
 * ScreenView for the intro in Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergySkateParkControlPanel = require( 'ENERGY_SKATE_PARK/energy-skate-park/view/EnergySkateParkControlPanel' );
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
    EnergySkateParkScreenView.call( this, model, tandem.createTandem( 'introScreenView' ), {
      includeMeasuringTapePanel: false,
      includeReferenceHeightCheckbox: false,

      includeMassSlider: true,
      includeGravitySlider: false,

      barGraphOptions: {
        includeZoomButtons: false
      }
    } );

    var introControls = [ new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ) ];
    this.controlPanel = new EnergySkateParkControlPanel( model, this, introControls, tandem.createTandem( 'controlPanel' ), {
      includeTrackSelection: true
    } );
    this.addToBottomLayer( this.controlPanel );
  }

  energySkateParkBasics.register( 'IntroScreenView', IntroScreenView );

  return inherit( EnergySkateParkScreenView, IntroScreenView );
} );