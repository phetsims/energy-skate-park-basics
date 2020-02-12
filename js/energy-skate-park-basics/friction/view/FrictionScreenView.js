// Copyright 2018-2020, University of Colorado Boulder

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

  class FrictionScreenView extends EnergySkateParkBasicsTrackSetScreenView {

    /**
     * @param {FrictionModel} model
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( model, tandem ) {
      super( model, tandem.createTandem( 'introScreenView' ), {
        controlPanelOptions: {
          showGravityControls: false,
          showFrictionControls: true
        }
      } );
    }
  }

  return energySkateParkBasics.register( 'FrictionScreenView', FrictionScreenView );
} );