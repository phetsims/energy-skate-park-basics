// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that shows the legend for the pie chart, and a reset button for thermal energy.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var VStrut = require( 'SUN/VStrut' );
  var HStrut = require( 'SUN/HStrut' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var ClearThermalButton = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/ClearThermalButton' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var kineticString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.kinetic' );
  var potentialString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.potential' );
  var thermalString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.thermal' );
  var energyString = require( 'string!ENERGY_SKATE_PARK_BASICS/energy.energy' );

  /**
   * @param {Skater} skater the model for the skater
   * @param {Function} clearThermal function to be called when the user presses the clear thermal button
   * @param {Property<Boolean>) pieChartVisibleProperty axon Property indicating whether the pie chart is visible
   * @constructor
   */
  function PieChartLegend( skater, clearThermal, pieChartVisibleProperty, options ) {

    options = _.extend( { tandem: new Tandem() }, options );
    // The x-coordinate of a bar chart bar
    var createLabel = function( index, title, color ) {
      return new Text( title, {
        fill: color,
        font: new PhetFont( 12 ),
        pickable: false
      } );
    };

    var createBar = function( index, color ) {
      return new Rectangle( 0, 0, 16.5, 16.5, {
        fill: color,
        stroke: 'black',
        lineWidth: 1
      } );
    };

    var kineticBar = createBar( 0, EnergySkateParkColorScheme.kineticEnergy );
    var potentialBar = createBar( 1, EnergySkateParkColorScheme.potentialEnergy );
    var thermalBar = createBar( 2, EnergySkateParkColorScheme.thermalEnergy );

    var kineticLabel = createLabel( 0, kineticString, EnergySkateParkColorScheme.kineticEnergy );
    var potentialLabel = createLabel( 1, potentialString, EnergySkateParkColorScheme.potentialEnergy );
    var thermalLabel = createLabel( 2, thermalString, EnergySkateParkColorScheme.thermalEnergy );

    var clearThermalButton = new ClearThermalButton( clearThermal, skater, {
      centerX: thermalLabel.centerX,
      y: thermalLabel.bottom + 15,
      togetherID: options.tandem.createTandem( 'pieChartLegend.clearThermalButton' )
    } );
    skater.allowClearingThermalEnergyProperty.link( function( allowClearingThermalEnergy ) {
      clearThermalButton.enabled = allowClearingThermalEnergy;
    } );

    // Don't let the ClearThermalButton participate in the layout since it is too big vertically.  Just use a strut to
    // get the width right, then add the undo button later
    var clearThermalButtonStrut = new Rectangle( 0, 0, clearThermalButton.width, 1, {} );

    var contentNode = new VBox( {
      spacing: 10, align: 'left', children: [
        new HBox( { spacing: 4, children: [ kineticBar, kineticLabel ] } ),
        new HBox( { spacing: 4, children: [ potentialBar, potentialLabel ] } ),
        new HBox( {
          spacing: 4,
          children: [ thermalBar, thermalLabel, new HStrut( 1 ), clearThermalButtonStrut, new HStrut( 3 ) ]
        } ),
        new VStrut( 1 )
      ]
    } );

    var contentWithTitle = new VBox( {
      spacing: 5, align: 'center', children: [
        new Text( energyString, { fill: 'black', font: new PhetFont( 14 ), pickable: false } ),
        contentNode
      ]
    } );

    Panel.call( this, contentWithTitle,
      {
        x: 4,
        y: 4,
        xMargin: 6,
        yMargin: 5,
        fill: 'white',
        stroke: 'gray',
        lineWidth: 1,
        resize: false,
        cursor: 'pointer'
      } );

    this.addChild( clearThermalButton );
    var strutGlobal = clearThermalButtonStrut.parentToGlobalPoint( clearThermalButtonStrut.center );
    var buttonLocal = clearThermalButton.globalToParentPoint( strutGlobal );
    clearThermalButton.center = buttonLocal;

    pieChartVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Panel, PieChartLegend );
} );