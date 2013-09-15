// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the pie chart, which moves with the skater and shows a pie chart representation of the energies by type.
 * The size of the pie chart is proportional to the total energy.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkColorScheme' );

  //TODO: Should be centered over his head not his feet so it doesn't look awkward when skating in a parabola
  function PieChartNode( model, energySkateParkBasicsView, modelViewTransform ) {
    var pieChartNode = this;
    this.skater = model.skater;
    var skater = model.skater;

    var kineticEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.kineticEnergy, stroke: 'black', lineWidth: 1} );
    var potentialEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.potentialEnergy, stroke: 'black', lineWidth: 1} );
    var thermalEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.thermalEnergy, stroke: 'black', lineWidth: 1} );
    Node.call( this, {children: [thermalEnergySlice, potentialEnergySlice, kineticEnergySlice ], pickable: false} );

    this.skater.positionProperty.link( function( position ) {
      var view = modelViewTransform.modelToViewPosition( position );
      pieChartNode.setTranslation( view.x, view.y - 150 );
    } );

    //TODO: update when the graph becomes visible
    model.pieChartVisibleProperty.linkAttribute( this, 'visible' );

    var updatePaths = function() {

      //TODO: call updatePaths when pie chart node is made visible
      if ( !pieChartNode.visible ) {
        return;
      }
      var totalEnergy = skater.totalEnergy;
      var radius = totalEnergy / 40;
      //if only one component of pie chart, then show as a circle so there are no seams
      var numberComponents = (skater.potentialEnergy > 0 ? 1 : 0) +
                             (skater.kineticEnergy > 0 ? 1 : 0) +
                             (skater.thermalEnergy > 0 ? 1 : 0);

      if ( numberComponents === 0 ) {
        potentialEnergySlice.visible = false;
        kineticEnergySlice.visible = false;
        thermalEnergySlice.visible = false;
      }
      else if ( numberComponents === 1 ) {
        var selectedSlice = skater.potentialEnergy > 0 ? potentialEnergySlice :
                            skater.kineticEnergy > 0 ? kineticEnergySlice :
                            thermalEnergySlice;
        potentialEnergySlice.visible = false;
        thermalEnergySlice.visible = false;
        kineticEnergySlice.visible = false;
        selectedSlice.visible = true;
        selectedSlice.shape = Shape.circle( 0, 0, radius );
      }
      else {
        potentialEnergySlice.visible = true;
        kineticEnergySlice.visible = true;
        thermalEnergySlice.visible = true;
        var fractionPotential = skater.potentialEnergy / skater.totalEnergy;
        var fractionThermal = skater.thermalEnergy / skater.totalEnergy;
        var fractionKinetic = skater.kineticEnergy / skater.totalEnergy;

        //Show one of them in the background instead of pieces for each one for performance
        thermalEnergySlice.shape = Shape.circle( 0, 0, radius );//TODO: this shouldn't change too much if energy conserved
        potentialEnergySlice.shape = new Shape().moveTo( 0, 0 ).ellipticalArc( 0, 0, radius, radius, 0, -Math.PI / 2, Math.PI * 2 * fractionPotential - Math.PI / 2, false ).lineTo( 0, 0 );
        kineticEnergySlice.shape = new Shape().moveTo( 0, 0 ).ellipticalArc( 0, 0, radius, radius, 0, Math.PI * 2 * fractionPotential - Math.PI / 2, Math.PI * 2 * fractionPotential - Math.PI / 2 + fractionKinetic * Math.PI * 2, false ).lineTo( 0, 0 );
      }
    };

    //instead of changing the entire pie chart whenever one energy changes, use trigger to update the whole pie
    model.skater.on( 'energy-changed', updatePaths );
    updatePaths();
  }

  return inherit( Node, PieChartNode );
} );