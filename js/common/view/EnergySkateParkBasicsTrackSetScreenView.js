// Copyright 2019-2022, University of Colorado Boulder

/**
 * The EnergySkateParkTrackSetScreenView used in screens in energy-skate-park-basics. Sets options for that
 * supertype that are shared between the intro and friction screens.
 * @author Jesse Greenberg
 */

import EnergySkateParkTrackSetScreenView from '../../../../energy-skate-park/js/common/view/EnergySkateParkTrackSetScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

class EnergySkateParkBasicsTrackSetScreenView extends EnergySkateParkTrackSetScreenView {

  /**
   * @param {EnergySkateParkTrackSetModel} model
   * @param {Array.<PhysicalNumberControl|PhysicalComboBox} controls
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {
    options = merge( {
      showToolbox: false,
      showReferenceHeight: false,
      showSeparateVisibilityControlsPanel: false,
      controlPanelOptions: {
        visibilityControlsOptions: {
          showGridCheckbox: true
        },
        showGravityControls: false,
        showFrictionControls: false,
        massControlsOptions: {
          includeMassSlider: true,
          includeMassNumberControl: false
        }
      }
    }, options );

    super( model, tandem, options );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetScreenView', EnergySkateParkBasicsTrackSetScreenView );
export default EnergySkateParkBasicsTrackSetScreenView;