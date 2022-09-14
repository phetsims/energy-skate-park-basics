// Copyright 2018-2022, University of Colorado Boulder

/**
 * The "Friction" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import { Image } from '../../../scenery/js/imports.js';
import iconFrictionHomescreen_png from '../../images/iconFrictionHomescreen_png.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import FrictionModel from './model/FrictionModel.js';
import FrictionScreenView from './view/FrictionScreenView.js';

class FrictionScreen extends Screen {

  /**
   * @param {EnergySkateParkPreferencesModel} preferencesModel
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( preferencesModel, tandem, options ) {
    options = merge( {
      name: EnergySkateParkBasicsStrings.screen.frictionStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( iconFrictionHomescreen_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),

      tandem: tandem
    }, options );

    super(
      () => new FrictionModel( preferencesModel, tandem.createTandem( 'model' ) ),
      model => new FrictionScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'FrictionScreen', FrictionScreen );
export default FrictionScreen;