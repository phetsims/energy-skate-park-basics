// Copyright 2018-2026, University of Colorado Boulder

/**
 * ScreenView for the Friction screen in Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EnergySkateParkScreenSummaryContent from '../../../../energy-skate-park/js/common/view/EnergySkateParkScreenSummaryContent.js';
import EnergySkateParkBasicsTrackSetScreenView from '../../common/view/EnergySkateParkBasicsTrackSetScreenView.js';
import FrictionModel from '../model/FrictionModel.js';

export default class FrictionScreenView extends EnergySkateParkBasicsTrackSetScreenView {

  public constructor( model: FrictionModel, tandem: Tandem ) {
    super( model, tandem, {
      controlPanelOptions: {
        showGravityControls: false,
        showFrictionControls: true
      },
      drawSkaterPath: false,
      screenSummaryContent: new EnergySkateParkScreenSummaryContent( model, 'friction' )
    } );
  }
}
