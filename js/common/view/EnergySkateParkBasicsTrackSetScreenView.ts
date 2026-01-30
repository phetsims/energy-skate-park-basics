// Copyright 2019-2025, University of Colorado Boulder

/**
 * The EnergySkateParkTrackSetScreenView used in screens in energy-skate-park-basics. Sets options for that
 * supertype that are shared between the intro and friction screens.
 * @author Jesse Greenberg
 */

import EnergySkateParkTrackSetModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkTrackSetModel.js';
import { EnergySkateParkSaveSampleScreenViewOptions } from '../../../../energy-skate-park/js/common/view/EnergySkateParkSaveSampleScreenView.js';
import EnergySkateParkTrackSetScreenView from '../../../../energy-skate-park/js/common/view/EnergySkateParkTrackSetScreenView.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

type SelfOptions = EmptySelfOptions;

type EnergySkateParkBasicsTrackSetScreenViewOptions = SelfOptions & EnergySkateParkSaveSampleScreenViewOptions;

export default class EnergySkateParkBasicsTrackSetScreenView extends EnergySkateParkTrackSetScreenView {

  public constructor( model: EnergySkateParkTrackSetModel, tandem: Tandem, providedOptions?: EnergySkateParkBasicsTrackSetScreenViewOptions ) {

    const options = optionize<EnergySkateParkBasicsTrackSetScreenViewOptions, SelfOptions, EnergySkateParkSaveSampleScreenViewOptions>()( {
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
    }, providedOptions );

    super( model, tandem, options );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetScreenView', EnergySkateParkBasicsTrackSetScreenView );