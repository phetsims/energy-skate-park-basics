// Copyright 2018-2026, University of Colorado Boulder

/**
 * The "Playground" screen of Energy Skate Park: Basics.
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
import iconPlaygroundHomescreen_png from '../../images/iconPlaygroundHomescreen_png.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import PlaygroundModel from './model/PlaygroundModel.js';
import PlaygroundScreenView from './view/PlaygroundScreenView.js';

type SelfOptions = EmptySelfOptions;

type PlaygroundScreenOptions = SelfOptions & WithOptional<ScreenOptions, 'tandem'>;

export default class PlaygroundScreen extends Screen<PlaygroundModel, PlaygroundScreenView> {

  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, providedOptions?: PlaygroundScreenOptions ) {

    const options = optionize<PlaygroundScreenOptions, SelfOptions, ScreenOptions>()( {
      name: EnergySkateParkBasicsStrings.screen.trackPlaygroundStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( iconPlaygroundHomescreen_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),

      tandem: tandem
    }, providedOptions );

    super(
      () => new PlaygroundModel( preferencesModel, tandem.createTandem( 'model' ) ),
      model => new PlaygroundScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'PlaygroundScreen', PlaygroundScreen );