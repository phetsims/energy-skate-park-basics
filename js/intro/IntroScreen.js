// Copyright 2018-2022, University of Colorado Boulder

/**
 * The "Intro" screen.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import { Image } from '../../../scenery/js/imports.js';
import iconIntroHomescreen_png from '../../images/iconIntroHomescreen_png.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

/**
 * @param {EnergySkateParkPreferencesModel} preferencesModel
 * @param {Tandem} tandem
 */
class IntroScreen extends Screen {
  constructor( preferencesModel, tandem, options ) {
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
export default IntroScreen;