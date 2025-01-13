// Copyright 2018-2022, University of Colorado Boulder

/**
 * Friction model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnergySkateParkBasicsTrackSetModel from '../../common/model/EnergySkateParkBasicsTrackSetModel.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsConstants from '../../EnergySkateParkBasicsConstants.js';

export default class FrictionModel extends EnergySkateParkBasicsTrackSetModel {

  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem ) {
    super( preferencesModel, tandem.createTandem( 'frictionModel' ), EnergySkateParkBasicsConstants.BASICS_MODEL_OPTIONS );
  }
}

energySkateParkBasics.register( 'FrictionModel', FrictionModel );