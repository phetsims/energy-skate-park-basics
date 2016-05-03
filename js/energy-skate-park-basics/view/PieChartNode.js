// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node for the pie chart, which moves with the skater and shows a pie chart representation of the energies by
 * type. The size of the pie chart is proportional to the total energy.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @param {Skater} skater the skater model
   * @param {Property<Boolean>} pieChartVisibleProperty axon Property indicating whether the pie chart is shown
   * @param {ModelViewTransform2}} modelViewTransform
   * @constructor
   */
  function PieChartNode( skater, pieChartVisibleProperty, modelViewTransform ) {
    var pieChartNode = this;

    var kineticEnergySlice = new Path( null, {
      fill: EnergySkateParkColorScheme.kineticEnergy,
      stroke: 'black',
      lineWidth: 1
    } );
    var potentialEnergySlice = new Path( null, {
      fill: EnergySkateParkColorScheme.potentialEnergy,
      stroke: 'black',
      lineWidth: 1
    } );

    // Skip bounds computation to improve performance, see #245
    kineticEnergySlice.computeShapeBounds = function() {return new Bounds2( 0, 0, 0, 0 );};
    potentialEnergySlice.computeShapeBounds = function() {return new Bounds2( 0, 0, 0, 0 );};

    // Back layer is always a circle, so use the optimized version.
    var thermalEnergySlice = new Circle( 1, {
      fill: EnergySkateParkColorScheme.thermalEnergy,
      stroke: 'black',
      lineWidth: 1
    } );
    Node.call( this, { children: [ thermalEnergySlice, potentialEnergySlice, kineticEnergySlice ], pickable: false } );

    var updatePieChartLocation = function() {

      var view = modelViewTransform.modelToViewPosition( skater.headPosition );

      // Center pie chart over skater's head not his feet so it doesn't look awkward when skating in a parabola
      pieChartNode.setTranslation( view.x, view.y - 50 );
    };
    skater.headPositionProperty.link( function() {
      if ( pieChartNode.visible ) {
        updatePieChartLocation();
      }
    } );

    var updatePaths = function() {

      // Guard against expensive changes while the pie chart is invisible
      if ( !pieChartNode.visible ) {
        return;
      }
      var totalEnergy = skater.totalEnergy;

      // Guard against negative total energy, which could occur of the user is dragging the track underground, see #166
      if ( totalEnergy < 0 ) {
        totalEnergy = 0;
      }

      // Make the radius proportional to the square root of the energy so that the area will grow linearly with energy
      var radius = 0.4 * Math.sqrt( totalEnergy );

      // If any value is too low, then don't show it, see #136
      var THRESHOLD = 1E-4;

      // if only one component of pie chart, then show as a circle so there are no seams
      var numberComponents = (skater.potentialEnergy > THRESHOLD ? 1 : 0) +
                             (skater.kineticEnergy > THRESHOLD ? 1 : 0) +
                             (skater.thermalEnergy > THRESHOLD ? 1 : 0);

      // Don't show the pie chart if energies are zero, or if potential energy is negative (underground skater), see #189
      if ( numberComponents === 0 || skater.potentialEnergy < 0 ) {
        potentialEnergySlice.visible = false;
        kineticEnergySlice.visible = false;
        thermalEnergySlice.visible = false;
      }
      else if ( numberComponents === 1 ) {
        var selectedSlice = skater.potentialEnergy > THRESHOLD ? potentialEnergySlice :
                            skater.kineticEnergy > THRESHOLD ? kineticEnergySlice :
                            thermalEnergySlice;
        potentialEnergySlice.visible = false;
        thermalEnergySlice.visible = false;
        kineticEnergySlice.visible = false;
        selectedSlice.visible = true;

        // Performance optimization for background circle
        if ( selectedSlice instanceof Circle ) {

          // Round the radius so it will only update the graphics when it changed by a px or more
          selectedSlice.radius = Math.round( radius );
        }
        else {
          selectedSlice.shape = Shape.circle( 0, 0, radius );
        }
      }
      else {
        potentialEnergySlice.visible = true;
        kineticEnergySlice.visible = true;
        thermalEnergySlice.visible = true;
        var fractionPotential = skater.potentialEnergy / skater.totalEnergy;
        var fractionKinetic = skater.kineticEnergy / skater.totalEnergy;

        // Show one of them in the background instead of pieces for each one for performance
        // Round the radius so it will only update the graphics when it changed by a px or more
        thermalEnergySlice.radius = Math.round( radius );

        // Start thermal at the right and wind counter clockwise, see #133
        // Order is thermal (in the background), kinetic, potential
        var potentialStartAngle = 0;
        var kineticStartAngle = Math.PI * 2 * fractionPotential;

        // If there is no potential energy (i.e. the skater is on the ground) then don't show the potential energy slice,
        // see #165
        if ( fractionPotential === 0 ) {
          potentialEnergySlice.shape = null;
        }
        else {
          potentialEnergySlice.shape = new Shape().moveTo( 0, 0 ).arc( 0, 0, radius, potentialStartAngle, kineticStartAngle, false ).lineTo( 0, 0 ).close();
        }
        kineticEnergySlice.shape = new Shape().moveTo( 0, 0 ).arc( 0, 0, radius, kineticStartAngle, kineticStartAngle + fractionKinetic * Math.PI * 2, false ).lineTo( 0, 0 ).close();
      }
    };

    // instead of changing the entire pie chart whenever one energy changes, use trigger to update the whole pie
    skater.on( 'energy-changed', updatePaths );

    // Synchronize visibility with the model, and also update when visibility changes because it is guarded against in updatePaths
    pieChartVisibleProperty.link( function( visible ) {
      pieChartNode.visible = visible;
      updatePaths();
      if ( visible ) {
        updatePieChartLocation();
      }
    } );
  }

  energySkateParkBasics.register( 'PieChartNode', PieChartNode );
  
  return inherit( Node, PieChartNode );
} );