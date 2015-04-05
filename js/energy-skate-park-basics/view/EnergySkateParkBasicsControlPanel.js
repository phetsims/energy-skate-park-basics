// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the control panel, with view settings and controls.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var MassSlider = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/MassSlider' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var Property = require( 'AXON/Property' );
  var FrictionControl = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/FrictionControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TogetherContext = require( 'TANDEM/TogetherContext' );

  // strings
  var barGraphString = require( 'string!ENERGY_SKATE_PARK_BASICS/plots.bar-graph' );
  var pieChartString = require( 'string!ENERGY_SKATE_PARK_BASICS/pieChart' );
  var speedString = require( 'string!ENERGY_SKATE_PARK_BASICS/properties.speed' );
  var gridString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.show-grid' );

  /**
   * @param {EnergySkateParkBasicsModel} model
   * @constructor
   */
  function EnergySkateParkBasicsControlPanel( model, options ) {
    options = _.extend( {
      togetherContext: new TogetherContext()
    }, options );
    var textOptions = { font: new PhetFont( 14 ) };

    var pieChartSet = { label: new Text( pieChartString, textOptions ), icon: this.createPieChartIcon() };
    var barGraphSet = { label: new Text( barGraphString, textOptions ), icon: this.createBarGraphIcon() };
    var gridSet = { label: new Text( gridString, textOptions ), icon: this.createGridIcon() };
    var speedometerSet = { label: new Text( speedString, textOptions ), icon: this.createSpeedometerIcon() };

    var sets = [ pieChartSet, barGraphSet, gridSet, speedometerSet ];
    var maxTextWidth = _.max( sets, function( itemSet ) { return itemSet.label.width; } ).label.width;

    // In the absence of any sun (or other) layout packages, just manually space them out so they will have the icons aligned
    var pad = function( itemSet ) {
      var padWidth = maxTextWidth - itemSet.label.width;
      return [ itemSet.label, new Rectangle( 0, 0, padWidth + 20, 20 ), itemSet.icon ];
    };

    var checkBoxItemOptions = { boxWidth: 18 };

    var checkBoxChildren = [
      new CheckBox(
        new HBox( { children: pad( pieChartSet ) } ),
        model.property( 'pieChartVisible' ),
        _.extend( { togetherID: options.togetherContext.createTogetherID( 'pieChartCheckBox' ) }, checkBoxItemOptions )
      ),
      new CheckBox(
        new HBox( { children: pad( barGraphSet ) } ),
        model.property( 'barGraphVisible' ),
        _.extend( { togetherID: options.togetherContext.createTogetherID( 'barGraphCheckBox' ) }, checkBoxItemOptions ) ),
      new CheckBox(
        new HBox( { children: pad( gridSet ) } ),
        model.property( 'gridVisible' ),
        _.extend( { togetherID: options.togetherContext.createTogetherID( 'gridCheckBox' ) }, checkBoxItemOptions ) ),
      new CheckBox(
        new HBox( { children: pad( speedometerSet ) } ),
        model.property( 'speedometerVisible' ),
        _.extend( { togetherID: options.togetherContext.createTogetherID( 'speedometerCheckBox' ) }, checkBoxItemOptions )
      ) ];
    var checkBoxes = new VBox( { align: 'left', spacing: 10, children: checkBoxChildren } );

    var massSlider = new MassSlider( model.skater.massProperty, {
      togetherID: options.togetherContext.createTogetherID( 'massSlider' )
    } );

    // For 1st screen, show MassSlider
    // For 2nd and 3rd screen, show Friction Slider and Mass Slider, see #147
    var children = [ checkBoxes, massSlider ];
    if ( model.frictionAllowed ) {
      children.push( new FrictionControl( model.property( 'friction' ), {
        togetherID: options.togetherContext.createTogetherID( 'frictionSlider' )
      } ) );
    }
    var content = new VBox( { spacing: 4, children: children } );

    this.contentWidth = content.width;
    Panel.call( this, content, { xMargin: 10, yMargin: 5, fill: '#F0F0F0', stroke: null, resize: false } );
  }

  return inherit( Panel, EnergySkateParkBasicsControlPanel, {

    // Create an icon for the bar graph check box
    createBarGraphIcon: function() {
      return new Node( {
        children: [
          new Rectangle( 0, 0, 20, 20, { fill: 'white', stroke: 'black', lineWidth: 0.5 } ),
          new Rectangle( 3, 14, 5, 6, {
            fill: EnergySkateParkColorScheme.kineticEnergy,
            stroke: 'black',
            lineWidth: 0.5
          } ),
          new Rectangle( 11, 8, 5, 12, {
            fill: EnergySkateParkColorScheme.potentialEnergy,
            stroke: 'black',
            lineWidth: 0.5
          } )
        ]
      } );
    },

    // Create an icon for the pie chart check box
    createPieChartIcon: function() {
      var radius = 10;
      var x = new Shape().
        moveTo( 0, 0 ).
        ellipticalArc( 0, 0, radius, radius, 0, -Math.PI / 2, 0, false ).lineTo( 0, 0 );
      return new Node( {
        children: [
          new Circle( radius, { fill: EnergySkateParkColorScheme.potentialEnergy, lineWidth: 0.5, stroke: 'black' } ),
          new Path( x, { fill: EnergySkateParkColorScheme.kineticEnergy, lineWidth: 0.5, stroke: 'black' } )
        ]
      } );
    },

    // Create an icon for the grid check box
    createGridIcon: function() {
      return new Node( {
        children: [
          new Rectangle( 0, 0, 20, 20, { fill: 'white', stroke: 'black', lineWidth: 0.5 } ),
          new Line( 0, 10, 20, 10, { stroke: 'black', lineWidth: 1 } ),
          new Line( 0, 5, 20, 5, { stroke: 'black', lineWidth: 0.5 } ),
          new Line( 0, 15, 20, 15, { stroke: 'black', lineWidth: 0.5 } ),
          new Line( 10, 0, 10, 20, { stroke: 'black', lineWidth: 1 } ),
          new Line( 5, 0, 5, 20, { stroke: 'black', lineWidth: 0.5 } ),
          new Line( 15, 0, 15, 20, { stroke: 'black', lineWidth: 0.5 } )
        ]
      } );
    },

    // Create an icon for the speedometer check box
    createSpeedometerIcon: function() {
      var node = new GaugeNode( new Property( 0 ), speedString, { min: 0, max: 10 }, { pickable: false } );
      node.scale( 20 / node.width );
      return node;
    }
  } );
} );