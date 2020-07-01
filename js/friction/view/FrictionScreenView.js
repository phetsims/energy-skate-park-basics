// Copyright 2018-2020, University of Colorado Boulder

/**
 * ScreenView for the Friction screen in Energy Skate Park: Basics.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergySkateParkBasicsTrackSetScreenView from '../../common/view/EnergySkateParkBasicsTrackSetScreenView.js';

class FrictionScreenView extends EnergySkateParkBasicsTrackSetScreenView {

  /**
   * @param {FrictionModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( model, tandem.createTandem( 'introScreenView' ), {
      controlPanelOptions: {
        showGravityControls: false,
        showFrictionControls: true
      },
      drawSkaterPath: false
    } );
  }
}

energySkateParkBasics.register( 'FrictionScreenView', FrictionScreenView );
export default FrictionScreenView;