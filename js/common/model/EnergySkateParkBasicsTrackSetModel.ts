// Copyright 2019-2026, University of Colorado Boulder

/**
 * A track set model for Energy Skate Park: Basics. Extends EnergySkateParkTrackSetModel, but assembles the
 * appropriate tracks for the basics version of the sim.
 *
 * @author Jesse Greenberg
 */

import EnergySkateParkPreferencesModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkPreferencesModel.js';
import EnergySkateParkTrackSetModel, { EnergySkateParkTrackSetModelOptions } from '../../../../energy-skate-park/js/common/model/EnergySkateParkTrackSetModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

type SelfOptions = EmptySelfOptions;

type EnergySkateParkBasicsTrackSetModelOptions = SelfOptions & EnergySkateParkTrackSetModelOptions;

export default class EnergySkateParkBasicsTrackSetModel extends EnergySkateParkTrackSetModel {

  public constructor( preferencesModel: EnergySkateParkPreferencesModel, tandem: Tandem, providedOptions?: EnergySkateParkBasicsTrackSetModelOptions ) {

    const options = optionize<EnergySkateParkBasicsTrackSetModelOptions, SelfOptions, EnergySkateParkTrackSetModelOptions>()( {
      trackTypes: [
        'PARABOLA',
        'RAMP',
        'DOUBLE_WELL'
      ]
    }, providedOptions );

    super( preferencesModel, tandem, options );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetModel', EnergySkateParkBasicsTrackSetModel );