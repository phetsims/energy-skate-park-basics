// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node that shows static background for the bar graph, including the title, axes, labels and clear thermal
 * button. This was split into separate layers in order to keep the animation fast (while still looking crisp) on iPad.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var Panel = require( 'SUN/Panel' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var ClearThermalButton = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/ClearThermalButton' );

  // strings
  var energyKineticString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.kinetic' );
  var energyPotentialString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.potential' );
  var energyThermalString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.thermal' );
  var energyTotalString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.total' );
  var energyEnergyString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.energy' );

  /**
   * Constructor for the BarGraph
   * @param {Skater} skater the model's skater model
   * @param {Property<Boolean>} barGraphVisibleProperty property that indicates whether the bar graph is visible
   * @param {Function} clearThermal function to be called when the user presses the clear thermal button.
   * @param {Tandem} tandem
   * @constructor
   */
  function BarGraphBackground( skater, barGraphVisibleProperty, clearThermal, tandem ) {

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
    var createLabel = function( index, title, color, tandemName ) {
      var text = new TandemText( title, {
        tandem: tandem.createTandem( tandemName ),
        fill: color,
        font: new PhetFont( 14 ),
        pickable: false,
        maxWidth: 90 // selected by requiring that the bar chart not overlap with the track toolbox, see #337
      } );
      text.rotate( -Math.PI / 2 );
      text.centerX = barGraphBackground.getBarX( index ) + barGraphBackground.barWidth / 2;
      text.top = barGraphBackground.originY + 2;

      return text;
    };

    var kineticLabel = createLabel( 0, energyKineticString, EnergySkateParkColorScheme.kineticEnergy, 'kineticEnergyLabel' );
    var potentialLabel = createLabel( 1, energyPotentialString, EnergySkateParkColorScheme.potentialEnergy, 'potentialEnergyLabel' );
    var thermalLabel = createLabel( 2, energyThermalString, EnergySkateParkColorScheme.thermalEnergy, 'thermalEnergyLabel' );
    var totalLabel = createLabel( 3, energyTotalString, EnergySkateParkColorScheme.totalEnergy, 'totalEnergyLabel' );

    var clearThermalButton = new ClearThermalButton( clearThermal, skater, tandem.createTandem( 'clearThermalButton' ), {
      centerX: thermalLabel.centerX,
      y: thermalLabel.bottom + 12
    } );
    skater.allowClearingThermalEnergyProperty.link( function( allowClearingThermalEnergy ) {
      clearThermalButton.enabled = allowClearingThermalEnergy;
    } );

    var titleNode = new TandemText( energyEnergyString, {
      tandem: tandem.createTandem( 'titleNode' ),
      x: 5,
      top: 0,
      font: new PhetFont( 14 ),
      pickable: false,
      maxWidth: 93 // selected by choosing the length of English string in ?stringTest=double
    } );
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

  energySkateParkBasics.register( 'BarGraphBackground', BarGraphBackground );

  return inherit( Panel, BarGraphBackground );
} );