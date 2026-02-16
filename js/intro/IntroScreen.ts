// Copyright 2018-2026, University of Colorado Boulder

/**
 * The "Intro" screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import EnergySkateParkKeyboardHelpContent from '../../../energy-skate-park/js/common/view/EnergySkateParkKeyboardHelpContent.js';
import EnergySkateParkFluent from '../../../energy-skate-park/js/EnergySkateParkFluent.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import WithOptional from '../../../phet-core/js/types/WithOptional.js';
import Tandem from '../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenIcon from './view/IntroScreenIcon.js';
import IntroScreenView from './view/IntroScreenView.js';

type SelfOptions = EmptySelfOptions;

type IntroScreenOptions = SelfOptions & WithOptional<ScreenOptions, 'tandem'>;

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {
  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, providedOptions?: IntroScreenOptions ) {

    const options = optionize<IntroScreenOptions, SelfOptions, ScreenOptions>()( {
      name: EnergySkateParkBasicsStrings.screen.introductionStringProperty,
      tandem: tandem,
      homeScreenIcon: new IntroScreenIcon(),
      screenButtonsHelpText: EnergySkateParkFluent.a11y.screenButtons.intro.accessibleHelpTextStringProperty,
      createKeyboardHelpNode: () => new EnergySkateParkKeyboardHelpContent()
    }, providedOptions );

    super(
      () => new IntroModel( preferencesModel, tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'IntroScreen', IntroScreen );