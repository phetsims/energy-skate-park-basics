// Copyright 2018, University of Colorado Boulder

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
  var EnergySkateParkTrackSetModel = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/model/EnergySkateParkTrackSetModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroModel( tandem ) {

    // track set model without friction
    EnergySkateParkTrackSetModel.call( this, false, tandem, Constants.BASICS_MODEL_OPTIONS );

    this.addTrackSet( EnergySkateParkTrackSetModel.createBasicsTrackSet( this, tandem ) );
  }

  energySkateParkBasics.register( 'IntroModel', IntroModel );

  return inherit( EnergySkateParkTrackSetModel, IntroModel );
} );