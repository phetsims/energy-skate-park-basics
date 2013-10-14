// Copyright 2002-2013, University of Colorado Boulder

/**
 * Data structure for a control point
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  function ControlPoint( x, y ) {

    PropertySet.call( this, {

      //Where it would be if it hadn't snapped
      sourcePosition: new Vector2( x, y ),

      snapTarget: null
    } );

    //Where it is shown on the screen.  Same as sourcePosition (if not snapped) or snapTarget.position (if snapped)
    this.addDerivedProperty( 'position', ['sourcePosition', 'snapTarget'], function( sourcePosition, snapTarget ) {
      return snapTarget ? snapTarget.position : sourcePosition;
    } );
  }

  return inherit( PropertySet, ControlPoint, {
    copy: function() { return new ControlPoint( this.position.x, this.position.y ); }
  } );
} );