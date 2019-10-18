// Copyright 2019, University of Colorado Boulder

/**
 * The Energy bar graph in Energy Skate Park, wrapped in a panel.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const EnergyBarGraph = require( 'ENERGY_SKATE_PARK/energy-skate-park/common/view/EnergyBarGraph' );
  const Panel = require( 'SUN/Panel' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  class EnergyBarGraphPanel extends Panel {

    /**
     * @param {EnergySkateParkModel} model
     * @param {Tandem} tandem
     * @param {Object} options
     */
    constructor( model, tandem, options ) {

      options = _.extend( {

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

  return energySkateParkBasics.register( 'EnergyBarGraphPanel', EnergyBarGraphPanel );
} );