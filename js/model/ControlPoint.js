// Copyright 2002-2013, University of Colorado Boulder

/**
 * Data structure for a control point, which allows the user to change the track shape in the 'playground' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  function ControlPoint( x, y ) {

    PropertySet.call( this, {

      // Where it would be if it hadn't snapped to another point during dragging
      sourcePosition: new Vector2( x, y ),

      // Another ControlPoint that this ControlPoint is going to 'snap' to if released.
      snapTarget: null
    } );

    // Where it is shown on the screen.  Same as sourcePosition (if not snapped) or snapTarget.position (if snapped).
    // Snapping means temporarily connecting to an adjacent open point before the tracks are joined, to indicate that a
    // connection is possible
    this.addDerivedProperty( 'position', ['sourcePosition', 'snapTarget'], function( sourcePosition, snapTarget ) {
      return snapTarget ? snapTarget.position : sourcePosition;
    } );
  }

  return inherit( PropertySet, ControlPoint, {
    copy: function() { return new ControlPoint( this.position.x, this.position.y ); }
  } );
} );