// Copyright 2019-2026, University of Colorado Boulder

/**
 * The Energy bar graph in Energy Skate Park, wrapped in a panel.
 *
 * @author Jesse Greenberg
 */

import EnergySkateParkConstants from '../../../../energy-skate-park/js/common/EnergySkateParkConstants.js';
import EnergySkateParkModel from '../../../../energy-skate-park/js/common/model/EnergySkateParkModel.js';
import EnergyBarGraph, { EnergyBarGraphOptions } from '../../../../energy-skate-park/js/common/view/EnergyBarGraph.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import energySkateParkBasics from '../../energySkateParkBasics.js';

type SelfOptions = {
  // options for the bar graph itself, passed on to EnergyBarGraph
  barGraphOptions?: EnergyBarGraphOptions;
};

type EnergyBarGraphPanelOptions = SelfOptions & PanelOptions;

export default class EnergyBarGraphPanel extends Panel {

  public constructor( model: EnergySkateParkModel, tandem: Tandem, providedOptions?: EnergyBarGraphPanelOptions ) {

    const options = optionize4<EnergyBarGraphPanelOptions, SelfOptions, PanelOptions>()(
      {},
      EnergySkateParkConstants.PANEL_OPTIONS,
      { barGraphOptions: {} },
      providedOptions
    );

    const label = EnergyBarGraph.createLabel();
    const energyBarGraph = new EnergyBarGraph( model.skater, model.barGraphScaleProperty, model.barGraphVisibleProperty, tandem.createTandem( 'energyBarGraph' ), options.barGraphOptions );
    const labelledGraph = new VBox( {
      children: [ label, energyBarGraph ]
    } );

    super( labelledGraph, options );
  }
}

energySkateParkBasics.register( 'EnergyBarGraphPanel', EnergyBarGraphPanel );