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

  function BarGraphNode( model, energySkateParkBasicsView ) {
    this.skater = model.skater;

    var contentWidth = 140;
    var contentHeight = 400;

    var insetX = 10;
    var insetY = 25;
    var contentNode = new Rectangle( 0, 0, contentWidth, contentHeight, {children: [
      new ArrowNode( insetX, contentHeight - insetY, insetX, insetY ),
      new Text( 'Energy (Joules)', {x: 5, y: insetY - 10} ),
      new Line( insetX, contentHeight - insetY, contentWidth - insetX, contentHeight - insetY, {lineWidth: 1, stroke: 'gray'} )
    ]} );
    Panel.call( this, contentNode, { x: 10, y: 10, xMargin: 10, yMargin: 10, fill: 'white', stroke: 'gray', lineWidth: 1, resize: false } );

    model.barGraphVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Panel, BarGraphNode );
} );