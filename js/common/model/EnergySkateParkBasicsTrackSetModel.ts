// Copyright 2019-2025, University of Colorado Boulder

/**
 * A track set model for Energy Skate Park: Basics. Extends EnergySkateParkTrackSetModel, but assembles the
 * appropriate tracks for the basics version of the sim.
 *
 * @author Jesse Greenberg
 */

import EnergySkateParkPreferencesModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import EnergySkateParkTrackSetModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkTrackSetModel.js';
import PremadeTracks from '../../../../energy-skate-park/js/common/model/PremadeTracks.js';
import merge from '../../../../phet-core/js/merge.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

export default class EnergySkateParkBasicsTrackSetModel extends EnergySkateParkTrackSetModel {

  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, options?: IntentionalAny ) {

    // eslint-disable-next-line phet/bad-typescript-text
    options = merge( {
      trackTypes: [
        PremadeTracks.TrackType.PARABOLA,
        PremadeTracks.TrackType.SLOPE,
        PremadeTracks.TrackType.DOUBLE_WELL
      ]
    }, options );

    super( preferencesModel, tandem, options );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetModel', EnergySkateParkBasicsTrackSetModel );