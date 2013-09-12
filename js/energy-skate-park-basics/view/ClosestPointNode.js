// Copyright 2002-2013, University of Colorado Boulder

/**
 * Debugging utility to show the closest point on the track.
 */
define( function( require ) {
  'use strict';

  // imports
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Scene = require( 'SCENERY/Scene' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var images = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Vector2 = require( 'DOT/Vector2' );

  function ClosestPointNode( model, modelViewTransform ) {
    Node.call( this );

    var circle = new Circle( 10, {fill: 'blue'} );
    this.addChild( circle );
    model.closestPointProperty.link( function( closestPoint ) {
      circle.translation = modelViewTransform.modelToViewPosition( closestPoint );
    } );
    model.skater.trackProperty.link( function( track ) {
      circle.fill = track ? 'green' : 'blue';
    } );
  }

  return inherit( Node, ClosestPointNode );
} );