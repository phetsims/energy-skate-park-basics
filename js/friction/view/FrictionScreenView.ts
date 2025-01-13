// Copyright 2018-2022, University of Colorado Boulder

/**
 * ScreenView for the Friction screen in Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EnergySkateParkBasicsTrackSetScreenView from '../../common/view/EnergySkateParkBasicsTrackSetScreenView.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import FrictionModel from '../model/FrictionModel.js';

export default class FrictionScreenView extends EnergySkateParkBasicsTrackSetScreenView {

  public constructor( model: FrictionModel, tandem: Tandem ) {
    super( model, tandem, {
      controlPanelOptions: {
        showGravityControls: false,
        showFrictionControls: true
      },
      drawSkaterPath: false
    } );
  }
}

energySkateParkBasics.register( 'FrictionScreenView', FrictionScreenView );