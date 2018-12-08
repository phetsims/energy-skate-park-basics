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
  var EnergySkateParkTrackSetModel = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/model/EnergySkateParkTrackSetModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function FrictionModel( tandem ) {

    // track set model with friction
    EnergySkateParkTrackSetModel.call( this, true, tandem.createTandem( 'frictionModel' ), {

      // TODO: Why is the default being passed to options? Can we remove this?
      skaterOptions: {
        defaultMass: Constants.DEFAULT_MASS,
        massRange: Constants.MASS_RANGE
      }
    } );

    this.addTrackSet( EnergySkateParkTrackSetModel.createBasicsTrackSet( this, tandem ) );
  }

  energySkateParkBasics.register( 'FrictionModel', FrictionModel );

  return inherit( EnergySkateParkTrackSetModel, FrictionModel );
} );