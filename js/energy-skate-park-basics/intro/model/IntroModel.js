// Copyright 2018-2020, University of Colorado Boulder

/**
 * Intro model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../../phet-core/js/merge.js';
import energySkateParkBasics from '../../../energySkateParkBasics.js';
import EnergySkateParkBasicsTrackSetModel from '../../common/model/EnergySkateParkBasicsTrackSetModel.js';
import Constants from '../../Constants.js';

class IntroModel extends EnergySkateParkBasicsTrackSetModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem, merge( {}, Constants.BASICS_MODEL_OPTIONS, { includeFriction: false } ) );
  }
}

energySkateParkBasics.register( 'IntroModel', IntroModel );
export default IntroModel;