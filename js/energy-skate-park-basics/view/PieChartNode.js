// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
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

  function PieChartNode( model, energySkateParkBasicsView, modelViewTransform ) {
    var pieChartNode = this;
    this.skater = model.skater;

    Node.call( this );
    var circle = new Circle( 20, {fill: 'red'} );
    this.addChild( circle );

    this.skater.positionProperty.link( function( position ) {
      var view = modelViewTransform.modelToViewPosition( position );
      pieChartNode.setTranslation( view.x, view.y - 150 );
    } );

    //TODO: update when the graph becomes visible
    model.pieChartVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, PieChartNode );
} );