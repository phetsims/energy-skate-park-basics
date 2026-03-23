// Copyright 2013-2026, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import EnergySkateParkConstants from '../../energy-skate-park/js/common/EnergySkateParkConstants.js';
import EnergySkateParkSim from '../../energy-skate-park/js/common/EnergySkateParkSim.js';
import EnergySkateParkPreferencesModel from '../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import EnergySkateParkVisualPreferencesNode from '../../energy-skate-park/js/common/view/EnergySkateParkVisualPreferencesNode.js';
import Tandem from '../../tandem/js/Tandem.js';
import EnergySkateParkBasicsStrings from './EnergySkateParkBasicsStrings.js';
import FrictionScreen from './friction/FrictionScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import PlaygroundScreen from './playground/PlaygroundScreen.js';

const energySkateParkBasicsTitleStringProperty = EnergySkateParkBasicsStrings[ 'energy-skate-park-basics' ].titleStringProperty;

const energySkateParkPreferencesModel = new EnergySkateParkPreferencesModel();

const preferencesModel = new PreferencesModel( {
  visualOptions: {
    customPreferences: [ {
      createContent: tandem => new EnergySkateParkVisualPreferencesNode( energySkateParkPreferencesModel, tandem.createTandem( 'visualPreferences' ) )
    } ]
  }
} );

export default class EnergySkateParkBasicsSim extends EnergySkateParkSim {

  public constructor( tandem: Tandem ) {
    const options = {
      preferencesModel: preferencesModel,
      credits: EnergySkateParkConstants.CREDITS
    };

    const screens = [
      new IntroScreen( energySkateParkPreferencesModel, tandem.createTandem( 'introScreen' ) ),
      new FrictionScreen( energySkateParkPreferencesModel, tandem.createTandem( 'frictionScreen' ) ),
      new PlaygroundScreen( energySkateParkPreferencesModel, tandem.createTandem( 'playgroundScreen' ) )
    ];

    super( energySkateParkBasicsTitleStringProperty, screens, options );
  }
}
