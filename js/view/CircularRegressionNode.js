// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node that shows the grid lines and labels, when enabled in the control panel.
 * Every other horizontal line is labeled and highlighted to make it easy to count.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BackgroundNode' );

  function CircularRegressionNode( circularRegressionProperty, modelViewTransform ) {
    Circle.call( this, 10, {fill: 'blue', pickable: false} );
    var circularRegressionNode = this;
    circularRegressionProperty.link( function( circularRegression ) {
      circularRegressionNode.x = modelViewTransform.modelToViewX( circularRegression.x );
      circularRegressionNode.y = modelViewTransform.modelToViewY( circularRegression.y );
//      console.log( circularRegression );
//      circularRegressionNode.radius = circularRegression.radius;//TODO: Model to view
    } );
  }

  return inherit( Circle, CircularRegressionNode );
} );