// Copyright 2002-2013, University of Colorado Boulder

/**
 * Debugging utility to show the closest point to the skater (on the track).
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  function ClosestPointNode( model, modelViewTransform ) {
    Node.call( this );

    var circle = new Circle( 10, {fill: 'blue', pickable: false} );
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