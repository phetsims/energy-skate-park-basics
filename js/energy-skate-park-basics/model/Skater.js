// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  function Skater() {
    var skater = this;
    PropertySet.call( this, {track: null,

      //Scalar indicating speed and direction (+/-) along the track spline
      trackSpeed: 0,

      //Parameter along the parametric spline
      u: 0,

      //Speed along the parametric spline dimension
      uD: 0.01,

      //Gravity magnitude and direction
      gravity: -9.8,

      position: new Vector2( 0, 0 ),

      mass: 30,

      velocity: new Vector2( 0, 0 ),

      dragging: false,

      kineticEnergy: 0,

      potentialEnergy: 0,

      thermalEnergy: 0,

      totalEnergy: 0
    } );

    this.draggingProperty.link( function( dragging ) {
      skater.velocity = new Vector2( 0, 0 );
      skater.track = null;
    } );

    this.updateEnergy();
  }

  return inherit( PropertySet, Skater, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.updateEnergy();
    },
    updateEnergy: function() {
      this.kineticEnergy = 0.5 * this.mass * this.velocity.magnitudeSquared();
      this.potentialEnergy = -this.mass * this.position.y * this.gravity;
      this.totalEnergy = this.kineticEnergy + this.potentialEnergy + this.thermalEnergy;

      //Signal that energies have changed for coarse-grained listeners like PieChartNode that should not get updated 3-4 times per times step
      this.trigger( 'energy-changed' );
    }
  } );
} );