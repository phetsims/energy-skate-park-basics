// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the pie chart, which moves with the skater and shows a pie chart representation of the energies by type.
 * The size of the pie chart is proportional to the total energy.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkColorScheme' );

  function PieChartNode( model, modelViewTransform ) {
    var pieChartNode = this;
    this.skater = model.skater;
    var skater = model.skater;

    var kineticEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.kineticEnergy, stroke: 'black', lineWidth: 1} );
    var potentialEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.potentialEnergy, stroke: 'black', lineWidth: 1} );
    var thermalEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.thermalEnergy, stroke: 'black', lineWidth: 1} );
    Node.call( this, {children: [thermalEnergySlice, potentialEnergySlice, kineticEnergySlice ], pickable: false} );

    this.skater.headPositionProperty.link( function( headPosition ) {
      var view = modelViewTransform.modelToViewPosition( headPosition );

      //Center pie chart over skater's head not his feet so it doesn't look awkward when skating in a parabola
      pieChartNode.setTranslation( view.x, view.y - 50 );
    } );

    var updatePaths = function() {

      //Guard against expensive changes while the pie chart is invisible
      if ( !pieChartNode.visible ) {
        return;
      }
      var totalEnergy = skater.totalEnergy;

      //Make the radius proportional to the square root of the energy so that the area will grow linearly with energy
      var radius = 0.4 * Math.sqrt( totalEnergy );

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
        var fractionKinetic = skater.kineticEnergy / skater.totalEnergy;

        //Show one of them in the background instead of pieces for each one for performance
        //TODO: this shouldn't change too much if energy conserved, perhaps it could be optimized somehow?  Perhaps a guard?
        thermalEnergySlice.shape = Shape.circle( 0, 0, radius );
        potentialEnergySlice.shape = new Shape().moveTo( 0, 0 ).ellipticalArc( 0, 0, radius, radius, 0, -Math.PI / 2, Math.PI * 2 * fractionPotential - Math.PI / 2, false ).lineTo( 0, 0 );
        kineticEnergySlice.shape = new Shape().moveTo( 0, 0 ).ellipticalArc( 0, 0, radius, radius, 0, Math.PI * 2 * fractionPotential - Math.PI / 2, Math.PI * 2 * fractionPotential - Math.PI / 2 + fractionKinetic * Math.PI * 2, false ).lineTo( 0, 0 );
      }
    };

    //instead of changing the entire pie chart whenever one energy changes, use trigger to update the whole pie
    model.skater.on( 'energy-changed', updatePaths );

    //Synchronize visibility with the model, and also update when visibility changes because it is guarded against in updatePaths
    model.pieChartVisibleProperty.link( function( visible ) {
      pieChartNode.visible = visible;
      updatePaths();
    } );
  }

  return inherit( Node, PieChartNode );
} );