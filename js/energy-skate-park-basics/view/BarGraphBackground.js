// Copyright 2002-2014, University of Colorado Boulder

/**
 * Scenery node that shows static background for the bar graph, including the title, axes, labels and clear thermal
 * button. This was split into separate layers in order to keep the animation fast (while still looking crisp) on iPad.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var ClearThermalButton = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/ClearThermalButton' );
  var TogetherContext = require( 'TANDEM/TogetherContext' );

  // strings
  var kineticString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.kinetic' );
  var potentialString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.potential' );
  var thermalString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.thermal' );
  var totalString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.total' );
  var energyString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.energy' );

  /**
   * Constructor for the BarGraph
   * @param {Skater} skater the model's skater model
   * @param {Property<Boolean>} barGraphVisibleProperty property that indicates whether the bar graph is visible
   * @param {Function} clearThermal function to be called when the user presses the clear thermal button.
   * @constructor
   */
  function BarGraphBackground( skater, barGraphVisibleProperty, clearThermal, options ) {

    options = _.extend( { togetherContext: new TogetherContext() }, options );

    var barGraphBackground = this;

    // Free layout parameters
    var contentWidth = 110;
    var contentHeight = 325;
    var insetX = 2;
    var insetY = 25;

    var numBars = 4;
    var spaceBetweenBars = 10;
    var spaceBetweenAxisAndBar = 10;
    var spaceBetweenRightSideAndBar = 5;
    this.barWidth = (contentWidth - insetX * 2 - (numBars - 1) * spaceBetweenBars - spaceBetweenAxisAndBar - spaceBetweenRightSideAndBar) / numBars;

    this.originY = contentHeight - insetY;

    // The x-coordinate of a bar chart bar
    this.getBarX = function( barIndex ) { return insetX + spaceBetweenAxisAndBar + barGraphBackground.barWidth * barIndex + spaceBetweenBars * barIndex; };

    // Create a label that appears under one of the bars
    var createLabel = function( index, title, color ) {
      var text = new Text( title, { fill: color, font: new PhetFont( 14 ), pickable: false } );
      text.rotate( -Math.PI / 2 );
      text.centerX = barGraphBackground.getBarX( index ) + barGraphBackground.barWidth / 2;
      text.top = barGraphBackground.originY + 2;

      return text;
    };

    var kineticLabel = createLabel( 0, kineticString, EnergySkateParkColorScheme.kineticEnergy );
    var potentialLabel = createLabel( 1, potentialString, EnergySkateParkColorScheme.potentialEnergy );
    var thermalLabel = createLabel( 2, thermalString, EnergySkateParkColorScheme.thermalEnergy );
    var totalLabel = createLabel( 3, totalString, EnergySkateParkColorScheme.totalEnergy );

    var clearThermalButton = new ClearThermalButton( clearThermal, skater, {
      centerX: thermalLabel.centerX,
      y: thermalLabel.bottom + 12,
      togetherID: options.togetherContext.createTogetherID( 'barGraph.clearThermalButton' )
    } );
    skater.allowClearingThermalEnergyProperty.link( function( allowClearingThermalEnergy ) {
      clearThermalButton.enabled = allowClearingThermalEnergy;
    } );

    var titleNode = new Text( energyString, { x: 5, top: 0, font: new PhetFont( 14 ), pickable: false } );
    var contentNode = new Rectangle( 0, 0, contentWidth, contentHeight, {
      children: [
        new ArrowNode( insetX, this.originY, insetX, insetY, { pickable: false } ),
        titleNode,
        new Line( insetX, this.originY, contentWidth - insetX, this.originY, {
          lineWidth: 1,
          stroke: 'gray',
          pickable: false
        } ),
        kineticLabel,
        potentialLabel,
        thermalLabel,
        totalLabel,
        clearThermalButton
      ]
    } );

    // Center the bar chart title, see #62
    titleNode.centerX = contentNode.centerX;

    Panel.call( this, contentNode, {
      x: 10,
      y: 10,
      xMargin: 10,
      yMargin: 5,
      fill: 'white',
      stroke: 'gray',
      lineWidth: 1,
      resize: false
    } );

    // When the bar graph is shown, update the bars (because they do not get updated when invisible for performance reasons)
    barGraphVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Panel, BarGraphBackground );
} );