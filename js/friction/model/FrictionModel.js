// Copyright 2018-2022, University of Colorado Boulder

/**
 * Friction model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkBasicsTrackSetModel from '../../common/model/EnergySkateParkBasicsTrackSetModel.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsConstants from '../../EnergySkateParkBasicsConstants.js';

class FrictionModel extends EnergySkateParkBasicsTrackSetModel {

  /**
   * @param {EnergySkateParkPreferencesModel} preferencesModel
   * @param {Tandem} tandem
   */
  constructor( preferencesModel, tandem ) {
    super( preferencesModel, tandem.createTandem( 'frictionModel' ), EnergySkateParkBasicsConstants.BASICS_MODEL_OPTIONS );
  }
}

energySkateParkBasics.register( 'FrictionModel', FrictionModel );
export default FrictionModel;