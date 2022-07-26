// Copyright 2013-2022, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import EnergySkateParkSim from '../../energy-skate-park/js/common/EnergySkateParkSim.js';
import EnergySkateParkPreferencesModel from '../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import EnergySkateParkLocalizationNode from '../../energy-skate-park/js/common/view/EnergySkateParkLocalizationNode.js';
import PreferencesConfiguration from '../../joist/js/preferences/PreferencesConfiguration.js';
import Tandem from '../../tandem/js/Tandem.js';
import energySkateParkBasics from './energySkateParkBasics.js';
import energySkateParkBasicsStrings from './energySkateParkBasicsStrings.js';
import FrictionScreen from './friction/FrictionScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import PlaygroundScreen from './playground/PlaygroundScreen.js';

const energySkateParkBasicsTitleString = energySkateParkBasicsStrings[ 'energy-skate-park-basics' ].title;

const energySkateParkPreferencesModel = new EnergySkateParkPreferencesModel( Tandem.GLOBAL_MODEL.createTandem( 'energySkateParkPreferencesModel' ) );

/**
 * @param {Tandem} tandem
 */
class EnergySkateParkBasicsSim extends EnergySkateParkSim {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const options = {
      preferencesConfiguration: new PreferencesConfiguration( {
        generalOptions: {
          createLocalizationControls: tandem => new EnergySkateParkLocalizationNode( energySkateParkPreferencesModel, tandem.createTandem( 'preferencesNode' ) )
        }
      } ),
      credits: {
        leadDesign: 'Ariel Paul, Noah Podolefsky, Sam Reid',
        softwareDevelopment: 'Sam Reid, Jesse Greenberg',
        team: 'Michael Dubson, Bryce Gruneich, Trish Loeblein, Emily B. Moore, Kathy Perkins',
        graphicArts: 'Sharon Siman-Tov, Amanda McGarry',
        qualityAssurance: 'Steele Dalton, Oliver Orejola, Arnab Purkayastha, Bryan Yoelin'
      }
    };

    const screens = [
      new IntroScreen( energySkateParkPreferencesModel, tandem.createTandem( 'introScreen' ) ),
      new FrictionScreen( energySkateParkPreferencesModel, tandem.createTandem( 'frictionScreen' ) ),
      new PlaygroundScreen( energySkateParkPreferencesModel, tandem.createTandem( 'playgroundScreen' ) )
    ];

    super( energySkateParkBasicsTitleString, screens, tandem, options );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsSim', EnergySkateParkBasicsSim );
export default EnergySkateParkBasicsSim;