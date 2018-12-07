// Copyright 2018, University of Colorado Boulder

/**
 * Playground model for Energy Skate Park: Basics.
 * 
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkPlaygroundModel = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/model/EnergySkateParkPlaygroundModel' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );

  /**
   * @constructor
   */
  function PlaygroundModel( tandem ) {

    // track set model with friction
    EnergySkateParkPlaygroundModel.call( this, true, tandem.createTandem( 'playgroundModel' ), {

      // TODO: Why is the default being passed to options? Can we remove this?
      skaterOptions: {
        defaultMass: Constants.DEFAULT_MASS,
        massRange: Constants.MASS_RANGE
      }
    } );
  }

  energySkateParkBasics.register( 'PlaygroundModel', PlaygroundModel );

  return inherit( EnergySkateParkPlaygroundModel, PlaygroundModel );
} );
