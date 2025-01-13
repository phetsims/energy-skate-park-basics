// Copyright 2018-2022, University of Colorado Boulder

/**
 * Intro model for Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPreferencesModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnergySkateParkBasicsTrackSetModel from '../../common/model/EnergySkateParkBasicsTrackSetModel.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsConstants from '../../EnergySkateParkBasicsConstants.js';

export default class IntroModel extends EnergySkateParkBasicsTrackSetModel {

  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem ) {
    super( preferencesModel, tandem, merge( {}, EnergySkateParkBasicsConstants.BASICS_MODEL_OPTIONS, {

      // the "intro" screen of basics has no friction
      defaultFriction: 0
    } ) );
  }
}

energySkateParkBasics.register( 'IntroModel', IntroModel );