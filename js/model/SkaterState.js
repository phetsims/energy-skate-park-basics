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

  function SkaterState( source, overrides ) {
    this.dragging = overrides.dragging || source.dragging;
    this.thermalEnergy = overrides.thermalEnergy || source.thermalEnergy;
    this.gravity = overrides.gravity || source.gravity;
    this.track = overrides.track || source.track;
    this.position = overrides.position || source.position;
    this.velocity = overrides.velocity || source.velocity;
    this.mass = overrides.mass || source.mass;
    this.up = overrides.up || source.up;
    this.u = overrides.u || source.u;
    this.uD = overrides.uD || source.uD;
  }

  SkaterState.prototype.getTotalEnergy = function() {
    return 0.5 * this.mass * this.velocity.magnitudeSquared() - this.mass * this.gravity * this.position.y + this.thermalEnergy;
  };

  SkaterState.prototype.with = function( overrides ) { return new SkaterState( this, overrides ); };

  //Only set values that have changed
  SkaterState.prototype.setToSkater = function( skater ) {
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
  };
  return SkaterState;
} );