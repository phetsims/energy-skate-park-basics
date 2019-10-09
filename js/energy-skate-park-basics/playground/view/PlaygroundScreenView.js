// Copyright 2018-2019, University of Colorado Boulder

/**
 * ScreenView for the Playground screen of Energy Skate Park: Basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkPlaygroundScreenView = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/EnergySkateParkPlaygroundScreenView' );
  const FrictionSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/FrictionSlider' );
  const MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );

  class PlaygroundScreenView extends EnergySkateParkPlaygroundScreenView {

    /**
     * @param   {EnergySkateParkPlaygroundModel} model
     * @param   {Tandem} tandem
     */
    constructor( model, tandem ) {
      const playgroundControls = [
        new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ),
        new FrictionSlider( model.frictionProperty, tandem.createTandem( 'frictionSlider' ) )
      ];
      super( model, playgroundControls, tandem.createTandem( 'graphsScreenView' ), {
        showTrackButtons: false,
        showReferenceHeight: false,
        showBarGraphZoomButtons: false,
        showAttachDetachRadioButtons: true,
        showSeparateVisibilityControlsPanel: false,
        visibilityControlsOptions: {
          showGridCheckbox: true
        }
      } );
    }
  }

  return energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );

} );