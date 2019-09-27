// Copyright 2013-2019, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergySkateParkSim = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/EnergySkateParkSim' );
  const FrictionScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/friction/FrictionScreen' );
  const IntroScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/intro/IntroScreen' );
  const PlaygroundScreen = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/playground/PlaygroundScreen' );

  // strings
  const energySkateParkBasicsTitleString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics.title' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  class EnergySkateParkBasicsSim extends EnergySkateParkSim {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      const options = {
        credits: {
          leadDesign: 'Ariel Paul, Noah Podolefsky, Sam Reid',
          softwareDevelopment: 'Sam Reid, Jesse Greenberg',
          team: 'Michael Dubson, Bryce Gruneich, Trish Loeblein, Emily B. Moore, Kathy Perkins',
          graphicArts: 'Sharon Siman-Tov, Amanda McGarry',
          qualityAssurance: 'Steele Dalton, Oliver Orejola, Arnab Purkayastha, Bryan Yoelin'
        }
      };

      const screens = [
        new IntroScreen( tandem.createTandem( 'introScreen' ) ),
        new FrictionScreen( tandem.createTandem( 'frictionScreen' ) ),
        new PlaygroundScreen( tandem.createTandem( 'playgroundScreen' ) )
      ];

      super( energySkateParkBasicsTitleString, screens, tandem, options );
    }
  }

  return energySkateParkBasics.register( 'EnergySkateParkBasicsSim', EnergySkateParkBasicsSim );
} );