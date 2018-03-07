// Copyright 2013-2017, University of Colorado Boulder

/**
 * Immutable snapshot of skater state for updating the physics. To improve performance, operate solely on a skaterState
 * instance without updating the real skater, so that the skater model itself can be set only once, and trigger
 * callbacks only once (no matter how many subdivisions). This can also facilitate debugging and ensuring energy is
 * conserved from one step to another. Pooled to avoid allocation problems, see #50. Another reason this class is
 * valuable is to create and evaluate proposed states before applying them to the live model.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var EMPTY_OBJECT = {};

  /**
   * Create a SkaterSate from a SkaterState or Skater
   * @param {Skater|SkaterSate} source
   * @param {*] overrides the new values
   * @constructor
   */
  function SkaterState( source, overrides ) {
    this.setState( source, overrides );
    phetAllocation && phetAllocation( 'SkaterState' );
  }

  energySkateParkBasics.register( 'SkaterState', SkaterState );

  var getValue = function( key, source, overrides ) {
    return key in overrides ? overrides[ key ] :
           typeof source[ key + 'Property' ] === 'object' ? source[ key + 'Property' ].value :
           source[ key ];
  };

  return inherit( Object, SkaterState, {

    /**
     * Create a new SkaterState.
     * @param {Skater|SkaterState} source the initial values to use
     * @param {*} overrides the new values to override in the source
     * @returns {SkaterState} the new SkaterState
     */
    setState: function( source, overrides ) {

      if ( !overrides ) {
        overrides = EMPTY_OBJECT;
      }


      // Handle the case of a skater passed in (which has a position vector) or a SkaterState passed in, which has a number
      if ( source.positionProperty ) {
        this.positionX = 'positionX' in overrides ? overrides.positionX : source.positionProperty.value.x;
        this.positionY = 'positionY' in overrides ? overrides.positionY : source.positionProperty.value.y;

        this.velocityX = 'velocityX' in overrides ? overrides.velocityX : source.velocityProperty.value.x;
        this.velocityY = 'velocityY' in overrides ? overrides.velocityY : source.velocityProperty.value.y;
      }
      else {
        this.positionX = 'positionX' in overrides ? overrides.positionX : source.positionX;
        this.positionY = 'positionY' in overrides ? overrides.positionY : source.positionY;

        this.velocityX = 'velocityX' in overrides ? overrides.velocityX : source.velocityX;
        this.velocityY = 'velocityY' in overrides ? overrides.velocityY : source.velocityY;
      }

      // This code is called many times from the physics loop, so must be optimized for speed and memory
      // Special handling for values that can be null, false or zero
      this.gravity = getValue( 'gravity', source, overrides );
      this.mass = getValue( 'mass', source, overrides );
      this.track = getValue( 'track', source, overrides );
      this.angle = getValue( 'angle', source, overrides );
      this.onTopSideOfTrack = getValue( 'onTopSideOfTrack', source, overrides );
      this.parametricPosition = getValue( 'parametricPosition', source, overrides );
      this.parametricSpeed = getValue( 'parametricSpeed', source, overrides );
      this.dragging = getValue( 'dragging', source, overrides );
      this.thermalEnergy = getValue( 'thermalEnergy', source, overrides );

      // Some sanity tests
      assert && assert( isFinite( this.thermalEnergy ) );
      assert && assert( isFinite( this.velocityX ) );
      assert && assert( isFinite( this.velocityY ) );
      assert && assert( isFinite( this.parametricSpeed ) );

      assert && assert( this.thermalEnergy >= 0 );

      return this;
    },

    // Get the total energy in this state.  Computed directly instead of using other methods to (hopefully) improve performance
    getTotalEnergy: function() {
      return 0.5 * this.mass * (this.velocityX * this.velocityX + this.velocityY * this.velocityY) - this.mass * this.gravity * this.positionY + this.thermalEnergy;
    },

    getKineticEnergy: function() {
      return 0.5 * this.mass * (this.velocityX * this.velocityX + this.velocityY * this.velocityY);
    },

    getPotentialEnergy: function() {
      return -this.mass * this.gravity * this.positionY;
    },

    update: function( overrides ) { return new SkaterState( this, overrides ); },

    // Get the curvature at the skater's point on the track, by setting it to the pass-by-reference argument
    getCurvature: function( curvature ) {
      this.track.getCurvature( this.parametricPosition, curvature );
    },

    // Only set values that have changed
    setToSkater: function( skater ) {
      skater.trackProperty.value = this.track;

      // Set property values manually to avoid allocations, see #50
      skater.positionProperty.value.x = this.positionX;
      skater.positionProperty.value.y = this.positionY;
      skater.positionProperty.notifyListenersStatic();

      skater.velocityProperty.value.x = this.velocityX;
      skater.velocityProperty.value.y = this.velocityY;
      skater.velocityProperty.notifyListenersStatic();

      skater.parametricPositionProperty.value = this.parametricPosition;
      skater.parametricSpeedProperty.value = this.parametricSpeed;
      skater.thermalEnergyProperty.value = this.thermalEnergy;
      skater.onTopSideOfTrackProperty.value = this.onTopSideOfTrack;
      skater.angleProperty.value = skater.trackProperty.value ? skater.trackProperty.value.getViewAngleAt( this.parametricPosition ) + (this.onTopSideOfTrack ? 0 : Math.PI) : this.angle;
      skater.updateEnergy();
    },

    // Create a new SkaterState with the new values.  Provided as a convenience to avoid allocating options argument
    // (as in update)
    updateTrackUD: function( track, parametricSpeed ) {
        var state = new SkaterState( this, EMPTY_OBJECT );
        state.track = track;
      state.parametricSpeed = parametricSpeed;
        return state;
      },

    // Create a new SkaterState with the new values.  Provided as a convenience to avoid allocating options argument
    // (as in update)
    updateUUDVelocityPosition: function( parametricPosition, parametricSpeed, velocityX, velocityY, positionX, positionY ) {
      var state = new SkaterState( this, EMPTY_OBJECT );
      state.parametricPosition = parametricPosition;
      state.parametricSpeed = parametricSpeed;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    updatePositionAngleUpVelocity: function( positionX, positionY, angle, onTopSideOfTrack, velocityX, velocityY ) {
      var state = new SkaterState( this, EMPTY_OBJECT );
      state.angle = angle;
      state.onTopSideOfTrack = onTopSideOfTrack;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    updateThermalEnergy: function( thermalEnergy ) {
      assert && assert( thermalEnergy >= 0 );

      var state = new SkaterState( this, EMPTY_OBJECT );
      state.thermalEnergy = thermalEnergy;
      return state;
    },

    updateUPosition: function( parametricPosition, positionX, positionY ) {
      var state = new SkaterState( this, EMPTY_OBJECT );
      state.parametricPosition = parametricPosition;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    switchToGround: function( thermalEnergy, velocityX, velocityY, positionX, positionY ) {
      assert && assert( thermalEnergy >= 0 );

      var state = new SkaterState( this, EMPTY_OBJECT );
      state.thermalEnergy = thermalEnergy;
      state.track = null;
      state.onTopSideOfTrack = true;
      state.angle = 0;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    strikeGround: function( thermalEnergy, positionX ) {
      assert && assert( thermalEnergy >= 0 );

      var state = new SkaterState( this, EMPTY_OBJECT );
      state.thermalEnergy = thermalEnergy;
      state.positionX = positionX;
      state.positionY = 0;
      state.velocityX = 0;
      state.velocityY = 0;
      state.angle = 0;
      state.onTopSideOfTrack = true;
      return state;
    },

    copy: function() {
      return new SkaterState( this, EMPTY_OBJECT );
    },

    leaveTrack: function() {
      var state = new SkaterState( this, EMPTY_OBJECT );
      state.parametricSpeed = 0;
      state.track = null;
      return state;
    },

    updatePosition: function( positionX, positionY ) {
      var state = new SkaterState( this, EMPTY_OBJECT );
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    updateUDVelocity: function( parametricSpeed, velocityX, velocityY ) {
      var state = new SkaterState( this, EMPTY_OBJECT );
      state.parametricSpeed = parametricSpeed;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      return state;
    },

    continueFreeFall: function( velocityX, velocityY, positionX, positionY ) {
      var state = new SkaterState( this, EMPTY_OBJECT );
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    attachToTrack: function( thermalEnergy, track, onTopSideOfTrack, parametricPosition, parametricSpeed, velocityX, velocityY, positionX, positionY ) {
      assert && assert( thermalEnergy >= 0 );

      var state = new SkaterState( this, EMPTY_OBJECT );
      state.thermalEnergy = thermalEnergy;
      state.track = track;
      state.onTopSideOfTrack = onTopSideOfTrack;
      state.parametricPosition = parametricPosition;
      state.parametricSpeed = parametricSpeed;
      state.velocityX = velocityX;
      state.velocityY = velocityY;
      state.positionX = positionX;
      state.positionY = positionY;
      return state;
    },

    getSpeed: function() {
      return Math.sqrt( this.velocityX * this.velocityX + this.velocityY * this.velocityY );
    },

    getVelocity: function() {
      return new Vector2( this.velocityX, this.velocityY );
    },

    freeToPool: function() {},

    // Create a new Vector2 that contains the positionX/positionY of this SkaterState
    getPosition: function() {
      return new Vector2( this.positionX, this.positionY );
    }
  } );
} );