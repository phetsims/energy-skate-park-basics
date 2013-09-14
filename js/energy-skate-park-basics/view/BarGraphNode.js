// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Panel = require( 'SUN/Panel' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkColorScheme' );

  function BarGraphNode( model, energySkateParkBasicsView ) {
    var barGraphNode = this;
    this.skater = model.skater;

    var contentWidth = 140;
    var contentHeight = 400;
    var insetX = 10;
    var insetY = 25;

    var numBars = 4;
    var spaceBetweenBars = 10;
    var spaceBetweenAxisAndBar = 10;
    var spaceBetweenRightSideAndBar = 5;
    var barWidth = (contentWidth - insetX * 2 - (numBars - 1) * spaceBetweenBars - spaceBetweenAxisAndBar - spaceBetweenRightSideAndBar) / numBars;

    var originY = contentHeight - insetY;

    //The x-coordinate of a bar chart bar
    var getBarX = function( barIndex ) { return insetX + spaceBetweenAxisAndBar + barWidth * barIndex + spaceBetweenBars * barIndex; };

    var createLabel = function( index, title, color ) {
      var text = new Text( title, {fill: color, font: new PhetFont( 14 )} );
      text.rotate( -Math.PI / 2 );
      text.centerX = getBarX( index ) + barWidth / 2;
      text.top = originY + 2;

      return text;
    };

    var createBar = function( index, color, property ) {
      var lastBarHeight = 0;
      var barX = getBarX( index );
      var bar = new Rectangle( barX, originY - 50, barWidth, 50, {fill: color, stroke: 'black', lineWidth: 0.5} );
      property.link( function( value ) {
        if ( barGraphNode.visible ) {
          //TODO: Possible performance improvement to avoid allocations in Rectangle.setRect

          //Convert to graph coordinates, floor and protect against duplicates
          var barHeight = Math.floor( value / 4 );
          if ( barHeight !== lastBarHeight ) {
            if ( barHeight >= 0 ) {
              lastBarHeight = barHeight;
              bar.setRect( barX, originY - barHeight, barWidth, barHeight );
            }
            else {
              bar.setRect( barX, originY, barWidth, -barHeight );
            }
            lastBarHeight = barHeight;
          }
        }
      } );
      return bar;
    };

    var kineticBar = createBar( 0, EnergySkateParkColorScheme.kineticEnergy, this.skater.kineticEnergyProperty );
    var potentialBar = createBar( 1, EnergySkateParkColorScheme.potentialEnergy, this.skater.potentialEnergyProperty );
    var thermalBar = createBar( 2, EnergySkateParkColorScheme.thermalEnergy, this.skater.thermalEnergyProperty );
    var totalBar = createBar( 3, EnergySkateParkColorScheme.totalEnergy, this.skater.totalEnergyProperty );

    var kineticLabel = createLabel( 0, 'Kinetic', EnergySkateParkColorScheme.kineticEnergy );
    var potentialLabel = createLabel( 1, 'Potential', EnergySkateParkColorScheme.potentialEnergy );
    var thermalLabel = createLabel( 2, 'Thermal', EnergySkateParkColorScheme.thermalEnergy );
    var totalLabel = createLabel( 3, 'Total', EnergySkateParkColorScheme.totalEnergy );

    var contentNode = new Rectangle( 0, 0, contentWidth, contentHeight, {children: [
      new ArrowNode( insetX, originY, insetX, insetY ),
      new Text( 'Energy (Joules)', {x: 5, y: insetY - 10, font: new PhetFont( 14 )} ),
      new Line( insetX, originY, contentWidth - insetX, originY, {lineWidth: 1, stroke: 'gray'} ),
      kineticLabel,
      potentialLabel,
      thermalLabel,
      totalLabel,

      kineticBar,
      potentialBar,
      thermalBar,
      totalBar
    ]} );

    Panel.call( this, contentNode, { x: 10, y: 10, xMargin: 10, yMargin: 10, fill: 'white', stroke: 'gray', lineWidth: 1, resize: false } );

    //TODO: update the bars when the graph becomes visible
    model.barGraphVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Panel, BarGraphNode );
} );