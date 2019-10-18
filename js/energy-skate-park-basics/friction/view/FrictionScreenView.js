// Copyright 2018-2019, University of Colorado Boulder

/**
 * ScreenView for the Friction screen in Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkBasicsTrackSetScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/common/view/EnergySkateParkBasicsTrackSetScreenView' );
  const FrictionSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/FrictionSlider' );
  const MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/MassSlider' );

  class FrictionScreenView extends EnergySkateParkBasicsTrackSetScreenView {

    /**
     * @param {FrictionModel} model
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( model, tandem ) {
      const frictionControls = [
        new MassSlider( model.skater.massProperty, model.skater.massRange, tandem.createTandem( 'massSlider' ) ),
        new FrictionSlider( model.frictionProperty, tandem.createTandem( 'frictionSlider' ) )
      ];
      super( model, frictionControls, tandem.createTandem( 'introScreenView' ) );
    }
  }

  return energySkateParkBasics.register( 'FrictionScreenView', FrictionScreenView );
} );