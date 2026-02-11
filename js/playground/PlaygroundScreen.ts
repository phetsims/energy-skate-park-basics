// Copyright 2018-2026, University of Colorado Boulder

/**
 * The "Playground" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import EnergySkateParkFluent from '../../../energy-skate-park/js/EnergySkateParkFluent.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import WithOptional from '../../../phet-core/js/types/WithOptional.js';
import Tandem from '../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import PlaygroundModel from './model/PlaygroundModel.js';
import PlaygroundScreenIcon from './view/PlaygroundScreenIcon.js';
import PlaygroundScreenView from './view/PlaygroundScreenView.js';

type SelfOptions = EmptySelfOptions;

type PlaygroundScreenOptions = SelfOptions & WithOptional<ScreenOptions, 'tandem'>;

export default class PlaygroundScreen extends Screen<PlaygroundModel, PlaygroundScreenView> {

  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, providedOptions?: PlaygroundScreenOptions ) {

    const options = optionize<PlaygroundScreenOptions, SelfOptions, ScreenOptions>()( {
      name: EnergySkateParkBasicsStrings.screen.trackPlaygroundStringProperty,
      homeScreenIcon: new PlaygroundScreenIcon(),
      screenButtonsHelpText: EnergySkateParkFluent.a11y.screenButtons.playground.accessibleHelpTextStringProperty,

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