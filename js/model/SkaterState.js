// Copyright 2002-2013, University of Colorado Boulder

/**
 * Immutable snapshot of skater state for updating the physics. To improve performance, operate solely on a skaterState instance without updating the real skater,
 * so that the skater model itself can be set only once, and trigger callbacks only once (no matter how many subdivisions)
 * This can also facilitate debugging and ensuring energy is conserved from one step to another.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var EMPTY_OBJECT = {};

  var Poolable = require( 'PHET_CORE/Poolable' );

  /**
   * Create a SkaterSate from a SkaterState or Skater
   * @param {Skater|SkaterSate} source
   * @param {*] overrides
   * @constructor
   */
  function SkaterState( source, overrides ) {
    this.setState( source, overrides );
    phetAllocation && phetAllocation( 'SkaterState' );
    SkaterState.allocated.push( this );
  }

  SkaterState.allocated = [];

  SkaterState.clearAllocated = function() {
    for ( var i = 0; i < SkaterState.allocated.length; i++ ) {
      var skaterState = SkaterState.allocated[i];
      skaterState.freeToPool();
    }
    SkaterState.allocated.length = 0;
  };

  SkaterState.prototype = {

    setState: function( source, overrides ) {

      if ( !overrides ) {
        overrides = EMPTY_OBJECT;
      }

      //This code is called many times from the physics loop, so must be optimized for speed and memory
      this.gravity = overrides.gravity || source.gravity;
      this.position = overrides.position || source.position;
      this.velocity = overrides.velocity || source.velocity;
      this.mass = overrides.mass || source.mass;

      //Special handling for values that can be null, false or zero
      this.stepsSinceJump = 'stepsSinceJump' in overrides ? overrides.stepsSinceJump : source.stepsSinceJump;
      this.track = 'track' in overrides ? overrides.track : source.track;
      this.angle = 'angle' in overrides ? overrides.angle : source.angle;
      this.up = 'up' in overrides ? overrides.up : source.up;
      this.u = 'u' in overrides ? overrides.u : source.u;
      this.uD = 'uD' in overrides ? overrides.uD : source.uD;
      this.dragging = 'dragging' in overrides ? overrides.dragging : source.dragging;
      this.thermalEnergy = 'thermalEnergy' in overrides ? overrides.thermalEnergy : source.thermalEnergy;

      //Some sanity tests
      assert && assert( !isNaN( this.thermalEnergy ) );
      assert && assert( !isNaN( this.velocity.x ) );
      assert && assert( !isNaN( this.velocity.y ) );
      assert && assert( !isNaN( this.uD ) );

      return this;
    },

    //Get the total energy in this state.  Computed directly instead of using other methods to (hopefully) improve performance
    getTotalEnergy: function() {
      return 0.5 * this.mass * this.velocity.magnitudeSquared() - this.mass * this.gravity * this.position.y + this.thermalEnergy;
    },

    getKineticEnergy: function() {
      return 0.5 * this.mass * this.velocity.magnitudeSquared();
    },

    getPotentialEnergy: function() {
      return -this.mass * this.gravity * this.position.y;
    },

    update: function( overrides ) { return SkaterState.createFromPool( this, overrides ); },

    //Get the curvature at the skater's point on the track, by setting it to the pass-by-reference argument
    getCurvature: function( curvature ) {
      this.track.getCurvature( this.u, curvature );
    },

    //Only set values that have changed
    setToSkater: function( skater ) {
      skater.stepsSinceJump = this.stepsSinceJump;
      skater.track = this.track;
      skater.position = this.position;
      skater.velocity = this.velocity;
      skater.u = this.u;
      skater.uD = this.uD;
      skater.thermalEnergy = this.thermalEnergy;
      skater.up = this.up;
      skater.angle = skater.track ? skater.track.getViewAngleAt( this.u ) + (this.up ? 0 : Math.PI) : this.angle;
      skater.updateEnergy();
    },

    //Create a new SkaterState with the new values.  Provided as a convenience to avoid allocating options argument (as in update)
    updateTrackUDStepsSinceJump: function( track, uD, stepsSinceJump ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.track = track;
      state.uD = uD;
      state.stepsSinceJump = stepsSinceJump;
      return state;
    },

    //Create a new SkaterState with the new values.  Provided as a convenience to avoid allocating options argument (as in update)
    updateUUDVelocityPosition: function( u, uD, velocity, position ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.u = u;
      state.uD = uD;
      state.velocity = velocity;
      state.position = position;
      return state;
    }
  };

  // Object pooling to prevent allocations, see #50
  //TODO: 3 SkaterState still allocated per frame.  Why?
  /* jshint -W064 */
  Poolable( SkaterState, {
    constructorDuplicateFactory: function( pool ) {
      return function( source, overrides ) {
        if ( pool.length ) {
//          console.log( 'loaded from pool' );
          return pool.pop().setState( source, overrides );
        }
        else {
//          console.log( 'loaded from heap' );
          return new SkaterState( source, overrides );
        }
      };
    }
  } );

  return SkaterState;
} );