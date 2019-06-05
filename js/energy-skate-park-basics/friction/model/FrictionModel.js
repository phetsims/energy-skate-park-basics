// Copyright 2018, University of Colorado Boulder

/**
 * Friction model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkBasicsTrackSetModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/common/model/EnergySkateParkBasicsTrackSetModel' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  class FrictionModel extends EnergySkateParkBasicsTrackSetModel {
    constructor( tandem ) {
      const includeFriction = true;
      super( includeFriction, tandem.createTandem( 'frictionModel' ), Constants.BASICS_MODEL_OPTIONS );
    }
  }

  return energySkateParkBasics.register( 'FrictionModel', FrictionModel );
} );