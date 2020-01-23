// Copyright 2019, University of Colorado Boulder

/**
 * A track set model for Energy Skate Park: Basics. Extends EnergySkateParkTrackSetModel, but assembles the
 * appropriate tracks for the basics version of the sim.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkTrackSetModel = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/model/EnergySkateParkTrackSetModel' );

  class EnergySkateParkBasicsTrackSetModel extends EnergySkateParkTrackSetModel {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem, options ) {
      super( tandem, options );
      this.addTrackSet( EnergySkateParkTrackSetModel.createBasicTrackSet( this, tandem ) );
    }
  }

  return energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetModel', EnergySkateParkBasicsTrackSetModel );
} );