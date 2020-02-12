// Copyright 2018-2020, University of Colorado Boulder

/**
 * ScreenView for the intro in Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkBasicsTrackSetScreenView = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/common/view/EnergySkateParkBasicsTrackSetScreenView' );

  class IntroScreenView extends EnergySkateParkBasicsTrackSetScreenView {

    /**
     * @param {IntroModel} model
     * @param  {Tandem} tandem
     */
    constructor( model, tandem ) {
      super( model, tandem.createTandem( 'introScreenView' ) );
    }
  }

  return energySkateParkBasics.register( 'IntroScreenView', IntroScreenView );
} );