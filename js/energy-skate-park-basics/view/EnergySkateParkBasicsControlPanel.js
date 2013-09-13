// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var Panel = require( 'SUN/Panel' );
  var CheckBox = require( 'SUN/CheckBox' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );

  function EnergySkateParkBasicsControlPanel( model, view ) {
    var contentNode = new VBox( {align: 'left', spacing: 10, children: [
      new CheckBox( new Text( 'Bar Graph' ), model.barGraphVisibleProperty ),
      new CheckBox( new Text( 'Pie Chart' ), model.pieChartVisibleProperty ),
      new CheckBox( new Text( 'Grid' ), model.gridVisibleProperty ),
      new CheckBox( new Text( 'Speed' ), model.speedVisibleProperty )]} );

    Panel.call( this, contentNode, { xMargin: 10, yMargin: 10, fill: '#F0F0F0', stroke: 'gray', lineWidth: 1, resize: false } );
  }

  return inherit( Node, EnergySkateParkBasicsControlPanel, {

  } );
} );