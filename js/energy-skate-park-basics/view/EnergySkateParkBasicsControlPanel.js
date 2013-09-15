// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the control panel, with view settings and controls.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var MassSlider = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/MassSlider' );

  function EnergySkateParkBasicsControlPanel( model, view ) {
    var checkBoxes = new VBox( {align: 'left', spacing: 10, children: [
      new CheckBox( new Text( 'Bar Graph' ), model.barGraphVisibleProperty ),
      new CheckBox( new Text( 'Pie Chart' ), model.pieChartVisibleProperty ),
      new CheckBox( new Text( 'Grid' ), model.gridVisibleProperty ),
      new CheckBox( new Text( 'Speed' ), model.speedometerVisibleProperty )]} );

    var slider = new MassSlider( model );

    var content = new VBox( {align: 'left', spacing: 10, children: [checkBoxes, slider]} );

    Panel.call( this, content, { xMargin: 10, yMargin: 10, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1, resize: false } );
  }

  return inherit( Node, EnergySkateParkBasicsControlPanel );
} );