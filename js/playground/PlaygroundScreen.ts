// Copyright 2018-2025, University of Colorado Boulder

/**
 * The "Playground" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import IntentionalAny from '../../../phet-core/js/types/IntentionalAny.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import iconPlaygroundHomescreen_png from '../../images/iconPlaygroundHomescreen_png.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import PlaygroundModel from './model/PlaygroundModel.js';
import PlaygroundScreenView from './view/PlaygroundScreenView.js';

export default class PlaygroundScreen extends Screen<PlaygroundModel, PlaygroundScreenView> {

  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, options?: IntentionalAny ) {

    // eslint-disable-next-line phet/bad-typescript-text
    options = merge( {
      name: EnergySkateParkBasicsStrings.screen.trackPlaygroundStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( iconPlaygroundHomescreen_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),

      tandem: tandem
    }, options );

    super(
      () => new PlaygroundModel( preferencesModel, tandem.createTandem( 'model' ) ),
      model => new PlaygroundScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'PlaygroundScreen', PlaygroundScreen );