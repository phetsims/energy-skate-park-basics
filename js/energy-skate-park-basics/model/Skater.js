// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the skater in Energy Skate Park: Basics, including position, velocity, energy, etc..  All units are in meters.
 * @author Sam Reid
 */
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

      //Speed along the parametric spline dimension, formally 'u dot'
      uD: 0.01,

      //Gravity magnitude and direction
      gravity: -9.8,

      position: new Vector2( 0, 0 ),

      mass: 60,

      velocity: new Vector2( 0, 0 ),

      dragging: false,

      kineticEnergy: 0,

      potentialEnergy: 0,

      thermalEnergy: 0,

      totalEnergy: 0,

      angle: 0
    } );

    this.draggingProperty.link( function( dragging ) {
      skater.velocity = new Vector2( 0, 0 );
      skater.u = 0;
      skater.uD = 0;
      skater.track = null;
    } );

    this.addDerivedProperty( 'speed', ['velocity'], function( velocity ) {return velocity.magnitude();} );
    this.massProperty.link( function( mass ) { skater.updateEnergy(); } );

    this.updateEnergy();
  }

  return inherit( PropertySet, Skater, {
    clearThermal: function() {
      this.thermalEnergy = 0.0;
      this.updateEnergy();
    },

    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.updateEnergy();
    },

    returnSkater: function() {
      this.track = null;//Have to reset track before changing position so view angle gets updated properly
      this.positionProperty.reset();
      this.uProperty.reset();
      this.uDProperty.reset();
      this.clearThermal();
    },

    //Update the energies as a batch.  This is an explicit method instead of linked to all dependencies so that it can be called in a controlled fashion \
    //When multiple dependencies have changed, for performance.
    updateEnergy: function() {
      this.kineticEnergy = 0.5 * this.mass * this.velocity.magnitudeSquared();
      this.potentialEnergy = -this.mass * this.position.y * this.gravity;
      this.totalEnergy = this.kineticEnergy + this.potentialEnergy + this.thermalEnergy;

      //Signal that energies have changed for coarse-grained listeners like PieChartNode that should not get updated 3-4 times per times step
      this.trigger( 'energy-changed' );
    }
  } );
} );