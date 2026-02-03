// Copyright 2018-2026, University of Colorado Boulder

/**
 * ScreenView for the Playground screen of Energy Skate Park: Basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnergySkateParkPlaygroundModel from '../../../../energy-skate-park/js/playground/model/EnergySkateParkPlaygroundModel.js';
import EnergySkateParkPlaygroundScreenView from '../../../../energy-skate-park/js/playground/view/EnergySkateParkPlaygroundScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

export default class PlaygroundScreenView extends EnergySkateParkPlaygroundScreenView {

  public constructor( model: EnergySkateParkPlaygroundModel, tandem: Tandem ) {

    super( model, tandem, {
      showReferenceHeight: false,
      showToolbox: false,
      showBarGraphZoomButtons: false,
      showSeparateVisibilityControlsPanel: false,
      controlPanelOptions: {
        showTrackButtons: false,
        showGravityControls: false,
        visibilityControlsOptions: {
          showGridCheckbox: true,
          showStickToTrackCheckbox: true
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