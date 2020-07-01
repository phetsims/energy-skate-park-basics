// Copyright 2018-2020, University of Colorado Boulder

/**
 * ScreenView for the intro in Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsTrackSetScreenView from '../../common/view/EnergySkateParkBasicsTrackSetScreenView.js';

class IntroScreenView extends EnergySkateParkBasicsTrackSetScreenView {

  /**
   * @param {IntroModel} model
   * @param  {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( model, tandem.createTandem( 'introScreenView' ), {
      drawSkaterPath: false
    } );
  }
}

energySkateParkBasics.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;