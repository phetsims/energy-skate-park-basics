// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Shape = require( 'KITE/Shape' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Panel = require( 'SUN/Panel' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkColorScheme' );

  function PieChartNode( model, energySkateParkBasicsView, modelViewTransform ) {
    var pieChartNode = this;
    this.skater = model.skater;
    var skater = model.skater;

    var kineticEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.kineticEnergy, stroke: 'black', lineWidth: 1} );
    var potentialEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.potentialEnergy, stroke: 'black', lineWidth: 1} );
    var thermalEnergySlice = new Path( null, {fill: EnergySkateParkColorScheme.thermalEnergy, stroke: 'black', lineWidth: 1} );
    Node.call( this, {children: [kineticEnergySlice, potentialEnergySlice, thermalEnergySlice]} );

    this.skater.positionProperty.link( function( position ) {
      var view = modelViewTransform.modelToViewPosition( position );
      pieChartNode.setTranslation( view.x, view.y - 150 );
    } );

    //TODO: update when the graph becomes visible
    model.pieChartVisibleProperty.linkAttribute( this, 'visible' );

    //TODO: instead of changing the entire pie chart whenever one energy changes, use trigger to update the whole pie
    var updatePaths = function() {
      var totalEnergy = skater.totalEnergy;
      var radius = totalEnergy / 40;
      if ( skater.potentialEnergy > 0 && skater.kineticEnergy <= 0 ) {
        kineticEnergySlice.shape = Shape.circle( 0, 0, radius );
        potentialEnergySlice.visible = false;
        kineticEnergySlice.visible = true;
      }
      else if ( skater.kineticEnergy > 0 && skater.potentialEnergy <= 0 ) {
        potentialEnergySlice.shape = Shape.circle( 0, 0, radius );
        potentialEnergySlice.visible = true;
        kineticEnergySlice.visible = false;
      }
      else if ( skater.kineticEnergy > 0 && skater.potentialEnergy > 0 ) {
        potentialEnergySlice.visible = true;
        kineticEnergySlice.visible = true;
        var amountPotential = skater.potentialEnergy / skater.totalEnergy;

        //Show one of them in the background instead of pieces for each one for performance
        kineticEnergySlice.shape = Shape.circle( 0, 0, radius );//TODO: this shouldn't change too much if energy conserved
        potentialEnergySlice.shape = new Shape().moveTo( 0, 0 ).ellipticalArc( 0, 0, radius, radius, 0, -Math.PI / 2, Math.PI * 2 * amountPotential - Math.PI / 2, false ).lineTo( 0, 0 );
      }
    };
    model.skater.on( 'energy-changed', updatePaths );
    updatePaths();
  }

  return inherit( Node, PieChartNode );
} );