// Copyright 2018-2026, University of Colorado Boulder

/**
 * Playground model for Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import EnergySkateParkPlaygroundModel from '../../../../energy-skate-park/js/playground/model/EnergySkateParkPlaygroundModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnergySkateParkBasicsConstants from '../../EnergySkateParkBasicsConstants.js';

export default class PlaygroundModel extends EnergySkateParkPlaygroundModel {
  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem ) {
    super( preferencesModel, tandem, EnergySkateParkBasicsConstants.BASICS_MODEL_OPTIONS );
  }
}
