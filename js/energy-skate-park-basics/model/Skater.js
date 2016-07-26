// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model for the skater in Energy Skate Park: Basics, including position, velocity, energy, etc..
 * All units are in meters.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );

  // phet-io modules
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // Compare two arrays, whose elements have 'equals' methods for comparison
  var arrayEquals = function( a, b ) {
    if ( a.length !== b.length ) {
      return false;
    }
    for ( var i = 0; i < a.length; i++ ) {
      var elm1 = a[ i ];
      var elm2 = b[ i ];
      if ( !elm1.equals( elm2 ) ) {
        return false;
      }
    }
    return true;
  };

  function Skater( tandem ) {
    var skater = this;

    PropertySet.call( this, {

      // The track the skater is on, or null if free-falling
      track: null,

      // Parameter along the parametric spline, unitless since it is in parametric space
      u: 0,

      // Speed along the parametric spline dimension, formally 'u dot', indicating speed and direction (+/-) along the
      // track spline in meters per second.  Not technically the derivative of 'u' since it is the euclidean speed.
      uD: 0,

      // True if the skater is pointing up on the track, false if attached to underside of track
      up: true,

      // Gravity magnitude and direction
      gravity: -9.8,

      position: new Vector2( 3.5, 0 ),

      // Start in the middle of the MassControlPanel range
      mass: Constants.DEFAULT_MASS,

      // Which way the skater is facing, right or left.  Coded as strings instead of boolean in case we add other states
      // later like 'forward'
      direction: 'left',

      velocity: new Vector2( 0, 0 ),

      // True if the user is dragging the skater with a pointer
      dragging: false,

      // Energies are in Joules
      kineticEnergy: 0,

      potentialEnergy: 0,

      thermalEnergy: 0,

      totalEnergy: 0,

      // The skater's angle (about the pivot point at the bottom center), in radians
      angle: 0,

      // Returns to this point when pressing "return skater"
      startingPosition: new Vector2( 3.5, 0 ),

      // Returns to this parametric position along the track when pressing "return skater"
      startingU: 0,

      startingUp: true,

      // Returns to this track when pressing "return skater"
      startingTrack: null,

      // Position of the skater's head, for positioning the pie chart.
      headPosition: new Vector2( 0, 0 )
    }, {
      tandemSet: {
        position: tandem.createTandem( 'skaterPositionProperty' ),
        u: tandem.createTandem( 'skaterParametricDistanceAlongTrackProperty' ),
        up: tandem.createTandem( 'skaterUpsideUpOnTrackProperty' ),
        mass: tandem.createTandem( 'skaterMassProperty' ),
        gravity: tandem.createTandem( 'gravityProperty' ),
        direction: tandem.createTandem( 'skaterDirectionProperty' ),
        kineticEnergy: tandem.createTandem( 'skaterKineticEnergyProperty' ),
        potentialEnergy: tandem.createTandem( 'skaterPotentialEnergyProperty' ),
        thermalEnergy: tandem.createTandem( 'skaterThermalEnergyProperty' ),
        totalEnergy: tandem.createTandem( 'skaterTotalEnergyProperty' ),
        velocity: tandem.createTandem( 'skaterVelocityProperty' ),
        dragging: tandem.createTandem( 'skaterDraggingProperty' ),
        angle: tandem.createTandem( 'skaterAngleProperty' )
      },
      typeSet: {
        position: TVector2,
        u: TNumber && TNumber( 'unitless' ),
        up: TBoolean,
        mass: TNumber && TNumber( 'kilograms' ),
        gravity: TNumber && TNumber( 'meters/second/second' ),
        direction: TString,
        kineticEnergy: TNumber && TNumber( 'joules' ),
        potentialEnergy: TNumber && TNumber( 'joules' ),
        thermalEnergy: TNumber && TNumber( 'joules' ),
        totalEnergy: TNumber && TNumber( 'joules' ),
        velocity: TVector2,
        dragging: TBoolean,
        angle: TNumber && TNumber( 'radians' )
      }
    } );

    this.addDerivedProperty( 'speed', [ 'velocity' ], function( velocity ) {
      return velocity.magnitude();
    } );

    // Zero the kinetic energy when dragging, see #22
    this.draggingProperty.link( function( dragging ) {
      if ( dragging ) {
        skater.velocity = new Vector2( 0, 0 );
      }
    } );

    this.link( 'uD', function( uD ) {

      // Require the skater to overcome a speed threshold so he won't toggle back and forth rapidly at the bottom of a
      // well with friction, see #51
      var speedThreshold = 0.01;

      if ( uD > speedThreshold ) {
        skater.direction = skater.up ? 'right' : 'left';
      }
      else if ( uD < -speedThreshold ) {
        skater.direction = skater.up ? 'left' : 'right';
      }
      else {
        // Keep the same direction
      }
    } );

    // Boolean flag that indicates whether the skater has moved from his initial position, and hence can be 'returned',
    // For making the 'return skater' button enabled/disabled
    // If this is a performance concern, perhaps it could just be dropped as a feature
    this.addDerivedProperty( 'moved', [ 'position', 'startingPosition', 'dragging' ], function( x, x0, dragging ) {
      return !dragging && (x.x !== x0.x || x.y !== x0.y);
    } );

    this.property( 'mass' ).link( function() { skater.updateEnergy(); } );

    this.updateEnergy();

    this.on( 'updated', function() {
      skater.updateHeadPosition();
    } );

    // Enable the "Clear Thermal" buttons but only if the thermal energy exceeds a tiny threshold, so there aren't visual
    // "false positives", see #306
    this.addDerivedProperty( 'allowClearingThermalEnergy', [ 'thermalEnergy' ], function( thermalEnergy ) {return thermalEnergy > 1E-2;} );
  }

  energySkateParkBasics.register( 'Skater', Skater );

  return inherit( PropertySet, Skater, {

    // Get the vector from feet to head, so that when tracks are joined we can make sure he is still pointing up
    get upVector() { return this.headPosition.minus( this.position ); },

    clearThermal: function() {
      this.thermalEnergy = 0.0;
      this.updateEnergy();
    },

    reset: function() {
      // set the angle to zero before calling PropertySet.prototype.reset so that the optimization for
      // SkaterNode.updatePosition is maintained, without showing the skater at the wrong angle
      this.angle = 0;
      PropertySet.prototype.reset.call( this );
      this.updateEnergy();

      // Notify the graphics to re-render.  See #223
      this.trigger( 'updated' );
    },

    // Move the skater to her initial position, but leave the friction and mass the same, see #237
    resetPosition: function() {
      // set the angle to zero before calling PropertySet.prototype.reset so that the optimization for
      // SkaterNode.updatePosition is maintained, without showing the skater at the wrong angle
      this.angle = 0;
      var mass = this.mass;
      PropertySet.prototype.reset.call( this );
      this.mass = mass;
      this.updateEnergy();

      // Notify the graphics to re-render.  See #223
      this.trigger( 'updated' );
    },

    // When the scene (track) is changed, the skater's position & velocity reset, but the mass and other properties
    // do not reset, see #179
    returnToInitialPosition: function() {

      // Everything needs to be reset except the mass, see #188
      var mass = this.mass;
      this.reset();
      this.mass = mass;
    },

    // Return the skater to the last location it was released by the user (or its starting location)
    // Including the position on a track (if any)
    returnSkater: function() {

      // If the user is on the same track as where he began (and the track hasn't changed), remain on the track,
      // see #143 and #144
      if ( this.startingTrack && this.track === this.startingTrack && arrayEquals( this.track.copyControlPointSources(), this.startingTrackControlPointSources ) ) {
        this.u = this.startingU;
        this.angle = this.startingAngle;
        this.up = this.startingUp;
        this.uD = 0;
      }
      else {
        this.track = null;
        this.angle = this.startingAngle;
      }
      this.positionProperty.set( this.startingPosition.copy() );
      this.velocity = new Vector2( 0, 0 );
      this.clearThermal();
      this.updateEnergy();
      this.trigger( 'updated' );
    },

    // Update the energies as a batch.  This is an explicit method instead of linked to all dependencies so that it can
    // be called in a controlled fashion when multiple dependencies have changed, for performance.
    updateEnergy: function() {
      this.kineticEnergy = 0.5 * this.mass * this.velocity.magnitudeSquared();
      this.potentialEnergy = -this.mass * this.position.y * this.gravity;
      this.totalEnergy = this.kineticEnergy + this.potentialEnergy + this.thermalEnergy;

      // Signal that energies have changed for coarse-grained listeners like PieChartNode that should not get updated
      // 3-4 times per times step
      this.trigger( 'energy-changed' );
    },

    // Update the head position for showing the pie chart.
    // Doesn't depend on "up" because it already depends on the angle of the skater.
    // Would be better if headPosition were a derived property, but created too many allocations, see #50
    updateHeadPosition: function() {

      // Center pie chart over skater's head not his feet so it doesn't look awkward when skating in a parabola
      // Note this has been tuned independently of SkaterNode.massToScale, which also accounts for the image dimensions
      var skaterHeight = Util.linear( Constants.MIN_MASS, Constants.MAX_MASS, 1.65, 2.4, this.mass );

      var vectorX = skaterHeight * Math.cos( this.angle - Math.PI / 2 );
      var vectorY = skaterHeight * Math.sin( this.angle - Math.PI / 2 );

      // Manually trigger notifications to avoid allocations, see #50
      this.headPosition.x = this.position.x + vectorX;
      this.headPosition.y = this.position.y - vectorY;
      this.headPositionProperty.notifyObserversStatic();
    },

    /**
     * If the skater is released, store the initial conditions for when the skater is returned.
     * @param targetTrack The track to start on (if any)
     * @param targetU The parametric location along the track to start on (if any)
     */
    released: function( targetTrack, targetU ) {
      this.dragging = false;
      this.velocity = new Vector2( 0, 0 );
      this.uD = 0;
      this.track = targetTrack;
      this.u = targetU;
      if ( targetTrack ) {
        this.position = targetTrack.getPoint( this.u );
      }
      this.startingPosition = this.position.copy();
      this.startingU = targetU;
      this.startingUp = this.up;
      this.startingTrack = targetTrack;

      // Record the starting track control points to make sure the track hasn't changed during return this.
      this.startingTrackControlPointSources = targetTrack ? targetTrack.copyControlPointSources() : [];
      this.startingAngle = this.angle;

      // Update the energy on skater release so it won't try to move to a different height to make up for the delta
      this.updateEnergy();
      this.trigger( 'updated' );
      this.trigger( 'released' );
    }
  } );
} );