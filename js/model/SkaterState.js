// Copyright 2002-2013, University of Colorado Boulder

/**
 * Immutable snapshot of skater state for updating the physics. To improve performance, operate solely on a skaterState instance without updating the real skater,
 * so that the skater model itself can be set only once, and trigger callbacks only once (no matter how many subdivisions).
 * This can also facilitate debugging and ensuring energy is conserved from one step to another. Pooled to avoid allocation problems, see #50
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var EMPTY_OBJECT = {};

  var Poolable = require( 'PHET_CORE/Poolable' );
  var Vector2 = require( 'DOT/Vector2' );

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

  //Keep track of all of the SkaterStates allocated during a frame
  SkaterState.allocated = [];

  //Clear all SkaterStates at the end of the frame
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

      //Handle the case of a skater passed in (which has a position vector) or a SkaterState passed in, which has a number
      if ( source.position ) {
        this.positionX = 'positionX' in overrides ? overrides.positionX : source.position.x;
        this.positionY = 'positionY' in overrides ? overrides.positionY : source.position.y;

        this.velocityX = 'velocityX' in overrides ? overrides.velocityX : source.velocity.x;
        this.velocityY = 'velocityY' in overrides ? overrides.velocityY : source.velocity.y;
      }
      else {
        this.positionX = 'positionX' in overrides ? overrides.positionX : source.positionX;
        this.positionY = 'positionY' in overrides ? overrides.positionY : source.positionY;

        this.velocityX = 'velocityX' in overrides ? overrides.velocityX : source.velocityX;
        this.velocityY = 'velocityY' in overrides ? overrides.velocityY : source.velocityY;
      }

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
      assert && assert( isFinite( this.thermalEnergy ) );
      assert && assert( isFinite( this.velocityX ) );
      assert && assert( isFinite( this.velocityY ) );
      assert && assert( isFinite( this.uD ) );

      return this;
    },

    //Get the total energy in this state.  Computed directly instead of using other methods to (hopefully) improve performance
    getTotalEnergy: function() {
      return 0.5 * this.mass * (this.velocityX * this.velocityX + this.velocityY * this.velocityY) - this.mass * this.gravity * this.positionY + this.thermalEnergy;
    },

    getKineticEnergy: function() {
      return 0.5 * this.mass * (this.velocityX * this.velocityX + this.velocityY * this.velocityY);
    },

    getPotentialEnergy: function() {
      return -this.mass * this.gravity * this.positionY;
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

      //Set property values manually to avoid allocations, see #50
      skater.position.x = this.positionX;
      skater.position.y = this.positionY;
      skater.positionProperty.notifyObserversStatic();

      skater.velocity.x = this.velocityX;
      skater.velocity.y = this.velocityY;
      skater.velocityProperty.notifyObserversStatic();

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
    updateUUDVelocityPosition: function( u, uD, velocityX, velocityY, positionX, positionY ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.u = u;
      state.uD = uD;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    updatePositionAngleUpVelocity: function( positionX, positionY, angle, up, velocityX, velocityY ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.angle = angle;
      state.up = up;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    updateThermalEnergy: function( thermalEnergy ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.thermalEnergy = thermalEnergy;
      return state;
    },

    switchToGround: function( thermalEnergy, velocityX, velocityY, positionX, positionY ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.thermalEnergy = thermalEnergy;
      state.track = null;
      state.up = true;
      state.angle = 0;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    strikeGround: function( thermalEnergy, positionX ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.thermalEnergy = thermalEnergy;
      state.positionX = positionX;
      state.positionY = 0;
      state.velocityX = 0;
      state.velocityY = 0;
      state.angle = 0;
      state.up = true;
      state.stepsSinceJump = 0;
      return state;
    },

    copy: function() {
      return SkaterState.createFromPool( this, EMPTY_OBJECT );
    },

    leaveTrack: function() {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.uD = 0;
      state.track = null;

      //Keep track of the steps since jumping, otherwise it can run into the track again immediately, which increases thermal energy
      state.stepsSinceJump = 0;
      return state;
    },

    updatePosition: function( positionX, positionY ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    updateUDVelocity: function( uD, velocityX, velocityY ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.uD = uD;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      return state;
    },

    continueFreeFall: function( velocityX, velocityY, positionX, positionY, stepsSinceJump ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      state.stepsSinceJump = stepsSinceJump;
      return state;
    },

    attachToTrack: function( thermalEnergy, track, up, u, uD, velocityX, velocityY, positionX, positionY ) {
      var state = SkaterState.createFromPool( this, EMPTY_OBJECT );
      state.thermalEnergy = thermalEnergy;
      state.track = track;
      state.up = up;
      state.u = u;
      state.uD = uD;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    getSpeed: function() {
      return Math.sqrt( this.velocityX * this.velocityX + this.velocityY * this.velocityY );
    },

    //TODO: Allocations
    getVelocity: function() {
      return new Vector2( this.velocityX, this.velocityY );
    },

    constructor: SkaterState
  };

  // Object pooling to prevent allocations, see #50
  /* jshint -W064 */
  Poolable( SkaterState, {
    debug: false,
    constructorDuplicateFactory: function( pool ) {
      return function( source, overrides ) {
        if ( pool.length ) {
          var result = pool.pop().setState( source, overrides );

          //All SkaterStates are cleared each frame, so track each available one so they can be cleared, see #50
          SkaterState.allocated.push( result );
          return result;
        }
        else {
          return new SkaterState( source, overrides );
        }
      };
    }
  } );

  return SkaterState;
} );