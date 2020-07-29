// Copyright 2018-2020, University of Colorado Boulder

/**
 * Friction model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsTrackSetModel from '../../common/model/EnergySkateParkBasicsTrackSetModel.js';
import EnergySkateParkBasicsConstants from '../../EnergySkateParkBasicsConstants.js';

class FrictionModel extends EnergySkateParkBasicsTrackSetModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem.createTandem( 'frictionModel' ), EnergySkateParkBasicsConstants.BASICS_MODEL_OPTIONS );
  }
}

energySkateParkBasics.register( 'FrictionModel', FrictionModel );
export default FrictionModel;