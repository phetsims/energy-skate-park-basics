// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the control panel, with view settings and controls.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

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
  var MassSlider = require( 'ENERGY_SKATE_PARK_BASICS/view/MassSlider' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkColorScheme' );
  var SpeedometerNode = require( 'SCENERY_PHET/SpeedometerNode' );
  var Property = require( 'AXON/Property' );
  var FrictionControl = require( 'ENERGY_SKATE_PARK_BASICS/view/FrictionControl' );
  var barGraphString = require( 'string!ENERGY_SKATE_PARK_BASICS/plots.bar-graph' );
  var pieChartString = require( 'string!ENERGY_SKATE_PARK_BASICS/pieChart' );
  var speedString = require( 'string!ENERGY_SKATE_PARK_BASICS/properties.speed' );
  var gridString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.show-grid' );
  var stickToTrackString = require( 'string!ENERGY_SKATE_PARK_BASICS/stickToTrack' );

  function EnergySkateParkBasicsControlPanel( model, view ) {
    var barGraphSet = [new Text( barGraphString ), this.createBarGraphIcon()];
    var pieChartSet = [new Text( pieChartString ), this.createPieChartIcon()];
    var gridSet = [new Text( gridString ), this.createGridIcon()];
    var speedometerSet = [new Text( speedString ), this.createSpeedometerIcon()];
    var stickToTrackSet = [new Text( stickToTrackString ), new Rectangle( 0, 0, 20, 10, {fill: 'black'} )];//TODO: dotted yellow line for icon

    var sets = model.frictionAllowed ?
               [barGraphSet, pieChartSet, gridSet, speedometerSet, stickToTrackSet] :
               [barGraphSet, pieChartSet, gridSet, speedometerSet];
    var maxTextWidth = _.max( sets, function( itemSet ) { return itemSet[0].width; } )[0].width;

    //In the absence of any sun (or other) layout packages, just manually space them out so they will have the icons aligned
    var pad = function( itemSet ) {
      var padWidth = maxTextWidth - itemSet[0].width;
      return [itemSet[0], new Rectangle( 0, 0, padWidth + 20, 20 ), itemSet[1]];
    };

    var checkBoxChildren = [
      new CheckBox( new HBox( {children: pad( barGraphSet )} ), model.barGraphVisibleProperty ),
      new CheckBox( new HBox( {children: pad( pieChartSet )} ), model.pieChartVisibleProperty ),
      new CheckBox( new HBox( {children: pad( gridSet )} ), model.gridVisibleProperty ),
      new CheckBox( new HBox( {children: pad( speedometerSet )} ), model.speedometerVisibleProperty )];
    if ( model.frictionAllowed ) {
      checkBoxChildren.push( new CheckBox( new HBox( {children: pad( stickToTrackSet )} ), model.stickToTrackProperty ) );
    }
    var checkBoxes = new VBox( {align: 'left', spacing: 10, children: checkBoxChildren} );

    var content = new VBox( {spacing: 10,
      children: !model.frictionAllowed ?
                [checkBoxes, new MassSlider( model )] :
                [checkBoxes, new FrictionControl( model, view )]} );

    Panel.call( this, content, { xMargin: 10, yMargin: 10, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1, resize: false } );
  }

  return inherit( Node, EnergySkateParkBasicsControlPanel, {

    //Create an icon for the bar graph check box
    createBarGraphIcon: function() {
      return new Node( {children: [
        new Rectangle( 0, 0, 20, 20, {fill: 'white', stroke: 'black', lineWidth: 0.5} ),
        new Rectangle( 3, 14, 5, 6, {fill: EnergySkateParkColorScheme.kineticEnergy, stroke: 'black', lineWidth: 0.5} ),
        new Rectangle( 11, 8, 5, 12, {fill: EnergySkateParkColorScheme.potentialEnergy, stroke: 'black', lineWidth: 0.5} )
      ]} );
    },

    //Create an icon for the pie chart check box
    createPieChartIcon: function() {
      var radius = 10;
      var x = new Shape().moveTo( 0, 0 ).ellipticalArc( 0, 0, radius, radius, 0, -Math.PI / 2, Math.PI * 2 * 0.25 - Math.PI / 2, false ).lineTo( 0, 0 );
      return new Node( {children: [new Circle( radius, {fill: EnergySkateParkColorScheme.potentialEnergy, lineWidth: 0.5, stroke: 'black' } ), new Path( x, {fill: EnergySkateParkColorScheme.kineticEnergy, lineWidth: 0.5, stroke: 'black'} )]} );
    },

    //Create an icon for the grid check box
    createGridIcon: function() {
      return new Node( {children: [
        new Rectangle( 0, 0, 20, 20, {fill: 'white', stroke: 'black', lineWidth: 0.5} ),
        new Line( 0, 10, 20, 10, {stroke: 'black', lineWidth: 1} ),
        new Line( 0, 5, 20, 5, {stroke: 'black', lineWidth: 0.5} ),
        new Line( 0, 15, 20, 15, {stroke: 'black', lineWidth: 0.5} ),
        new Line( 10, 0, 10, 20, {stroke: 'black', lineWidth: 1} ),
        new Line( 5, 0, 5, 20, {stroke: 'black', lineWidth: 0.5} ),
        new Line( 15, 0, 15, 20, {stroke: 'black', lineWidth: 0.5} )
      ]} );
    },

    //Create an icon for the speedometer check box
    createSpeedometerIcon: function() {
      var node = new SpeedometerNode( new Property( 0 ), speedString, 10, {} );
      node.scale( 20 / node.width );
      return node;
    }
  } );
} );