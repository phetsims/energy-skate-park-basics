// Copyright 2018-2020, University of Colorado Boulder

/**
 * Playground model for Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPlaygroundModel from '../../../../energy-skate-park/js/playground/model/EnergySkateParkPlaygroundModel.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsConstants from '../../EnergySkateParkBasicsConstants.js';

class PlaygroundModel extends EnergySkateParkPlaygroundModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem.createTandem( 'playgroundModel' ), EnergySkateParkBasicsConstants.BASICS_MODEL_OPTIONS );
  }
}

energySkateParkBasics.register( 'PlaygroundModel', PlaygroundModel );
export default PlaygroundModel;