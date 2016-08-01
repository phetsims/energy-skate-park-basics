// Copyright 2013-2015, University of Colorado Boulder

/**
 * Data structure for a control point, which allows the user to change the track shape in the 'playground' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );
  var TControlPoint = require( 'ifphetio!PHET_IO/simulations/energy-skate-park-basics/TControlPoint' );

  /**
   *
   * @param x
   * @param y
   * @param {Tandem} tandem
   * @constructor
   */
  function ControlPoint( x, y, tandem ) {

    PropertySet.call( this, {

      // Where it would be if it hadn't snapped to another point during dragging
      sourcePosition: new Vector2( x, y ),

      // Another ControlPoint that this ControlPoint is going to 'snap' to if released.
      snapTarget: null
    }, {
      tandemSet: {
        sourcePosition: tandem.createTandem( 'sourcePositionProperty' ),
        snapTarget: tandem.createTandem( 'snapTargetProperty' )
      },
      phetioValueTypeSet: {
        sourcePosition: TVector2,
        snapTarget: TControlPoint
      }
    } );

    // Where it is shown on the screen.  Same as sourcePosition (if not snapped) or snapTarget.position (if snapped).
    // Snapping means temporarily connecting to an adjacent open point before the tracks are joined, to indicate that a
    // connection is possible
    this.addDerivedProperty( 'position', [ 'sourcePosition', 'snapTarget' ], function( sourcePosition, snapTarget ) {
      return snapTarget ? snapTarget.position : sourcePosition;
    }, tandem.createTandem( 'positionProperty' ), TVector2 );

    tandem.addInstance( this, TControlPoint );
  }

  energySkateParkBasics.register( 'ControlPoint', ControlPoint );

  return inherit( PropertySet, ControlPoint, {
    copy: function( tandem ) {
      return new ControlPoint( this.position.x, this.position.y, tandem );
    }
  } );
} );