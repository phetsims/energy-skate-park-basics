// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the skater in Energy Skate Park: Basics, including position, velocity, energy, etc..  All units are in meters.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  function Skater() {
    var skater = this;

    PropertySet.call( this, {track: null,

      //Parameter along the parametric spline
      u: 0,

      //Speed along the parametric spline dimension, formally 'u dot', indicating speed and direction (+/-) along the track spline
      uD: 0,

      //True if the skater is pointing up on the track, false if attached to underside of track
      up: true,

      //Gravity magnitude and direction
      gravity: -9.8,

      position: new Vector2( 0, 0 ),

      //Start in the middle of the MassSlider range
      mass: (25 + 100) / 2,

      //Which way the skater is facing, right or left.  Coded as strings instead of boolean in case we add other states later like 'forward'
      direction: 'right',

      velocity: new Vector2( 0, 0 ),

      dragging: false,

      kineticEnergy: 0,

      potentialEnergy: 0,

      thermalEnergy: 0,

      totalEnergy: 0,

      angle: 0,

      //Returns to this point when pressing "return skater"
      startingPosition: new Vector2( 0, 0 ),

      //Returns to this parametric position along the track when pressing "return skater"
      startingU: 0,

      //Returns to this track when pressing "return skater"
      startingTrack: null
    } );

    this.addDerivedProperty( 'speed', ['velocity'], function( velocity ) {return velocity.magnitude();} );
    this.addDerivedProperty( 'headPosition', ['position', 'mass', 'angle', 'up'], function( position, mass, angle, up ) {

      //Center pie chart over skater's head not his feet so it doesn't look awkward when skating in a parabola
      //when mass is minimum, the skater height is 1.5
      //when mass is max, the skater height is 2.5
      var skaterHeight = Util.linear( 10, 110, 1.5, 2.5, mass );
      var vector = Vector2.createPolar( skaterHeight, angle - Math.PI / 2 );

      if ( !up ) {
        vector.multiplyScalar( -1 );
      }
      return position.plusXY( vector.x, -vector.y );
    } );

    //Zero the kinetic energy when dragging, see https://github.com/phetsims/energy-skate-park-basics/issues/22
    this.draggingProperty.link( function( dragging ) { if ( dragging ) { skater.velocity = new Vector2( 0, 0 ); } } );

    this.uDProperty.link( function( uD ) {
      if ( uD > 0 ) {
        skater.direction = 'right';
      }
      else if ( uD < 0 ) {
        skater.direction = 'left';
      }
      else {
        //Keep the same direction
      }
    } );

    //Boolean flag that indicates whether the skater has moved from his initial position, and hence can be 'returned',
    //For making the 'return skater' button enabled/disabled
    //If this is a performance concern, perhaps it could just be dropped as a feature
    this.addDerivedProperty( 'moved', ['position', 'startingPosition'], function( x, x0 ) { return x.x !== x0.x || x.y !== x0.y; } );

    this.massProperty.link( function() { skater.updateEnergy(); } );

    this.updateEnergy();
  }

  return inherit( PropertySet, Skater, {

    //Get the vector from feet to head, so that when tracks are joined we can make sure he is still pointing up
    get upVector() { return this.headPosition.minus( this.position ); },

    clearThermal: function() {
      this.thermalEnergy = 0.0;
      this.updateEnergy();
    },

    reset: function() {
      //set the angle to zero before calling PropertySet.prototype.reset so that the optimization for SkaterNode.updatePosition is maintained,
      //Without showing the skater at the wrong angle
      this.angle = 0;
      PropertySet.prototype.reset.call( this );
      this.updateEnergy();
    },

    //Return the skater to the last location it was released by the user (or its starting location)
    //Including the position on a track (if any)
    returnSkater: function() {

      //Have to reset track before changing position so view angle gets updated properly
      if ( this.startingTrack ) {
        this.track = this.startingTrack;
        this.u = this.startingU;
        this.angle = this.startingTrack.getViewAngleAt( this.u );
        this.uD = 0;
      }
      else {
        this.track = null;
      }
      this.positionProperty.set( new Vector2( this.startingPosition.x, this.startingPosition.y ) );
      this.velocity = new Vector2( 0, 0 );
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