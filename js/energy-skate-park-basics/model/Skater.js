// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  function Skater() {
    var skater = this;
    PropertySet.call( this, {position: new Vector2( 0, 0 ), mass: 30, velocity: new Vector2( 0, 0 ), dragging: false} );

    this.draggingProperty.link( function() {
      skater.velocity = new Vector2( 0, 0 );
    } );
  }

  return inherit( PropertySet, Skater, {step: function( dt ) {
    if ( !this.dragging ) {
      var netForce = new Vector2( 0, -9.8 * this.mass );
      this.acceleration = netForce.times( 1.0 / this.mass );
      this.velocity = this.velocity.plus( this.acceleration.times( dt ) );
      var proposedPosition = this.position.plus( this.velocity.times( dt ) );
      if ( proposedPosition.y < 0 ) {
        proposedPosition.y = 0;
      }
      this.position = proposedPosition;
    }
  }} );
} );