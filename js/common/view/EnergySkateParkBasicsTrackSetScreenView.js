// Copyright 2019-2020, University of Colorado Boulder

/**
 * The EnergySkateParkTrackSetScreenView used in screens in energy-skate-park-basics. Sets options for that
 * supertype that are shared between the intro and friction screens.
 * @author Jesse Greenberg
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import EnergySkateParkTrackSetScreenView from '../../../../energy-skate-park/js/common/view/EnergySkateParkTrackSetScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergyBarGraphPanel from './EnergyBarGraphPanel.js';

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
          showGridCheckbox: true,
          showBarGraphCheckbox: true
        },
        showGravityControls: false,
        showFrictionControls: false,
        massControlsOptions: {
          includeMassSlider: true,
          includeMassNumberControl: false
        },
        showSkaterControls: false
      },

      // energy-skate-park-basics uses its own panel for the graph
      showBarGraph: false
    }, options );

    super( model, tandem, options );

    this.barGraphPanel = new EnergyBarGraphPanel( model, tandem.createTandem( 'barGraphPanel' ), {
      barGraphOptions: {
        showBarGraphZoomButtons: false,
        graphRange: new Range( 0, 265 )
      }
    } );
    this.addChild( this.barGraphPanel );
    model.barGraphVisibleProperty.linkAttribute( this.barGraphPanel, 'visible' );
  }

  /**
   * Special layout for the basics screen view, positions the bar graph panel.
   * @public
   *
   * @param {number}
   * @param {number}
   * @override
   */
  layout( width, height ) {
    super.layout( width, height );
    this.barGraphPanel.leftTop = new Vector2( this.fixedLeft, 5 );
  }
}

energySkateParkBasics.register( 'EnergySkateParkBasicsTrackSetScreenView', EnergySkateParkBasicsTrackSetScreenView );
export default EnergySkateParkBasicsTrackSetScreenView;