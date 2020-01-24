// Copyright 2018-2020, University of Colorado Boulder

/**
 * Playground model for Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkPlaygroundModel = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/model/EnergySkateParkPlaygroundModel' );

  class PlaygroundModel extends EnergySkateParkPlaygroundModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super( tandem.createTandem( 'playgroundModel' ), Constants.BASICS_MODEL_OPTIONS );
    }
  }

  return energySkateParkBasics.register( 'PlaygroundModel', PlaygroundModel );
} );