// Copyright 2018-2025, University of Colorado Boulder

/**
 * The "Intro" screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import WithOptional from '../../../phet-core/js/types/WithOptional.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import iconIntroHomescreen_png from '../../images/iconIntroHomescreen_png.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

type SelfOptions = EmptySelfOptions;

type IntroScreenOptions = SelfOptions & WithOptional<ScreenOptions, 'tandem'>;

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {
  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, providedOptions?: IntroScreenOptions ) {

    const options = optionize<IntroScreenOptions, SelfOptions, ScreenOptions>()( {
      name: EnergySkateParkBasicsStrings.screen.introductionStringProperty,
      tandem: tandem,
      homeScreenIcon: new ScreenIcon( new Image( iconIntroHomescreen_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    }, providedOptions );

    super(
      () => new IntroModel( preferencesModel, tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'IntroScreen', IntroScreen );