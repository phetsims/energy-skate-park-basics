// Copyright 2019-2020, University of Colorado Boulder

/**
 * A track set model for Energy Skate Park: Basics. Extends EnergySkateParkTrackSetModel, but assembles the
 * appropriate tracks for the basics version of the sim.
 *
 * @author Jesse Greenberg
 */

import EnergySkateParkTrackSetModel from '../../../../../energy-skate-park/js/energy-skate-park/common/model/EnergySkateParkTrackSetModel.js';
import energySkateParkBasics from '../../../energySkateParkBasics.js';

class EnergySkateParkBasicsTrackSetModel extends EnergySkateParkTrackSetModel {

  /**
   * @param {Tandem} tandem
   * // REVIEW: jsdoc
   */
  constructor( tandem, options ) {
    super( tandem, options );
    this.addTrackSet( EnergySkateParkTrackSetModel.createBasicTrackSet( this, tandem ) );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetModel', EnergySkateParkBasicsTrackSetModel );
export default EnergySkateParkBasicsTrackSetModel;