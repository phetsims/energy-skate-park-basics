// Copyright 2018, University of Colorado Boulder

/**
 * Intro model for Energy Skate Park: Basics
 * @author Jesse Greenberg
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
  function IntroModel( tandem ) {

    // track set model without friction
    EnergySkateParkTrackSetModel.call( this, false, tandem.createTandem( 'introModel' ), {

      // TODO: Why is the default being passed to options? Can we remove this?
      skaterOptions: {
        defaultMass: Constants.DEFAULT_MASS,
        massRange: Constants.MASS_RANGE
      }
    } );

    this.addTrackSet( EnergySkateParkTrackSetModel.createBasicsTrackSet( this, tandem ) );
  }

  energySkateParkBasics.register( 'IntroModel', IntroModel );

  return inherit( EnergySkateParkTrackSetModel, IntroModel );
} );
