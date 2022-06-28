// Copyright 2018-2022, University of Colorado Boulder

/**
 * ScreenView for the Playground screen of Energy Skate Park: Basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPlaygroundScreenView from '../../../../energy-skate-park/js/playground/view/EnergySkateParkPlaygroundScreenView.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

class PlaygroundScreenView extends EnergySkateParkPlaygroundScreenView {

  /**
   * @param {EnergySkateParkPlaygroundModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, tandem, {
      showReferenceHeight: false,
      showToolbox: false,
      showBarGraphZoomButtons: false,
      showAttachDetachRadioButtons: true,
      showSeparateVisibilityControlsPanel: false,
      controlPanelOptions: {
        showTrackButtons: false,
        showGravityControls: false,
        visibilityControlsOptions: {
          showGridCheckbox: true,
          showStickToTrackCheckbox: false
        },
        massControlsOptions: {
          includeMassSlider: true,
          includeMassNumberControl: false
        }
      }
    } );
  }
}

energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );
export default PlaygroundScreenView;