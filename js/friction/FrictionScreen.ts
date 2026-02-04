// Copyright 2018-2026, University of Colorado Boulder

/**
 * The "Friction" screen of Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import WithOptional from '../../../phet-core/js/types/WithOptional.js';
import Tandem from '../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from '../EnergySkateParkBasicsStrings.js';
import FrictionModel from './model/FrictionModel.js';
import FrictionScreenIcon from './view/FrictionScreenIcon.js';
import FrictionScreenView from './view/FrictionScreenView.js';

type SelfOptions = EmptySelfOptions;

type FrictionScreenOptions = SelfOptions & WithOptional<ScreenOptions, 'tandem'>;

export default class FrictionScreen extends Screen<FrictionModel, FrictionScreenView> {

  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, providedOptions?: FrictionScreenOptions ) {

    const options = optionize<FrictionScreenOptions, SelfOptions, ScreenOptions>()( {
      name: EnergySkateParkBasicsStrings.screen.frictionStringProperty,
      homeScreenIcon: new FrictionScreenIcon(),

      tandem: tandem
    }, providedOptions );

    super(
      () => new FrictionModel( preferencesModel, tandem.createTandem( 'model' ) ),
      model => new FrictionScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

energySkateParkBasics.register( 'FrictionScreen', FrictionScreen );