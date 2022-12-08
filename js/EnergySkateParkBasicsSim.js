// Copyright 2013-2022, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import EnergySkateParkSim from '../../energy-skate-park/js/common/EnergySkateParkSim.js';
import EnergySkateParkPreferencesModel from '../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Tandem from '../../tandem/js/Tandem.js';
import energySkateParkBasics from './energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from './EnergySkateParkBasicsStrings.js';
import SkaterImages from '../../energy-skate-park/js/common/view/SkaterImages.js';
import FrictionScreen from './friction/FrictionScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import PlaygroundScreen from './playground/PlaygroundScreen.js';

const energySkateParkBasicsTitleStringProperty = EnergySkateParkBasicsStrings[ 'energy-skate-park-basics' ].titleStringProperty;

const energySkateParkPreferencesModel = new EnergySkateParkPreferencesModel( Tandem.PREFERENCES.createTandem( 'energySkateParkPreferencesModel' ) );

/**
 * @param {Tandem} tandem
 */
class EnergySkateParkBasicsSim extends EnergySkateParkSim {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const options = {
      preferencesModel: new PreferencesModel( {
        localizationOptions: {
          characterSets: SkaterImages.SKATER_CHARACTER_SETS,
          supportsDynamicLocales: false
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

    super( energySkateParkBasicsTitleStringProperty, screens, tandem, options );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsSim', EnergySkateParkBasicsSim );
export default EnergySkateParkBasicsSim;