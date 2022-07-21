// Copyright 2018-2022, University of Colorado Boulder

/**
 * ScreenView for the intro in Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkBasicsTrackSetScreenView from '../../common/view/EnergySkateParkBasicsTrackSetScreenView.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

class IntroScreenView extends EnergySkateParkBasicsTrackSetScreenView {

  /**
   * @param {IntroModel} model
   * @param  {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( model, tandem, {
      drawSkaterPath: false
    } );
  }
}

energySkateParkBasics.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;