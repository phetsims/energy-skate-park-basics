// Copyright 2018-2020, University of Colorado Boulder

/**
 * ScreenView for the Playground screen of Energy Skate Park: Basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import EnergySkateParkPlaygroundScreenView from '../../../../energy-skate-park/js/playground/view/EnergySkateParkPlaygroundScreenView.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';
import EnergyBarGraphPanel from '../../common/view/EnergyBarGraphPanel.js';

class PlaygroundScreenView extends EnergySkateParkPlaygroundScreenView {

  /**
   * @param {EnergySkateParkPlaygroundModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, tandem.createTandem( 'graphsScreenView' ), {
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
          showBarGraphCheckbox: true,
          showStickToTrackCheckbox: false
        },
        massControlsOptions: {
          includeMassSlider: true,
          includeMassNumberControl: false,
          includeSkaterComboBox: false
        },
        showSkaterControls: false
      },

      // energy-skate-park-basics uses its own bar graph in a panel
      showBarGraph: false
    } );

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
   * @param {number} width
   * @param {number} height
   * @override
   */
  layout( width, height ) {
    super.layout( width, height );
    this.barGraphPanel.leftTop = new Vector2( this.fixedLeft, 5 );
  }
}

energySkateParkBasics.register( 'PlaygroundScreenView', PlaygroundScreenView );
export default PlaygroundScreenView;