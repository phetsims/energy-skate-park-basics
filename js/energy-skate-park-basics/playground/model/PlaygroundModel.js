// Copyright 2018, University of Colorado Boulder

/**
 * Playground model for Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkPlaygroundModel = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/model/EnergySkateParkPlaygroundModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function PlaygroundModel( tandem ) {

    // track set model with friction
    EnergySkateParkPlaygroundModel.call( this, true, tandem.createTandem( 'playgroundModel' ) );
  }

  energySkateParkBasics.register( 'PlaygroundModel', PlaygroundModel );

  return inherit( EnergySkateParkPlaygroundModel, PlaygroundModel );
} );