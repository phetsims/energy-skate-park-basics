// Copyright 2018-2019, University of Colorado Boulder

/**
 * ScreenView for the intro in Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkScreenView = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/EnergySkateParkScreenView' );

  class IntroScreenView extends EnergySkateParkScreenView {

    /**
     * @param {IntroModel} model
     * @param  {Tandem} tandem
     */
    constructor( model, tandem ) {
      const introControls = [ new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ) ];
      super( model, introControls, tandem.createTandem( 'introScreenView' ), {
        showMeasuringTape: false,
        showReferenceHeight: false,
        showBarGraphZoomButtons: false,
        showSeparateVisibilityControlsPanel: false,
        visibilityControlsOptions: {
          showGridCheckbox: true
        }
      } );
    }
  }

  return energySkateParkBasics.register( 'IntroScreenView', IntroScreenView );
} );