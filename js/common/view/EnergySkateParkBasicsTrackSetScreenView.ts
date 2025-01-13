// Copyright 2019-2022, University of Colorado Boulder

/**
 * The EnergySkateParkTrackSetScreenView used in screens in energy-skate-park-basics. Sets options for that
 * supertype that are shared between the intro and friction screens.
 * @author Jesse Greenberg
 */

import EnergySkateParkTrackSetModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkTrackSetModel.js';
import EnergySkateParkTrackSetScreenView from '../../../../energy-skate-park/js/common/view/EnergySkateParkTrackSetScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

export default class EnergySkateParkBasicsTrackSetScreenView extends EnergySkateParkTrackSetScreenView {

  public constructor( model: EnergySkateParkTrackSetModel, tandem: Tandem, options?: IntentionalAny ) {

    // eslint-disable-next-line phet/bad-typescript-text
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