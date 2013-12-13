// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that shows the legend for the pie chart, and a reset button for thermal energy.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkColorScheme' );
  var UndoButton = require( 'ENERGY_SKATE_PARK_BASICS/view/UndoButton' );
  var kineticString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.kinetic' );
  var potentialString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.potential' );
  var thermalString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.thermal' );
  var energyString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.energy' );

  function PieChartLegend( model ) {
    var pieChartLegend = this;
    this.skater = model.skater;

    //The x-coordinate of a bar chart bar
    var createLabel = function( index, title, color ) { return new Text( title, {fill: color, font: new PhetFont( 14 ), pickable: false} ); };

    var createBar = function( index, color ) { return new Rectangle( 0, 0, 25, 25, {fill: color, stroke: 'black', lineWidth: 1} ); };

    var kineticBar = createBar( 0, EnergySkateParkColorScheme.kineticEnergy );
    var potentialBar = createBar( 1, EnergySkateParkColorScheme.potentialEnergy );
    var thermalBar = createBar( 2, EnergySkateParkColorScheme.thermalEnergy );

    var kineticLabel = createLabel( 0, kineticString, EnergySkateParkColorScheme.kineticEnergy );
    var potentialLabel = createLabel( 1, potentialString, EnergySkateParkColorScheme.potentialEnergy );
    var thermalLabel = createLabel( 2, thermalString, EnergySkateParkColorScheme.thermalEnergy );

    var undoButton = new UndoButton( model.clearThermal.bind( model ), model.skater, {centerX: thermalLabel.centerX, y: thermalLabel.bottom + 15} );
    model.skater.thermalEnergyProperty.linkAttribute( undoButton, 'enabled' );

    var contentNode = new VBox( {spacing: 10, align: 'left', children: [
      new HBox( {spacing: 10, children: [kineticBar, kineticLabel]} ),
      new HBox( {spacing: 10, children: [potentialBar, potentialLabel]} ),
      new HBox( {spacing: 10, children: [thermalBar, thermalLabel, undoButton]} )
    ]} );

    var contentWithTitle = new VBox( {spacing: 10, align: 'center', children: [
      new Text( energyString, {fill: 'black', font: new PhetFont( 14 ), pickable: false} ),
      contentNode
    ]} );

    Panel.call( this, contentWithTitle, { x: 10, y: 10, xMargin: 10, yMargin: 10, fill: 'white', stroke: 'gray', lineWidth: 1, resize: false, cursor: 'pointer'} );

    model.pieChartVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Panel, PieChartLegend );
} );