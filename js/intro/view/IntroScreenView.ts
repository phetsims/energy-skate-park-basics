// Copyright 2018-2022, University of Colorado Boulder

/**
 * ScreenView for the intro in Energy Skate Park: Basics
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EnergySkateParkBasicsTrackSetScreenView from '../../common/view/EnergySkateParkBasicsTrackSetScreenView.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import IntroModel from '../model/IntroModel.js';

export default class IntroScreenView extends EnergySkateParkBasicsTrackSetScreenView {

  public constructor( model: IntroModel, tandem: Tandem ) {
    super( model, tandem, {
      drawSkaterPath: false
    } );
  }
}

energySkateParkBasics.register( 'IntroScreenView', IntroScreenView );