// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that shows the bar graph, and the animating bars for each energy type.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkColorScheme' );
  var ClearThermalButton = require( 'ENERGY_SKATE_PARK_BASICS/view/ClearThermalButton' );
  var kineticString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.kinetic' );
  var potentialString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.potential' );
  var thermalString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.thermal' );
  var totalString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.total' );
  var energyString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.energy' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );

  function BarGraphNode( skater, barGraphVisibleProperty, clearThermal ) {

    //Free layout parameters
    var contentWidth = 110;
    var contentHeight = 325;
    var insetX = 2;
    var insetY = 25;

    var numBars = 4;
    var spaceBetweenBars = 10;
    var spaceBetweenAxisAndBar = 10;
    var spaceBetweenRightSideAndBar = 5;
    var barWidth = (contentWidth - insetX * 2 - (numBars - 1) * spaceBetweenBars - spaceBetweenAxisAndBar - spaceBetweenRightSideAndBar) / numBars;

    var originY = contentHeight - insetY;

    //The x-coordinate of a bar chart bar
    var getBarX = function( barIndex ) { return insetX + spaceBetweenAxisAndBar + barWidth * barIndex + spaceBetweenBars * barIndex; };

    //Create a label that appears under one of the bars
    var createLabel = function( index, title, color ) {
      var text = new Text( title, {fill: color, font: new PhetFont( 14 ), pickable: false} );
      text.rotate( -Math.PI / 2 );
      text.centerX = getBarX( index ) + barWidth / 2;
      text.top = originY + 2;

      return text;
    };

    //Create an energy bar that animates as the skater moves
    var createBar = function( index, color, property ) {

      //Convert to graph coordinates, floor and protect against duplicates
      //However, do not floor for values less than 1 otherwise a nonzero value will show up as zero, see https://github.com/phetsims/energy-skate-park-basics/issues/159
      var barHeightProperty = property.map( function( value ) {
        var result = value / 30;

        return result > 1 ? Math.floor( result ) : result;
      } );
      var barX = getBarX( index );
      var bar = new Rectangle( barX, 0, barWidth, 0, {fill: color, stroke: 'black', lineWidth: 0.5, pickable: false} );

      //update the bars when the graph becomes visible, and skip update when they are invisible
      DerivedProperty.multilink( [barHeightProperty, barGraphVisibleProperty], function( barHeight, visible ) {
        if ( visible ) {
          //PERFORMANCE/ALLOCATION: Possible performance improvement to avoid allocations in Rectangle.setRect

          //If the bar is too small, don't try to render it, see #199
          if ( barHeight < 1E-6 ) {
            barHeight = 0;
          }

          //TODO: just omit negative bars altogether?
          if ( barHeight >= 0 ) {
            bar.setRect( barX, originY - barHeight, barWidth, barHeight );
          }
          else {
            bar.setRect( barX, originY, barWidth, -barHeight );
          }
        }
      } );
      return bar;
    };

    var kineticBar = createBar( 0, EnergySkateParkColorScheme.kineticEnergy, skater.kineticEnergyProperty );
    var potentialBar = createBar( 1, EnergySkateParkColorScheme.potentialEnergy, skater.potentialEnergyProperty );
    var thermalBar = createBar( 2, EnergySkateParkColorScheme.thermalEnergy, skater.thermalEnergyProperty );
    var totalBar = createBar( 3, EnergySkateParkColorScheme.totalEnergy, skater.totalEnergyProperty );

    var kineticLabel = createLabel( 0, kineticString, EnergySkateParkColorScheme.kineticEnergy );
    var potentialLabel = createLabel( 1, potentialString, EnergySkateParkColorScheme.potentialEnergy );
    var thermalLabel = createLabel( 2, thermalString, EnergySkateParkColorScheme.thermalEnergy );
    var totalLabel = createLabel( 3, totalString, EnergySkateParkColorScheme.totalEnergy );

    var clearThermalButton = new ClearThermalButton( clearThermal, skater, {centerX: thermalLabel.centerX, y: thermalLabel.bottom + 15} );
    skater.link( 'thermalEnergy', function( thermalEnergy ) { clearThermalButton.enabled = thermalEnergy > 0; } );

    this.bars = [kineticBar, potentialBar, thermalBar, totalBar];
    var titleNode = new Text( energyString, {x: 5, y: insetY - 10, font: new PhetFont( 14 ), pickable: false} );
    var contentNode = new Rectangle( 0, 0, contentWidth, contentHeight, {children: [
      new ArrowNode( insetX, originY, insetX, insetY, {pickable: false} ),
      titleNode,
      new Line( insetX, originY, contentWidth - insetX, originY, {lineWidth: 1, stroke: 'gray', pickable: false} ),
      kineticLabel,
      potentialLabel,
      thermalLabel,
      totalLabel,

      kineticBar,
      potentialBar,
      thermalBar,
      totalBar,
      clearThermalButton
    ]} );

    //Center the bar chart title, see #62
    titleNode.centerX = contentNode.centerX;

    Panel.call( this, contentNode, { x: 10, y: 10, xMargin: 10, yMargin: 10, fill: 'white', stroke: 'gray', lineWidth: 1, resize: false} );

    //When the bar graph is shown, update the bars (because they do not get updated when invisible for performance reasons)
    barGraphVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Panel, BarGraphNode );
} );