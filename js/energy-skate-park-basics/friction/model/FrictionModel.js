// Copyright 2018-2019, University of Colorado Boulder

/**
 * Friction model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkBasicsTrackSetModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/common/model/EnergySkateParkBasicsTrackSetModel' );

  class FrictionModel extends EnergySkateParkBasicsTrackSetModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super( tandem.createTandem( 'frictionModel' ), Constants.BASICS_MODEL_OPTIONS );
    }
  }

  return energySkateParkBasics.register( 'FrictionModel', FrictionModel );
} );