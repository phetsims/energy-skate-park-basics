// Copyright 2018, University of Colorado Boulder

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
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function PlaygroundModel( tandem ) {

    // track set model with friction
    EnergySkateParkPlaygroundModel.call( this, true, tandem.createTandem( 'playgroundModel' ), Constants.BASICS_MODEL_OPTIONS );
  }

  energySkateParkBasics.register( 'PlaygroundModel', PlaygroundModel );

  return inherit( EnergySkateParkPlaygroundModel, PlaygroundModel );
} );