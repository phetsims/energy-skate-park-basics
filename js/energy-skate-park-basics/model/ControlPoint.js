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
  var Property = require( 'AXON/Property' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Vector2 = require( 'DOT/Vector2' );
  var TVector2 = require( 'DOT/TVector2' );

  // phet-io modules
  var TControlPoint = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/TControlPoint' );

  /**
   *
   * @param x
   * @param y
   * @param {Tandem} tandem
   * @constructor
   */
  function ControlPoint( x, y, tandem ) {
    var self = this;

    // @public (phet-io)
    this.tandem = tandem;

    // Where it would be if it hadn't snapped to another point during dragging
    this.sourcePositionProperty = new Property( new Vector2( x, y ), {
      tandem: tandem.createTandem( 'sourcePositionProperty' ),
      phetioValueType: TVector2
    } );

    // Another ControlPoint that this ControlPoint is going to 'snap' to if released.
    this.snapTargetProperty = new Property( null, {
      tandem: tandem.createTandem( 'snapTargetProperty' ),
      phetioValueType: TControlPoint
    } );

    Property.preventGetSet( this, 'sourcePosition' );
    Property.preventGetSet( this, 'snapTarget' );

    // Where it is shown on the screen.  Same as sourcePosition (if not snapped) or snapTarget.position (if snapped).
    // Snapping means temporarily connecting to an adjacent open point before the tracks are joined, to indicate that a
    // connection is possible
    this.positionProperty = new DerivedProperty( [ this.sourcePositionProperty, this.snapTargetProperty ],
      function( sourcePosition, snapTarget ) {
        return snapTarget ? snapTarget.positionProperty.value : sourcePosition;
      }, {
        tandem: tandem.createTandem( 'positionProperty' ),
        phetioValueType: TVector2
      } );
    Property.preventGetSet( this, 'position' );

    tandem.addInstance( this, TControlPoint );

    this.disposeControlPoint = function() {
      tandem.removeInstance( self );
      self.positionProperty.unlinkAll();
      self.positionProperty.dispose();

      self.sourcePositionProperty.unlinkAll();
      self.sourcePositionProperty.dispose();

      self.snapTargetProperty.unlinkAll();
      self.snapTargetProperty.dispose();
    };
  }

  energySkateParkBasics.register( 'ControlPoint', ControlPoint );

  return inherit( Object, ControlPoint, {
    dispose: function() {
      this.disposeControlPoint();
    },
    copy: function( tandem ) {
      return new ControlPoint( this.positionProperty.value.x, this.positionProperty.value.y, tandem );
    }
  } );
} );