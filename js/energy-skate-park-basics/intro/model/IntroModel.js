// Copyright 2018-2019, University of Colorado Boulder

/**
 * Intro model for Energy Skate Park: Basics
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
  class IntroModel extends EnergySkateParkBasicsTrackSetModel {

    constructor( tandem ) {
      const includesFriction = false;
      super( includesFriction, tandem, Constants.BASICS_MODEL_OPTIONS );
    }
  }

  return energySkateParkBasics.register( 'IntroModel', IntroModel );
} );