// Copyright 2018-2022, University of Colorado Boulder

/**
 * The "Playground" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import { Image } from '../../../scenery/js/imports.js';
import iconPlaygroundHomescreen_png from '../../images/iconPlaygroundHomescreen_png.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import PlaygroundModel from './model/PlaygroundModel.js';
import PlaygroundScreenView from './view/PlaygroundScreenView.js';

class PlaygroundScreen extends Screen {

  /**
   * @param {EnergySkateParkPreferencesModel} preferencesModel
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( preferencesModel, tandem, options ) {
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
export default PlaygroundScreen;