// Copyright 2018-2022, University of Colorado Boulder

/**
 * The "Intro" screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import IntentionalAny from '../../../phet-core/js/types/IntentionalAny.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import iconIntroHomescreen_png from '../../images/iconIntroHomescreen_png.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {
  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, options?: IntentionalAny ) {

    // eslint-disable-next-line phet/bad-typescript-text
    options = merge( {
      name: EnergySkateParkBasicsStrings.screen.introductionStringProperty,
      tandem: tandem,
      homeScreenIcon: new ScreenIcon( new Image( iconIntroHomescreen_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
    }, options );

    super(
      () => new IntroModel( preferencesModel, tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'IntroScreen', IntroScreen );