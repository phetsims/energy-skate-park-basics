// Copyright 2002-2013, University of Colorado Boulder

/**
 * Immutable snapshot of skater state for updating the physics. To improve performance, operate solely on a skaterState instance without updating the real skater,
 * so that the skater model itself can be set only once, and trigger callbacks only once (no matter how many subdivisions)
 * This can also facilitate debugging and ensuring energy is conserved from one step to another.
 *
 * @author Sam Reid
 */
define( function() {
  'use strict';

  /**
   * Create a SkaterSate from a SkaterState or Skater
   * @param {Skater|SkaterSate} source
   * @param {*] overrides
   * @constructor
   */
  function SkaterState( source, overrides ) {

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
    this.curvature = null;//Lazily computed

    phetAllocation && phetAllocation( 'SkaterState' );
  }

  SkaterState.prototype = {

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

    update: function( overrides ) { return new SkaterState( this, overrides ); },

    //Get the curvature at the skater's point on the track, caching the value.
    getCurvature: function() {
      if ( !this.curvature ) {
        this.curvature = this.track.getCurvature( this.u );
      }
      return this.curvature;
    },

    //Only set values that have changed
    setToSkater: function( skater ) {
      skater.stepsSinceJump = this.stepsSinceJump;
      skater.angle = this.angle;
      skater.track = this.track;
      skater.position = this.position;
      skater.velocity = this.velocity;
      skater.up = this.up;
      skater.u = this.u;
      skater.uD = this.uD;
      skater.thermalEnergy = this.thermalEnergy;
      if ( skater.track ) {
        skater.angle = skater.track.getViewAngleAt( skater.u );
      }
      skater.updateEnergy();
    }
  };

  return SkaterState;
} );