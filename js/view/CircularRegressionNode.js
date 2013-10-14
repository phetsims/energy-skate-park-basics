// Copyright 2002-2013, University of Colorado Boulder

/**
 * For debugging the circular regression.  Should not be displayed in production.
 *
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
    Circle.call( this, 10, {lineWidth: 2, stroke: 'blue', pickable: false} );
    var circularRegressionNode = this;
    circularRegressionProperty.link( function( circularRegression ) {
      circularRegressionNode.x = modelViewTransform.modelToViewX( circularRegression.x );
      circularRegressionNode.y = modelViewTransform.modelToViewY( circularRegression.y );
      circularRegressionNode.radius = modelViewTransform.modelToViewDeltaX( isNaN( circularRegression.r ) ? 0.1 : circularRegression.r );
    } );
  }

  return inherit( Circle, CircularRegressionNode );
} );