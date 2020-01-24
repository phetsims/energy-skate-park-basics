// Copyright 2018-2020, University of Colorado Boulder

/**
 * Intro model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkBasicsTrackSetModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/common/model/EnergySkateParkBasicsTrackSetModel' );
  const merge = require( 'PHET_CORE/merge' );


  class IntroModel extends EnergySkateParkBasicsTrackSetModel {

    /**
     * @param {Tandem} tandem
     * @constructor
     */
    constructor( tandem ) {
      super( tandem, merge( {}, Constants.BASICS_MODEL_OPTIONS, { includeFriction: false } ) );
    }
  }

  return energySkateParkBasics.register( 'IntroModel', IntroModel );
} );