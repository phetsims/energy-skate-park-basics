// Copyright 2019-2020, University of Colorado Boulder

/**
 * The Energy bar graph in Energy Skate Park, wrapped in a panel.
 *
 * @author Jesse Greenberg
 */

import EnergyBarGraph from '../../../../../energy-skate-park/js/energy-skate-park/common/view/EnergyBarGraph.js';
import merge from '../../../../../phet-core/js/merge.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../../sun/js/Panel.js';
import energySkateParkBasics from '../../../energySkateParkBasics.js';

class EnergyBarGraphPanel extends Panel {

  /**
   * @param {EnergySkateParkModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( model, tandem, options ) {

    options = merge( {

      // {null|*} options for the bar graph itself, passed on to EnergyBarGraph
      barGraphOptions: null
    }, options );

    const label = EnergyBarGraph.createLabel();
    const energyBarGraph = new EnergyBarGraph( model.skater, model.barGraphScaleProperty, model.barGraphVisibleProperty, tandem.createTandem( 'energyBarGraph' ), options.barGraphOptions );
    const labelledGraph = new VBox( {
      children: [ label, energyBarGraph ]
    } );

    super( labelledGraph, options );
  }
}

energySkateParkBasics.register( 'EnergyBarGraphPanel', EnergyBarGraphPanel );
export default EnergyBarGraphPanel;