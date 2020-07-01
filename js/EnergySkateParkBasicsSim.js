// Copyright 2013-2020, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import EnergySkateParkSim from '../../energy-skate-park/js/common/EnergySkateParkSim.js';
import energySkateParkBasicsStrings from './energySkateParkBasicsStrings.js';
import energySkateParkBasics from './energySkateParkBasics.js';
import FrictionScreen from './friction/FrictionScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import PlaygroundScreen from './playground/PlaygroundScreen.js';

const energySkateParkBasicsTitleString = energySkateParkBasicsStrings[ 'energy-skate-park-basics' ].title;

/**
 * @param {Tandem} tandem
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

energySkateParkBasics.register( 'EnergySkateParkBasicsSim', EnergySkateParkBasicsSim );
export default EnergySkateParkBasicsSim;