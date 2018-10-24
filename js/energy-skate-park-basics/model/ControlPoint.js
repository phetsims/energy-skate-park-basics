// Copyright 2013-2017, University of Colorado Boulder

/**
 * Data structure for a control point, which allows the user to change the track shape in the 'playground' screen.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );
  var ControlPointIO = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/ControlPointIO' );
  var NullableIO = require( 'TANDEM/types/NullableIO' );

  /**
   *
   * @param x
   * @param y
   * @param {Object} options - required
   * @constructor
   */
  function ControlPoint( x, y, options ) {
    var self = this;

    options = _.extend( {
      tandem: Tandem.required,
      phetioType: ControlPointIO
    }, options );
    var tandem = options.tandem;

    // @public (phet-io)
    this.controlPointTandem = tandem;

    // Where it would be if it hadn't snapped to another point during dragging
    this.sourcePositionProperty = new Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'sourcePositionProperty' ),
      phetioType: PropertyIO( Vector2IO )
    } );

    // @public {ControlPoint} - Another ControlPoint that this ControlPoint is going to 'snap' to if released.
    this.snapTargetProperty = new Property( null, {
      tandem: tandem.createTandem( 'snapTargetProperty' ),
      phetioType: PropertyIO( NullableIO( ControlPointIO ) )
    } );

    // Where it is shown on the screen.  Same as sourcePosition (if not snapped) or snapTarget.position (if snapped).
    // Snapping means temporarily connecting to an adjacent open point before the tracks are joined, to indicate that a
    // connection is possible
    // @public {Vector2}
    this.positionProperty = new DerivedProperty( [ this.sourcePositionProperty, this.snapTargetProperty ],
      function( sourcePosition, snapTarget ) {
        return snapTarget ? snapTarget.positionProperty.value : sourcePosition;
      }, {
        tandem: tandem.createTandem( 'positionProperty' ),
        phetioType: DerivedPropertyIO( Vector2IO )
      } );

    PhetioObject.call( this, options );

    // @private
    this.disposeControlPoint = function() {
      self.positionProperty.dispose();
      self.sourcePositionProperty.dispose();
      self.snapTargetProperty.dispose();
    };
  }

  energySkateParkBasics.register( 'ControlPoint', ControlPoint );

  return inherit( PhetioObject, ControlPoint, {

    /**
     * @public
     */
    dispose: function() {
      this.disposeControlPoint();
      PhetioObject.prototype.dispose.call( this );
    },

    copy: function( tandem ) {
      return new ControlPoint( this.positionProperty.value.x, this.positionProperty.value.y, {
        tandem: tandem
      } );
    }
  } );
} );