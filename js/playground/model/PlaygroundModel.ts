// Copyright 2018-2025, University of Colorado Boulder

/**
 * Playground model for Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import EnergySkateParkPlaygroundModel from '../../../../energy-skate-park/js/playground/model/EnergySkateParkPlaygroundModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsConstants from '../../EnergySkateParkBasicsConstants.js';

export default class PlaygroundModel extends EnergySkateParkPlaygroundModel {
  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem ) {
    super( preferencesModel, tandem.createTandem( 'playgroundModel' ), EnergySkateParkBasicsConstants.BASICS_MODEL_OPTIONS );
  }
}

energySkateParkBasics.register( 'PlaygroundModel', PlaygroundModel );