// Copyright 2018-2020, University of Colorado Boulder

/**
 * Intro model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsTrackSetModel from '../../common/model/EnergySkateParkBasicsTrackSetModel.js';
import EnergySkateParkBasicsConstants from '../../EnergySkateParkBasicsConstants.js';

class IntroModel extends EnergySkateParkBasicsTrackSetModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem, merge( {}, EnergySkateParkBasicsConstants.BASICS_MODEL_OPTIONS, {

      // the "intro" screen of basics has no friction
      defaultFriction: 0
    } ) );
  }
}

energySkateParkBasics.register( 'IntroModel', IntroModel );
export default IntroModel;