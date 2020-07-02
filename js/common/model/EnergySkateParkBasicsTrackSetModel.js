// Copyright 2019-2020, University of Colorado Boulder

/**
 * A track set model for Energy Skate Park: Basics. Extends EnergySkateParkTrackSetModel, but assembles the
 * appropriate tracks for the basics version of the sim.
 *
 * @author Jesse Greenberg
 */

import EnergySkateParkTrackSetModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkTrackSetModel.js';
import PremadeTracks from '../../../../energy-skate-park/js/common/model/PremadeTracks.js';
import merge from '../../../../phet-core/js/merge.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

class EnergySkateParkBasicsTrackSetModel extends EnergySkateParkTrackSetModel {

  /**
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( tandem, options ) {
    options = merge( {
      trackTypes: [
        PremadeTracks.TrackType.PARABOLA,
        PremadeTracks.TrackType.SLOPE,
        PremadeTracks.TrackType.DOUBLE_WELL
      ]
    }, options );

    super( tandem, options );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetModel', EnergySkateParkBasicsTrackSetModel );
export default EnergySkateParkBasicsTrackSetModel;