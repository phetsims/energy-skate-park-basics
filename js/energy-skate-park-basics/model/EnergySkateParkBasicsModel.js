// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model for the Energy Skate Park: Basics sim, including model values for the view settings, such as whether the grid
 * is visible. All units are in mks.
 *
 * The step functions focus on making computations up front and applying changes to the skater at the end of each
 * method, to simplify the logic and make it communicate with the Axon+View as little as possible (for performance
 * reasons).
 *
 * For an analytical model, see http://digitalcommons.calpoly.edu/cgi/viewcontent.cgi?article=1387&context=phy_fac
 * Computational problems in introductory physics: Lessons from a bead on a wire
 * Thomas J. Bensky and Matthew J. Moelter
 *
 * We experimented with the analytical model, but ran into problems with discontinuous tracks, see #15, so reverted to
 * using the euclidean model from the original Java version.
 *
 * Please note: Many modifications were made to this file to reduce allocations and garbage collections on iPad,
 * see #50.  The main changes were: Using pooling,
 * pass by reference, and component-wise math. Unfortunately, these are often compromises in the
 * readability/maintainability of the code, but they seemed important to attain good performance.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Emitter = require( 'AXON/Emitter' );
  var Skater = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/Skater' );
  var DebugTracks = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/DebugTracks' );
  var Track = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/Track' );
  var ControlPoint = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/ControlPoint' );
  var Vector2 = require( 'DOT/Vector2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var SkaterState = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/SkaterState' );
  var Util = require( 'DOT/Util' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var EnergySkateParkBasicsQueryParameters = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsQueryParameters' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );
  var TBounds2 = require( 'DOT/TBounds2' );
  var TEnergySkateParkBasicsModel = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/TEnergySkateParkBasicsModel' );
  var TTrack = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/TTrack' );

  // Reuse empty object for creating SkaterStates to avoid allocations
  var EMPTY_OBJECT = {};

  // Thrust is not currently implemented in Energy Skate Park: Basics but may be used in a future version, so left here
  var thrust = new Vector2();

  /**
   * Determine if two numbers are within tolerance of each other
   * @param {number} a
   * @param {number} b
   * @param {number} tolerance
   * @returns {boolean}
   */
  function isApproxEqual( a, b, tolerance ) { return Math.abs( a - b ) <= tolerance; }

  // Flag to enable debugging for physics issues
  var debug = EnergySkateParkBasicsQueryParameters.debugLog ? function() {
    console.log.apply( console, arguments );
  } : null;
  var debugAttachDetach = EnergySkateParkBasicsQueryParameters.debugAttachDetach ? function() {
    console.log.apply( console, arguments );
  } : null;

  // Control points are replenished in the toolbox as they are destroyed (by connecting) in the play area
  // This is the maximum number of control points available to the user.
  var MAX_NUMBER_CONTROL_POINTS = 15;

  // Track the model iterations to implement "slow motion" by stepping every Nth frame, see #210
  var modelIterations = 0;

  /**
   * Main constructor for the EnergySkateParkBasicsModel
   *
   * @param {boolean} draggableTracks True in screen 3 where the user can drag the tracks
   * @param {boolean} frictionAllowed True if this is screen 2-3, where friction is allowed to be on or off
   * @param {Tandem} tandem
   * @constructor
   */
  function EnergySkateParkBasicsModel( draggableTracks, frictionAllowed, tandem ) {

    this.draggableTracks = draggableTracks;
    this.frictionAllowed = frictionAllowed;

    var self = this;

    var controlPointGroupTandem = tandem.createGroupTandem( 'controlPoint' );
    var trackGroupTandem = tandem.createGroupTandem( 'track' );

    // @private
    this.controlPointGroupTandem = controlPointGroupTandem;
    this.trackGroupTandem = trackGroupTandem;

    // Temporary flag that keeps track of whether the track was changed in the step before the physics update.
    // true if the skater's track is being dragged by the user, so that energy conservation no longer applies.
    // Only applies to one frame at a time (for the immediate next update).  See #127 and #135
    this.trackChangePending = false;

    // Model for visibility of various view parameters
    this.pieChartVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'pieChartVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.barGraphVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'barGraphVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.gridVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'gridVisibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.speedometerVisibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'speedometerVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    // Enabled/disabled for the track editing buttons
    this.editButtonEnabledProperty = new Property( false, {
      tandem: tandem.createTandem( 'editButtonEnabledProperty' ),
      phetioValueType: TBoolean
    } );
    this.clearButtonEnabledProperty = new Property( false, {
      tandem: tandem.createTandem( 'clearButtonEnabledProperty' ),
      phetioValueType: TBoolean
    } );

    // Whether the sim is paused or running
    this.pausedProperty = new Property( false, {
      tandem: tandem.createTandem( 'pausedProperty' ),
      phetioValueType: TBoolean
    } );

    // speed of the model, either 'normal' or 'slow'
    this.speedProperty = new Property( 'normal', {
      tandem: tandem.createTandem( 'speedProperty' ),
      phetioValueType: TString
    } );

    // Coefficient of friction (unitless) between skater and track
    this.frictionProperty = new Property( frictionAllowed ? 0.05 : 0, {
      tandem: tandem.createTandem( 'frictionProperty' ),
      phetioValueType: TNumber()
    } );

    // Whether the skater should stick to the track like a roller coaster, or be able to fly off like a street
    this.detachableProperty = new Property( false, {
      tandem: tandem.createTandem( 'detachableProperty' ),
      phetioValueType: TBoolean
    } );

    // Will be filled in by the view, used to prevent control points from moving outside the visible model bounds when
    // adjusted, see #195
    this.availableModelBoundsProperty = new Property( new Bounds2( 0, 0, 0, 0 ), {
      tandem: tandem.createTandem( 'availableModelBoundsProperty' ),
      phetioValueType: TBounds2
    } );

    Property.preventGetSet( this, 'pieChartVisible' );
    Property.preventGetSet( this, 'barGraphVisible' );
    Property.preventGetSet( this, 'gridVisible' );
    Property.preventGetSet( this, 'speedometerVisible' );
    Property.preventGetSet( this, 'editButtonEnabled' );
    Property.preventGetSet( this, 'clearButtonEnabled' );
    Property.preventGetSet( this, 'paused' );
    Property.preventGetSet( this, 'speed' );
    Property.preventGetSet( this, 'friction' );
    Property.preventGetSet( this, 'detachable' );
    Property.preventGetSet( this, 'availableModelBounds' );

    if ( EnergySkateParkBasicsQueryParameters.debugTrack ) {
      this.frictionProperty.debug( 'friction' );
    }

    // elapsed time in the sim, in seconds.
    this.time = 0;

    // the skater model instance
    this.skater = new Skater( tandem.createTandem( 'skater' ) );

    // If the mass changes while the sim is paused, trigger an update so the skater image size will update, see #115
    this.skater.massProperty.link( function() { if ( self.pausedProperty.value ) { self.skater.updatedEmitter.emit(); } } );

    this.tracks = new ObservableArray( {
      phetioValueType: TTrack,
      tandem: tandem.createTandem( 'tracks' )
    } );

    // When tracks are removed, they are no longer used by the application and should be disposed
    this.tracks.addItemRemovedListener( function( track ) {
      track.dispose();
    } );

    // Proxy for save/load for the tracks for phetio.js
    // TODO: This is all a bit hackish, to serialize the tracks.  Cannot this be made simpler?
    if ( draggableTracks ) {
      //phetio && phetio.addInstance( 'playgroundScreen.tracks', {
      //  phetioID: 'playgroundScreen.tracks',
      //
      //  // TODO: use get value instead of this function.
      //  getArray: function() {
      //  },
      //
      //  get value() {
      //    return this.getArray();
      //  },
      //
      //  // TODO: set value asymmetric from getArray
      //  set value( arrayOfArrayOfVector ) {

      //  }
      //} );
    }

    // Determine when to show/hide the track edit buttons (cut track or delete control point)
    var updateTrackEditingButtonProperties = function() {
      var editEnabled = false;
      var clearEnabled = false;
      var physicalTracks = self.getPhysicalTracks();
      for ( var i = 0; i < physicalTracks.length; i++ ) {
        clearEnabled = true;
        var physicalTrack = physicalTracks[ i ];
        if ( physicalTrack.controlPoints.length >= 3 ) {
          editEnabled = true;
        }
      }
      self.editButtonEnabledProperty.value = editEnabled;
      self.clearButtonEnabledProperty.value = clearEnabled;
    };
    this.tracks.addItemAddedListener( updateTrackEditingButtonProperties );
    this.tracks.addItemRemovedListener( updateTrackEditingButtonProperties );
    this.trackChangedEmitter = new Emitter();
    this.updateEmitter = new Emitter();
    this.trackChangedEmitter.addListener( updateTrackEditingButtonProperties );

    if ( !draggableTracks ) {

      // For screens 1-2, the index of the selected scene (and track) within the screen
      this.sceneProperty = new Property( 0, {
        tandem: tandem.createTandem( 'sceneProperty' ),
        phetioValueType: TNumber( { values: [ 0, 1, 2 ] } ) // TODO: automatically get the number of tracks
      } );

      // Shape types
      // For the double well, move the left well up a bit since the interpolation moves it down by that much, and we
      // don't want the skater to go to y<0 while on the track.  Numbers determined by trial and error.
      var parabola = [
        new ControlPoint( -4, 6, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( 0, 0, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( 4, 6, controlPointGroupTandem.createNextTandem() )
      ];
      var slope = [
        new ControlPoint( -4, 6, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( -2, 1.2, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( 2, 0, controlPointGroupTandem.createNextTandem() )
      ];
      var doubleWell = [
        new ControlPoint( -4, 5, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( -2, 0.0166015, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( 0, 2, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( 2, 1, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( 4, 5, controlPointGroupTandem.createNextTandem() )
      ];

      var parabolaTrack = new Track( this, this.tracks, parabola, false, null, this.availableModelBoundsProperty,
        tandem.createTandem( 'parabolaTrack' ) );
      var slopeTrack = new Track( this, this.tracks, slope, false, null, this.availableModelBoundsProperty,
        tandem.createTandem( 'slopeTrack' ) );
      var doubleWellTrack = new Track( this, this.tracks, doubleWell, false, null, this.availableModelBoundsProperty,
        tandem.createTandem( 'doubleWellTrack' ) );

      // Flag to indicate whether the skater transitions from the right edge of this track directly to the ground
      // see #164
      slopeTrack.slopeToGround = true;

      this.tracks.addAll( [ parabolaTrack, slopeTrack, doubleWellTrack ] );

      // When the scene changes, also change the tracks.
      this.sceneProperty.link( function( scene ) {
        for ( var i = 0; i < self.tracks.length; i++ ) {
          self.tracks.get( i ).physicalProperty.value = (i === scene);

          // Reset the skater when the track is changed, see #179
          self.skater.returnToInitialPosition();
        }

        // The skater should detach from track when the scene changes.  Code elsewhere also resets the location of the skater.
        self.skater.trackProperty.value = null;
      } );
    }
    else {
      this.addDraggableTracks();
    }

    if ( EnergySkateParkBasicsQueryParameters.debugTrack ) {
      DebugTracks.init( this, tandem.createGroupTandem( 'debugTrackControlPoint' ), tandem.createGroupTandem( 'track' ) );
    }

    tandem.addInstance( this, TEnergySkateParkBasicsModel );
  }

  energySkateParkBasics.register( 'EnergySkateParkBasicsModel', EnergySkateParkBasicsModel );

  return inherit( Object, EnergySkateParkBasicsModel, {

    // Add the tracks that will be in the track toolbox for the "Playground" screen
    addDraggableTracks: function() {

      // 3 points per track
      for ( var i = 0; i < MAX_NUMBER_CONTROL_POINTS / 3; i++ ) {
        this.addDraggableTrack();
      }
    },

    // Add a single track to the track control panel.
    addDraggableTrack: function() {

      var controlPointGroupTandem = this.controlPointGroupTandem;
      var trackGroupTandem = this.trackGroupTandem;

      // Move the tracks over so they will be in the right position in the view coordinates, under the grass to the left
      // of the clock controls.  Could use view transform for this, but it would require creating the view first, so just
      // eyeballing it for now.
      var offset = new Vector2( -5.1, -0.85 );
      var controlPoints = [
        new ControlPoint( offset.x - 1, offset.y, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( offset.x, offset.y, controlPointGroupTandem.createNextTandem() ),
        new ControlPoint( offset.x + 1, offset.y, controlPointGroupTandem.createNextTandem() )
      ];
      this.tracks.add( new Track( this, this.tracks, controlPoints, true, null, this.availableModelBoundsProperty,
        trackGroupTandem.createNextTandem() ) );
    },

    // Reset the model, including the skater, tracks, visualizations, etc.
    reset: function() {
      var availableModelBounds = this.availableModelBoundsProperty.value;
      this.pieChartVisibleProperty.reset();
      this.barGraphVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.speedometerVisibleProperty.reset();
      this.editButtonEnabledProperty.reset();
      this.clearButtonEnabledProperty.reset();
      this.pausedProperty.reset();
      this.speedProperty.reset();
      this.frictionProperty.reset();
      this.detachableProperty.reset();
      this.availableModelBoundsProperty.reset();
      this.availableModelBoundsProperty.value = availableModelBounds;
      this.skater.reset();

      this.clearTracks();
    },

    clearTracks: function() {

      // For the first two screens, make the default track physical
      if ( this.draggableTracks ) {
        this.tracks.forEach( function( track ) {
          track.disposeControlPoints();
        } );
        this.tracks.clear();
        this.addDraggableTracks();

        // If the skater was on a track, then he should fall off, see #97
        if ( this.skater.trackProperty.value ) {
          this.skater.trackProperty.value = null;
        }
      }
    },

    // step one frame, assuming 60fps
    manualStep: function() {
      var skaterState = new SkaterState( this.skater, EMPTY_OBJECT );
      var dt = 1.0 / 60;
      var result = this.stepModel( dt, skaterState );
      result.setToSkater( this.skater );
      this.skater.updatedEmitter.emit();
    },

    // Step the model, automatically called from Joist
    step: function( dt ) {

      // This simulation uses a fixed time step to make the skater's motion reproducible.  Making the time step fixed
      // did not significantly reduce performance/speed on iPad3.
      dt = 1.0 / 60.0;

      var initialEnergy = null;

      // If the delay makes dt too high, then truncate it.  This helps e.g. when clicking in the address bar on ipad,
      // which gives a huge dt and problems for integration
      if ( !this.pausedProperty.value && !this.skater.draggingProperty.value ) {

        var initialThermalEnergy = this.skater.thermalEnergyProperty.value;

        // If they switched windows or tabs, just bail on that delta
        if ( dt > 1 || dt <= 0 ) {
          dt = 1.0 / 60.0;
        }

        var skaterState = new SkaterState( this.skater, EMPTY_OBJECT );
        if ( debug ) {
          initialEnergy = skaterState.getTotalEnergy();
        }

        // Update the skater state by running the dynamics engine
        // There are issues in running multiple iterations here (the skater won't attach to the track).  I presume some
        // of that work is being done in setToSkater() below or skater.trigger('updated')
        // In either case, 10 subdivisions on iPad3 makes the sim run too slowly, so we may just want to leave it as is
        var updatedState = null;
        modelIterations++;
        if ( this.speedProperty.value === 'normal' || modelIterations % 3 === 0 ) {
          updatedState = this.stepModel( dt, skaterState );
        }

        if ( debug && Math.abs( updatedState.getTotalEnergy() - initialEnergy ) > 1E-6 ) {
          var initialStateCopy = new SkaterState( this.skater, EMPTY_OBJECT );
          var redo = this.stepModel( this.speedProperty.value === 'normal' ? dt : dt * 0.25, initialStateCopy );
          debug && debug( redo );
        }
        if ( updatedState ) {
          updatedState.setToSkater( this.skater );
          this.skater.updatedEmitter.emit();

          // Make sure the thermal energy doesn't go negative
          var finalThermalEnergy = this.skater.thermalEnergyProperty.value;
          var deltaThermalEnergy = finalThermalEnergy - initialThermalEnergy;
          if ( deltaThermalEnergy < 0 ) {
            debug && debug( 'thermal energy wanted to decrease' );
          }
        }
      }

      // Clear the track change pending flag for the next step
      this.trackChangePending = false;

      // If traveling on the ground, face in the direction of motion, see #181
      if ( this.skater.trackProperty.value === null && this.skater.positionProperty.value.y === 0 ) {
        if ( this.skater.velocityProperty.value.x > 0 ) {
          this.skater.directionProperty.value = 'right';
        }
        if ( this.skater.velocityProperty.value.x < 0 ) {
          this.skater.directionProperty.value = 'left';
        }
        else {
          // skater wasn't moving, so don't change directions
        }
      }
    },

    // The skater moves along the ground with the same coefficient of fraction as the tracks, see #11
    stepGround: function( dt, skaterState ) {
      var x0 = skaterState.positionX;
      var frictionMagnitude = (this.frictionProperty.value === 0 || skaterState.getSpeed() < 1E-2) ? 0 :
                              this.frictionProperty.value * skaterState.mass * skaterState.gravity;
      var acceleration = Math.abs( frictionMagnitude ) * (skaterState.velocityX > 0 ? -1 : 1) / skaterState.mass;

      var v1 = skaterState.velocityX + acceleration * dt;

      // Exponentially decay the velocity if already nearly zero, see #138
      if ( this.frictionProperty.value !== 0 && skaterState.getSpeed() < 1E-2 ) {
        v1 = v1 / 2;
      }
      var x1 = x0 + v1 * dt;
      var newPosition = new Vector2( x1, 0 );
      var originalEnergy = skaterState.getTotalEnergy();

      var updated = skaterState.updatePositionAngleUpVelocity( newPosition.x, newPosition.y, 0, true, v1, 0 );

      var newEnergy = updated.getTotalEnergy();
      return updated.updateThermalEnergy( updated.thermalEnergy + (originalEnergy - newEnergy) );
    },

    // No bouncing on the ground, but the code is very similar to attachment part of interactWithTracksWhileFalling
    switchToGround: function( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt ) {
      var segment = new Vector2( 1, 0 );

      var newSpeed = segment.dot( proposedVelocity );

      // Make sure energy perfectly conserved when falling to the ground.
      var newKineticEnergy = 0.5 * newSpeed * newSpeed * skaterState.mass;
      var newPotentialEnergy = 0;
      var newThermalEnergy = initialEnergy - newKineticEnergy - newPotentialEnergy;

      if ( !isFinite( newThermalEnergy ) ) { throw new Error( 'not finite' ); }
      return skaterState.switchToGround( newThermalEnergy, newSpeed, 0, proposedPosition.x, proposedPosition.y );
    },

    /**
     * Update the skater in free fall
     * @param {number} dt the time that passed, in seconds
     * @param {SkaterState} skaterState the original state of the skater
     * @param {boolean} justLeft true if the skater just fell off or launched off the track: in this case it should not
     * interact with the track.
     * @returns {SkaterState} the new state
     */
    stepFreeFall: function( dt, skaterState, justLeft ) {
      var initialEnergy = skaterState.getTotalEnergy();

      var acceleration = new Vector2( 0, skaterState.gravity );
      var proposedVelocity = skaterState.getVelocity().plus( acceleration.times( dt ) );
      var position = skaterState.getPosition();
      var proposedPosition = position.plus( proposedVelocity.times( dt ) );
      if ( proposedPosition.y < 0 ) {
        proposedPosition.y = 0;

        return this.switchToGround( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt );
      }
      else if ( position.x !== proposedPosition.x || position.y !== proposedPosition.y ) {

        // see if it crossed the track
        var physicalTracks = this.getPhysicalTracks();

        // Don't interact with the track if the skater just left the track in this same frame, see #142
        if ( physicalTracks.length && !justLeft ) {
          return this.interactWithTracksWhileFalling( physicalTracks, skaterState, proposedPosition, initialEnergy, dt, proposedVelocity );
        }
        else {
          return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt );
        }
      }
      else {
        return skaterState;
      }
    },

    // Find the closest track to the skater, to see what he can bounce off of or attach to, and return the closest point
    // on that track took
    getClosestTrackAndPositionAndParameter: function( position, physicalTracks ) {
      var closestTrack = null;
      var closestMatch = null;
      var closestDistance = Number.POSITIVE_INFINITY;
      for ( var i = 0; i < physicalTracks.length; i++ ) {
        var track = physicalTracks[ i ];

        // PERFORMANCE/ALLOCATION maybe get closest point shouldn't return a new object allocation each time, or use
        // pooling for it, or pass in reference as an arg?
        var bestMatch = track.getClosestPositionAndParameter( position );
        if ( bestMatch.distance < closestDistance ) {
          closestDistance = bestMatch.distance;
          closestTrack = track;
          closestMatch = bestMatch;
        }
      }
      if ( closestTrack ) {
        return { track: closestTrack, parametricPosition: closestMatch.parametricPosition, point: closestMatch.point };
      }
      else {
        return null;
      }
    },

    // Check to see if the points crossed the track
    crossedTrack: function( closestTrackAndPositionAndParameter, physicalTracks, beforeX, beforeY, afterX, afterY ) {
      var track = closestTrackAndPositionAndParameter.track;
      var parametricPosition = closestTrackAndPositionAndParameter.parametricPosition;
      var trackPoint = closestTrackAndPositionAndParameter.point;

      if ( !track.isParameterInBounds( parametricPosition ) ) {
        return false;
      }
      else {

        // Linearize the spline, and check to see if the skater crossed by performing a line segment intersection between
        // the skater's trajectory segment and the linearized track segment.
        // Note, this has an error for cusps, see #212
        var unitParallelVector = track.getUnitParallelVector( parametricPosition );
        var a = trackPoint.plus( unitParallelVector.times( 100 ) );
        var b = trackPoint.plus( unitParallelVector.times( -100 ) );
        var intersection = Util.lineSegmentIntersection( a.x, a.y, b.x, b.y, beforeX, beforeY, afterX, afterY );
        return intersection !== null;
      }
    },

    // Check to see if it should hit or attach to track during free fall
    interactWithTracksWhileFalling: function( physicalTracks, skaterState, proposedPosition, initialEnergy, dt, proposedVelocity ) {

      // Find the closest track, and see if the skater would cross it in this time step.
      // Assuming the skater's initial + final locations determine a line segment, we search for the best point for the
      // skater's start point, midpoint and end point and choose whichever is closest.  This helps avoid "high curvature"
      // problems like the one identified in #212
      var a = this.getClosestTrackAndPositionAndParameter( skaterState.getPosition(), physicalTracks );
      var averagePosition = new Vector2( (skaterState.positionX + proposedPosition.x) / 2, (skaterState.positionY + proposedPosition.y) / 2 );
      var b = this.getClosestTrackAndPositionAndParameter( averagePosition, physicalTracks );
      var c = this.getClosestTrackAndPositionAndParameter( new Vector2( proposedPosition.x, proposedPosition.y ), physicalTracks );

      var initialPosition = skaterState.getPosition();
      var distanceA = Util.distToSegment( a.point, initialPosition, proposedPosition );
      var distanceB = Util.distToSegment( b.point, initialPosition, proposedPosition );
      var distanceC = Util.distToSegment( c.point, initialPosition, proposedPosition );

      var distances = [ distanceA, distanceB, distanceC ];
      var minDistance = _.min( distances );

      var closestTrackAndPositionAndParameter = minDistance === distanceA ? a : minDistance === distanceC ? c : b;

      debugAttachDetach && debugAttachDetach( 'minDistance', distances.indexOf( minDistance ) );

      var crossed = this.crossedTrack( closestTrackAndPositionAndParameter, physicalTracks,
        skaterState.positionX, skaterState.positionY, proposedPosition.x, proposedPosition.y );

      var track = closestTrackAndPositionAndParameter.track;
      var parametricPosition = closestTrackAndPositionAndParameter.parametricPosition;
      var trackPoint = closestTrackAndPositionAndParameter.point;

      if ( crossed ) {
        debugAttachDetach && debugAttachDetach( 'attaching' );
        var normal = track.getUnitNormalVector( parametricPosition );
        var segment = normal.perpendicular();

        var beforeVector = skaterState.getPosition().minus( trackPoint );

        // If crossed the track, attach to it.
        var newVelocity = segment.times( segment.dot( proposedVelocity ) );
        var newSpeed = newVelocity.magnitude();
        var newKineticEnergy = 0.5 * skaterState.mass * newVelocity.magnitudeSquared();
        var newPosition = track.getPoint( parametricPosition );
        var newPotentialEnergy = -skaterState.mass * skaterState.gravity * newPosition.y;
        var newThermalEnergy = initialEnergy - newKineticEnergy - newPotentialEnergy;

        // Sometimes (depending on dt) the thermal energy can go negative by the above calculation, see #141
        // In that case, set the thermal energy to zero and reduce the speed to compensate.
        if ( newThermalEnergy < skaterState.thermalEnergy ) {
          newThermalEnergy = skaterState.thermalEnergy;
          newKineticEnergy = initialEnergy - newPotentialEnergy - newThermalEnergy;

          assert && assert( newKineticEnergy >= 0 );
          if ( newKineticEnergy < 0 ) {
            newKineticEnergy = 0;
          }

          // ke = 1/2 m v v
          newSpeed = Math.sqrt( 2 * newKineticEnergy / skaterState.mass );
          newVelocity = segment.times( newSpeed );
        }

        var dot = proposedVelocity.normalized().dot( segment );

        // Sanity test
        assert && assert( isFinite( dot ) );
        assert && assert( isFinite( newVelocity.x ) );
        assert && assert( isFinite( newVelocity.y ) );
        assert && assert( isFinite( newThermalEnergy ) );
        assert && assert( newThermalEnergy >= 0 );

        var parametricSpeed = (dot > 0 ? +1 : -1) * newSpeed;
        var onTopSideOfTrack = beforeVector.dot( normal ) > 0;

        debug && debug( 'attach to track, ' + ', ' + parametricPosition + ', ' + track.maxPoint );

        // Double check the velocities and invert parametricSpeed if incorrect, see #172
        // Compute the new velocities same as in stepTrack
        var unitParallelVector = track.getUnitParallelVector( parametricPosition );
        var newVelocityX = unitParallelVector.x * parametricSpeed;
        var newVelocityY = unitParallelVector.y * parametricSpeed;

        var velocityDotted = skaterState.velocityX * newVelocityX + skaterState.velocityY * newVelocityY;

        // See if the track attachment will cause velocity to flip, and inverse it if so, see #172
        if ( velocityDotted < -1E-6 ) {
          parametricSpeed = parametricSpeed * -1;
        }

        return skaterState.attachToTrack( newThermalEnergy, track, onTopSideOfTrack, parametricPosition, parametricSpeed, newVelocity.x, newVelocity.y, newPosition.x, newPosition.y );
      }

      // It just continued in free fall
      else {
        return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt );
      }
    },

    // Started in free fall and did not interact with a track
    continueFreeFall: function( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt ) {

      // make up for the difference by changing the y value
      var y = (initialEnergy - 0.5 * skaterState.mass * proposedVelocity.magnitudeSquared() - skaterState.thermalEnergy) / (-1 * skaterState.mass * skaterState.gravity);
      if ( y <= 0 ) {
        // When falling straight down, stop completely and convert all energy to thermal
        return skaterState.strikeGround( initialEnergy, proposedPosition.x );
      }
      else {
        return skaterState.continueFreeFall( proposedVelocity.x, proposedVelocity.y, proposedPosition.x, y );
      }
    },

    /**
     * Gets the net force discluding normal force.
     *
     * Split into component-wise to prevent allocations, see #50
     *
     * @param {SkaterState} skaterState the state
     * @returns {number} netForce in the X direction
     */
    getNetForceWithoutNormalX: function( skaterState ) {
      return this.getFrictionForceX( skaterState );
    },

    /**
     * Gets the net force but without the normal force.
     *
     * Split into component-wise to prevent allocations, see #50
     *
     * @param {SkaterState} skaterState the state
     * @returns {number} netForce in the Y direction
     */
    getNetForceWithoutNormalY: function( skaterState ) {
      return skaterState.mass * skaterState.gravity + this.getFrictionForceY( skaterState );
    },

    // The only other force on the object in the direction of motion is the gravity force
    // Component-wise to reduce allocations, see #50
    getFrictionForceX: function( skaterState ) {
      // Friction force should not exceed sum of other forces (in the direction of motion), otherwise the friction could
      // start a stopped object moving. Hence we check to see if the object is already stopped and don't add friction
      // in that case
      if ( this.frictionProperty.value === 0 || skaterState.getSpeed() < 1E-2 ) {
        return 0;
      }
      else {
        var magnitude = this.frictionProperty.value * this.getNormalForce( skaterState ).magnitude();
        var angleComponent = Math.cos( skaterState.getVelocity().angle() + Math.PI );
        assert && assert( isFinite( magnitude ), 'magnitude should be finite' );
        assert && assert( isFinite( angleComponent ), 'angleComponent should be finite' );
        return magnitude * angleComponent;
      }
    },

    // The only other force on the object in the direction of motion is the gravity force
    // Component-wise to reduce allocations, see #50
    getFrictionForceY: function( skaterState ) {
      // Friction force should not exceed sum of other forces (in the direction of motion), otherwise the friction could
      // start a stopped object moving.  Hence we check to see if the object is already stopped and don't add friction in
      // that case
      if ( this.frictionProperty.value === 0 || skaterState.getSpeed() < 1E-2 ) {
        return 0;
      }
      else {
        var magnitude = this.frictionProperty.value * this.getNormalForce( skaterState ).magnitude();
        return magnitude * Math.sin( skaterState.getVelocity().angle() + Math.PI );
      }
    },

    // Use a separate pooled curvature variable
    curvatureTemp2: { r: 1, x: 0, y: 0 },

    // Get the normal force (Newtons) on the skater
    getNormalForce: function( skaterState ) {
      skaterState.getCurvature( this.curvatureTemp2 );
      var radiusOfCurvature = Math.min( this.curvatureTemp2.r, 100000 );
      var netForceRadial = new Vector2();

      netForceRadial.addXY( 0, skaterState.mass * skaterState.gravity );// gravity
      var curvatureDirection = this.getCurvatureDirection( this.curvatureTemp2, skaterState.positionX, skaterState.positionY );

      // On a flat surface, just use the radial component of the net force for the normal, see #344
      if ( isNaN( curvatureDirection.x ) || isNaN( curvatureDirection.y ) ) {
        curvatureDirection = netForceRadial.normalized(); // todo: sign?
      }
      var normalForce = skaterState.mass * skaterState.getSpeed() * skaterState.getSpeed() / Math.abs( radiusOfCurvature ) - netForceRadial.dot( curvatureDirection );
      debug && debug( normalForce );

      var n = Vector2.createPolar( normalForce, curvatureDirection.angle() );
      assert && assert( isFinite( n.x ), 'n.x should be finite' );
      assert && assert( isFinite( n.y ), 'n.y should be finite' );
      return n;
    },

    // Use an Euler integration step to move the skater along the track
    // This code is in an inner loop of the model physics and has been heavily optimized
    stepEuler: function( dt, skaterState ) {
      var track = skaterState.track;
      var origEnergy = skaterState.getTotalEnergy();
      var origLocX = skaterState.positionX;
      var origLocY = skaterState.positionY;
      var thermalEnergy = skaterState.thermalEnergy;
      var parametricSpeed = skaterState.parametricSpeed;
      assert && assert( isFinite( parametricSpeed ) );
      var parametricPosition = skaterState.parametricPosition;

      // Component-wise math to prevent allocations, see #50
      var netForceX = this.getNetForceWithoutNormalX( skaterState );
      var netForceY = this.getNetForceWithoutNormalY( skaterState );
      var netForceMagnitude = Math.sqrt( netForceX * netForceX + netForceY * netForceY );
      var netForceAngle = Math.atan2( netForceY, netForceX );

      // Get the net force in the direction of the track.  Dot product is a * b * cos(theta)
      var a = netForceMagnitude * Math.cos( skaterState.track.getModelAngleAt( parametricPosition ) - netForceAngle ) / skaterState.mass;

      parametricSpeed += a * dt;
      assert && assert( isFinite( parametricSpeed ), 'parametricSpeed should be finite' );
      parametricPosition += track.getParametricDistance( parametricPosition, parametricSpeed * dt + 1 / 2 * a * dt * dt );
      var newPointX = skaterState.track.getX( parametricPosition );
      var newPointY = skaterState.track.getY( parametricPosition );
      var unitParallelVector = skaterState.track.getUnitParallelVector( parametricPosition );
      var parallelUnitX = unitParallelVector.x;
      var parallelUnitY = unitParallelVector.y;
      var newVelocityX = parallelUnitX * parametricSpeed;
      var newVelocityY = parallelUnitY * parametricSpeed;

      // Exponentially decay the velocity if already nearly zero and on a flat slope, see #129
      if ( parallelUnitX / parallelUnitY > 5 && Math.sqrt( newVelocityX * newVelocityX + newVelocityY * newVelocityY ) < 1E-2 ) {
        newVelocityX /= 2;
        newVelocityY /= 2;
      }

      // choose velocity by using the unit parallel vector to the track
      var newState = skaterState.updateUUDVelocityPosition( parametricPosition, parametricSpeed, newVelocityX, newVelocityY, newPointX, newPointY );
      if ( this.frictionProperty.value > 0 ) {

        // Compute friction force magnitude component-wise to prevent allocations, see #50
        var frictionForceX = this.getFrictionForceX( skaterState );
        var frictionForceY = this.getFrictionForceY( skaterState );
        var frictionForceMagnitude = Math.sqrt( frictionForceX * frictionForceX + frictionForceY * frictionForceY );

        var newPoint = new Vector2( newPointX, newPointY );

        var therm = frictionForceMagnitude * newPoint.distanceXY( origLocX, origLocY );
        thermalEnergy += therm;

        var newTotalEnergy = newState.getTotalEnergy() + therm;

        // Conserve energy, but only if the user is not adding energy, see #135
        if ( thrust.magnitude() === 0 && !this.trackChangePending ) {
          if ( newTotalEnergy < origEnergy ) {
            thermalEnergy += Math.abs( newTotalEnergy - origEnergy );// add some thermal to exactly match
            if ( Math.abs( newTotalEnergy - origEnergy ) > 1E-6 ) {
              debug && debug( 'Added thermal, dE=' + ( newState.getTotalEnergy() - origEnergy ) );
            }
          }
          if ( newTotalEnergy > origEnergy ) {
            if ( Math.abs( newTotalEnergy - origEnergy ) < therm ) {
              debug && debug( 'gained energy, removing thermal (Would have to remove more than we gained)' );
            }
            else {
              thermalEnergy -= Math.abs( newTotalEnergy - origEnergy );
              if ( Math.abs( newTotalEnergy - origEnergy ) > 1E-6 ) {
                debug && debug( 'Removed thermal, dE=' + ( newTotalEnergy - origEnergy ) );
              }
            }
          }
        }

        // Discrepancy with original version: original version allowed drop of thermal energy here, to be fixed in the
        // heuristic patch. We have clamped it here to make it amenable to a smaller number of euler updates,
        // to improve performance
        return newState.updateThermalEnergy( Math.max( thermalEnergy, skaterState.thermalEnergy ) );
      }
      else {
        return newState;
      }
    },

    curvatureTemp: { r: 1, x: 0, y: 0 },

    // Update the skater as it moves along the track, and fly off the track if it goes over a jump or off the track's end
    stepTrack: function( dt, skaterState ) {

      skaterState.getCurvature( this.curvatureTemp );

      var curvatureDirectionX = this.getCurvatureDirectionX( this.curvatureTemp, skaterState.positionX, skaterState.positionY );
      var curvatureDirectionY = this.getCurvatureDirectionY( this.curvatureTemp, skaterState.positionX, skaterState.positionY );

      var track = skaterState.track;
      var sideVectorX = skaterState.onTopSideOfTrack ? track.getUnitNormalVector( skaterState.parametricPosition ).x :
                        track.getUnitNormalVector( skaterState.parametricPosition ).x * -1;
      var sideVectorY = skaterState.onTopSideOfTrack ? track.getUnitNormalVector( skaterState.parametricPosition ).y :
                        track.getUnitNormalVector( skaterState.parametricPosition ).y * -1;

      // Dot product written out component-wise to avoid allocations, see #50
      var outsideCircle = sideVectorX * curvatureDirectionX + sideVectorY * curvatureDirectionY < 0;

      // compare a to v/r^2 to see if it leaves the track
      var r = Math.abs( this.curvatureTemp.r );
      var centripetalForce = skaterState.mass * skaterState.parametricSpeed * skaterState.parametricSpeed / r;

      var netForceWithoutNormalX = this.getNetForceWithoutNormalX( skaterState );
      var netForceWithoutNormalY = this.getNetForceWithoutNormalY( skaterState );

      // Net force in the radial direction is the dot product.  Component-wise to avoid allocations, see #50
      var netForceRadial = netForceWithoutNormalX * curvatureDirectionX + netForceWithoutNormalY * curvatureDirectionY;

      var leaveTrack = (netForceRadial < centripetalForce && outsideCircle) || (netForceRadial > centripetalForce && !outsideCircle);

      if ( leaveTrack && this.detachableProperty.value ) {

        // Leave the track.  Make sure the velocity is pointing away from the track or keep track of frames away from the
        // track so it doesn't immediately recollide.  Or project a ray and see if a collision is imminent?
        var freeSkater = skaterState.leaveTrack();

        debugAttachDetach && debugAttachDetach( 'left middle track', freeSkater.velocityX, freeSkater.velocityY );

        var nudged = this.nudge( freeSkater, sideVectorX, sideVectorY, +1 );

        // Step after switching to free fall, so it doesn't look like it pauses
        return this.stepFreeFall( dt, nudged, true );
      }
      else {
        var newState = skaterState;

        // Turning this value to 5 or less causes thermal energy to decrease on some time steps
        // Discrepancy with original version: original version had 10 divisions here.  We have reduced it to make it more
        // smooth and less GC
        var numDivisions = 4;
        for ( var i = 0; i < numDivisions; i++ ) {
          newState = this.stepEuler( dt / numDivisions, newState );
        }

        // Correct energy
        var correctedState = this.correctEnergy( skaterState, newState );

        // Check whether the skater has left the track
        if ( skaterState.track.isParameterInBounds( correctedState.parametricPosition ) ) {
          return correctedState;
        }
        else {
          // Fly off the left or right side of the track
          // Off the edge of the track.  If the skater transitions from the right edge of the 2nd track directly to the
          // ground then do not lose thermal energy during the transition, see #164
          if ( correctedState.parametricPosition > skaterState.track.maxPoint && skaterState.track.slopeToGround ) {
            var result = correctedState.switchToGround( correctedState.thermalEnergy, correctedState.getSpeed(), 0, correctedState.positionX, 0 );

            // Correct the energy discrepancy when switching to the ground, see #301
            return this.correctEnergy( skaterState, result );
          }
          else {
            debugAttachDetach && debugAttachDetach( 'left edge track: ' + correctedState.parametricPosition + ', ' + skaterState.track.maxPoint );

            // There is a situation in which the `u` of the skater exceeds the track bounds before the
            // getClosestPositionAndParameter.parametricPosition does, which can cause the skater to immediately reattach
            // So make sure the skater is far enough from the track so it won't reattach right away, see #167
            var freeSkaterState = skaterState.updateTrackUD( null, 0 );

            var nudgedState = this.nudge( freeSkaterState, sideVectorX, sideVectorY, -1 );

            // Step after switching to free fall, so it doesn't look like it pauses
            return this.stepFreeFall( dt, nudgedState, true );
          }
        }
      }
    },

    // When the skater leaves the track, adjust the position and velocity.  This prevents the following problems:
    // 1. When leaving from the sides, adjust the skater under the track so it won't immediately re-collide
    // 2. When leaving from the middle of the track (say going over a jump or falling upside-down from a loop),
    // adjust the skater so it won't fall through or re-collide
    nudge: function( freeSkater, sideVectorX, sideVectorY, sign ) {

      // angle the velocity down a bit and underset from track so that it won't immediately re-collide
      // Nudge the velocity in the 'up' direction so the skater won't pass through the track, see #207
      var velocity = new Vector2( freeSkater.velocityX, freeSkater.velocityY );
      var upVector = new Vector2( sideVectorX, sideVectorY );
      if ( velocity.magnitude() > 0 ) {
        var blended = velocity.normalized().blend( upVector, 0.01 * sign );
        if ( blended.magnitude() > 0 ) {
          var revisedVelocity = blended.normalized().times( velocity.magnitude() );
          freeSkater = freeSkater.updateUDVelocity( 0, revisedVelocity.x, revisedVelocity.y );

          // Nudge the position away from the track, slightly since it was perfectly centered on the track, see #212
          // Note this will change the energy of the skater, but only by a tiny amount (that should be undetectable in the
          // bar chart)
          var origPosition = freeSkater.getPosition();
          var newPosition = origPosition.plus( upVector.times( sign * 1E-6 ) );
          freeSkater = freeSkater.updatePosition( newPosition.x, newPosition.y );

          debugAttachDetach && debugAttachDetach( 'newdot', revisedVelocity.dot( upVector ) );
          return freeSkater;
        }
      }
      return freeSkater;
    },

    // Try to match the target energy by reducing the velocity of the skaterState
    correctEnergyReduceVelocity: function( skaterState, targetState ) {

      // Make a clone we can mutate and return, to protect the input argument
      var newSkaterState = targetState.copy();
      var e0 = skaterState.getTotalEnergy();
      var mass = skaterState.mass;

      // Find the direction of velocity.  This is on the track unless the skater just left the "slope" track
      var unit = newSkaterState.track ? newSkaterState.track.getUnitParallelVector( newSkaterState.parametricPosition ) :
                 newSkaterState.getVelocity().normalized();

      // Binary search, but bail after too many iterations
      for ( var i = 0; i < 100; i++ ) {
        var dv = ( newSkaterState.getTotalEnergy() - e0 ) / ( mass * newSkaterState.parametricSpeed );

        var newVelocity = newSkaterState.parametricSpeed - dv;

        // We can just set the state directly instead of calling update since we are keeping a protected clone of the
        // newSkaterState
        newSkaterState.parametricSpeed = newVelocity;
        var result = unit.times( newVelocity );
        newSkaterState.velocityX = result.x;
        newSkaterState.velocityY = result.y;

        if ( isApproxEqual( e0, newSkaterState.getTotalEnergy(), 1E-8 ) ) {
          break;
        }
      }
      return newSkaterState;
    },

    // Binary search to find the parametric coordinate along the track that matches the e0 energy
    searchSplineForEnergy: function( skaterState, u0, u1, e0, numSteps ) {
      var da = ( u1 - u0 ) / numSteps;
      var bestAlpha = ( u1 - u0 ) / 2;
      var p = skaterState.track.getPoint( bestAlpha );
      var bestDE = skaterState.updatePosition( p.x, p.y ).getTotalEnergy();
      for ( var i = 0; i < numSteps; i++ ) {
        var proposedAlpha = u0 + da * i;
        var p2 = skaterState.track.getPoint( bestAlpha );
        var e = skaterState.updatePosition( p2.x, p2.y ).getTotalEnergy();
        if ( Math.abs( e - e0 ) <= Math.abs( bestDE ) ) {
          bestDE = e - e0;
          bestAlpha = proposedAlpha;
        }// continue to find best value closest to proposed u, even if several values give dE=0.0
      }
      debug && debug( 'After ' + numSteps + ' steps, origAlpha=' + u0 + ', bestAlpha=' + bestAlpha + ', dE=' + bestDE );
      return bestAlpha;
    },

    // A number of heuristic energy correction steps to ensure energy is conserved while keeping the motion smooth and
    // accurate.  Copied from the Java version directly (with a few different magic numbers)
    correctEnergy: function( skaterState, newState ) {
      if ( this.trackChangePending ) {
        return newState;
      }
      var u0 = skaterState.parametricPosition;
      var e0 = skaterState.getTotalEnergy();

      if ( !isFinite( newState.getTotalEnergy() ) ) { throw new Error( 'not finite' );}
      var dE = newState.getTotalEnergy() - e0;
      if ( Math.abs( dE ) < 1E-6 ) {
        // small enough
        return newState;
      }
      else {
        if ( newState.getTotalEnergy() > e0 ) {
          debug && debug( 'Energy too high' );

          // can we reduce the velocity enough?
          // amount we could reduce the energy if we deleted all the kinetic energy:
          if ( Math.abs( newState.getKineticEnergy() ) > Math.abs( dE ) ) {

            // This is the current rule for reducing the energy.  But in a future version maybe should only do this
            // if all velocity is not converted?
            debug && debug( 'Could fix all energy by changing velocity.' );
            var correctedStateA = this.correctEnergyReduceVelocity( skaterState, newState );
            debug && debug( 'changed velocity: dE=' + ( correctedStateA.getTotalEnergy() - e0 ) );
            if ( !isApproxEqual( e0, correctedStateA.getTotalEnergy(), 1E-8 ) ) {
              debug && debug( 'Energy error[0]' );
            }
            return correctedStateA;
          }
          else {
            debug && debug( 'Not enough KE to fix with velocity alone: normal:' );
            debug && debug( 'changed position u: dE=' + ( newState.getTotalEnergy() - e0 ) );
            // search for a place between u and u0 with a better energy

            var numRecursiveSearches = 10;
            var parametricPosition = newState.parametricPosition;
            var bestAlpha = ( parametricPosition + u0 ) / 2.0;
            var da = ( parametricPosition - u0 ) / 2;
            for ( var i = 0; i < numRecursiveSearches; i++ ) {
              var numSteps = 10;
              bestAlpha = this.searchSplineForEnergy( newState, bestAlpha - da, bestAlpha + da, e0, numSteps );
              da = ( ( bestAlpha - da ) - ( bestAlpha + da ) ) / numSteps;
            }

            var point = newState.track.getPoint( bestAlpha );
            var correctedState = newState.updateUPosition( bestAlpha, point.x, point.y );
            debug && debug( 'changed position u: dE=' + ( correctedState.getTotalEnergy() - e0 ) );
            if ( !isApproxEqual( e0, correctedState.getTotalEnergy(), 1E-8 ) ) {

              // amount we could reduce the energy if we deleted all the kinetic energy:
              if ( Math.abs( correctedState.getKineticEnergy() ) > Math.abs( dE ) ) {

                // TODO: maybe should only do this if all velocity is not converted
                debug && debug( 'Fixed position some, still need to fix velocity as well.' );
                var correctedState2 = this.correctEnergyReduceVelocity( skaterState, correctedState );
                if ( !isApproxEqual( e0, correctedState2.getTotalEnergy(), 1E-8 ) ) {
                  debug && debug( 'Changed position & Velocity and still had energy error' );
                  debug && debug( 'Energy error[123]' );
                }
                return correctedState2;
              }
              else {

                // TODO: This error case can still occur, especially with friction turned on
                debug && debug( 'Changed position, wanted to change velocity, but didn\'t have enough to fix it..., dE=' + ( newState.getTotalEnergy() - e0 ) );
              }
            }
            return correctedState;
          }
        }
        else {
          if ( !isFinite( newState.getTotalEnergy() ) ) { throw new Error( 'not finite' );}
          debug && debug( 'Energy too low' );

          // increasing the kinetic energy
          // Choose the exact velocity in the same direction as current velocity to ensure total energy conserved.
          var vSq = Math.abs( 2 / newState.mass * ( e0 - newState.getPotentialEnergy() - newState.thermalEnergy ) );
          var v = Math.sqrt( vSq );

          // TODO: What if parametricSpeed ===0?
          var newVelocity = v * (newState.parametricSpeed > 0 ? +1 : -1);
          var unitParallelVector = newState.track.getUnitParallelVector( newState.parametricPosition );
          var updatedVelocityX = unitParallelVector.x * newVelocity;
          var updatedVelocityY = unitParallelVector.y * newVelocity;
          var fixedState = newState.updateUDVelocity( newVelocity, updatedVelocityX, updatedVelocityY );
          debug && debug( 'Set velocity to match energy, when energy was low: ' );
          debug && debug( 'INC changed velocity: dE=' + ( fixedState.getTotalEnergy() - e0 ) );
          if ( !isApproxEqual( e0, fixedState.getTotalEnergy(), 1E-8 ) ) {
            new Error( 'Energy error[2]' ).printStackTrace();
          }
          return fixedState;
        }
      }
    },

    // PERFORMANCE/ALLOCATION
    getCurvatureDirection: function( curvature, x2, y2 ) {
      var v = new Vector2( curvature.x - x2, curvature.y - y2 );
      return v.x !== 0 || v.y !== 0 ? v.normalized() : v;
    },

    getCurvatureDirectionX: function( curvature, x2, y2 ) {
      var vx = curvature.x - x2;
      var vy = curvature.y - y2;
      return vx !== 0 || vy !== 0 ? vx / Math.sqrt( vx * vx + vy * vy ) : vx;
    },

    getCurvatureDirectionY: function( curvature, x2, y2 ) {
      var vx = curvature.x - x2;
      var vy = curvature.y - y2;
      return vx !== 0 || vy !== 0 ? vy / Math.sqrt( vx * vx + vy * vy ) : vy;
    },

    // Update the skater based on which state it is in
    stepModel: function( dt, skaterState ) {
      this.time += dt;

      return skaterState.dragging ? skaterState : // User is dragging the skater, nothing to update here
             !skaterState.track && skaterState.positionY <= 0 ? this.stepGround( dt, skaterState ) :
             !skaterState.track && skaterState.positionY > 0 ? this.stepFreeFall( dt, skaterState, false ) :
             skaterState.track ? this.stepTrack( dt, skaterState ) :
             skaterState;
    },

    // Return to the place he was last released by the user.  Also restores the track the skater was on so the initial
    // conditions are the same as the previous release
    returnSkater: function() {

      // if the skater's original track is available, restore her to it, see #143
      var originalTrackAvailable = _.includes( this.getPhysicalTracks(), this.skater.startingTrackProperty.value );
      if ( originalTrackAvailable ) {
        this.skater.trackProperty.value = this.skater.startingTrackProperty.value;
      }
      this.skater.returnSkater();
    },

    // Clear the thermal energy from the model
    clearThermal: function() { this.skater.clearThermal(); },

    // Get all of the tracks marked as physical (i.e. that the skater could interact with).
    getPhysicalTracks: function() {

      // Use vanilla instead of lodash for speed since this is in an inner loop
      var physicalTracks = [];
      for ( var i = 0; i < this.tracks.length; i++ ) {
        var track = this.tracks.get( i );

        if ( track.physicalProperty.value ) {
          physicalTracks.push( track );
        }
      }
      return physicalTracks;
    },

    getNonPhysicalTracks: function() {

      // Use vanilla instead of lodash for speed since this is in an inner loop
      var nonphysicalTracks = [];
      for ( var i = 0; i < this.tracks.length; i++ ) {
        var track = this.tracks.get( i );

        if ( !track.physicalProperty.value ) {
          nonphysicalTracks.push( track );
        }
      }
      return nonphysicalTracks;
    },

    // Find whatever track is connected to the specified track and join them together to a new track
    joinTracks: function( track ) {
      var connectedPoint = track.getSnapTarget();
      for ( var i = 0; i < this.getPhysicalTracks().length; i++ ) {
        var otherTrack = this.getPhysicalTracks()[ i ];
        if ( otherTrack.containsControlPoint( connectedPoint ) ) {
          this.joinTrackToTrack( track, otherTrack );
          break;
        }
      }

      // if the number of control points is low enough, replenish the toolbox
      if ( this.getNumberOfControlPoints() <= MAX_NUMBER_CONTROL_POINTS - 3 ) {
        this.addDraggableTrack();
      }
    },

    // The user has pressed the "delete" button for the specified track's specified control point, and it should be
    // deleted.
    // It should be an inner point of a track (not an end point)
    // If there were only 2 points on the track, just delete the entire track
    deleteControlPoint: function( track, controlPointIndex ) {

      track.removeEmitter.emit();
      this.tracks.remove( track );
      var trackGroupTandem = this.trackGroupTandem;

      if ( track.controlPoints.length > 2 ) {
        var controlPointToDelete = track.controlPoints[ controlPointIndex ];
        var points = _.without( track.controlPoints, controlPointToDelete );
        controlPointToDelete.dispose();
        var newTrack = new Track( this, this.tracks, points, true, track.getParentsOrSelf(), this.availableModelBoundsProperty,
          trackGroupTandem.createNextTandem() );
        newTrack.physicalProperty.value = true;
        newTrack.droppedProperty.value = true;

        // smooth out the new track, see #177
        var smoothingPoint = controlPointIndex >= newTrack.controlPoints.length ? newTrack.controlPoints.length - 1 : controlPointIndex;
        newTrack.smooth( smoothingPoint );

        // Make sure the new track doesn't go underground after a control point is deleted, see #174
        newTrack.bumpAboveGround();

        this.tracks.add( newTrack );
      }
      else {

        // the entire track is deleted, so we must dispose the other control points
        for ( var i = 0; i < track.controlPoints.length; i++ ) {
          var controlPoint = track.controlPoints[ i ];
          controlPoint.dispose();
        }
      }

      // Trigger track changed first to update the edit enabled properties
      this.trackChangedEmitter.emit();

      // If the skater was on track, then he should fall off
      if ( this.skater.trackProperty.value === track ) {
        this.skater.trackProperty.value = null;
      }

      // if the number of control points is low enough, replenish the toolbox
      if ( this.getNumberOfControlPoints() <= MAX_NUMBER_CONTROL_POINTS - 3 ) {
        this.addDraggableTrack();
      }
    },

    // The user has pressed the "delete" button for the specified track's specified control point, and it should be
    // deleted. It should be an inner point of a track (not an end point)
    splitControlPoint: function( track, controlPointIndex, modelAngle ) {
      var controlPointToSplit = track.controlPoints[ controlPointIndex ];

      var trackGroupTandem = this.trackGroupTandem;

      var vector = Vector2.createPolar( 0.5, modelAngle );
      var newPoint1 = new ControlPoint(
        track.controlPoints[ controlPointIndex ].sourcePositionProperty.value.x - vector.x,
        track.controlPoints[ controlPointIndex ].sourcePositionProperty.value.y - vector.y,
        this.controlPointGroupTandem.createNextTandem()
      );
      var newPoint2 = new ControlPoint(
        track.controlPoints[ controlPointIndex ].sourcePositionProperty.value.x + vector.x,
        track.controlPoints[ controlPointIndex ].sourcePositionProperty.value.y + vector.y,
        this.controlPointGroupTandem.createNextTandem()
      );

      var points1 = track.controlPoints.slice( 0, controlPointIndex );
      var points2 = track.controlPoints.slice( controlPointIndex + 1, track.controlPoints.length );

      points1.push( newPoint1 );
      points2.unshift( newPoint2 );

      var newTrack1 = new Track( this, this.tracks, points1, true, track.getParentsOrSelf(), this.availableModelBoundsProperty,
        trackGroupTandem.createNextTandem() );
      newTrack1.physicalProperty.value = true;
      newTrack1.droppedProperty.value = true;
      var newTrack2 = new Track( this, this.tracks, points2, true, track.getParentsOrSelf(), this.availableModelBoundsProperty,
        trackGroupTandem.createNextTandem() );
      newTrack2.physicalProperty.value = true;
      newTrack2.droppedProperty.value = true;

      track.removeEmitter.emit();
      this.tracks.remove( track );
      this.tracks.add( newTrack1 );
      this.tracks.add( newTrack2 );

      // Smooth the new tracks, see #177
      newTrack1.smooth( controlPointIndex - 1 );
      newTrack2.smooth( 0 );

      // Trigger track changed first to update the edit enabled properties
      this.trackChangedEmitter.emit();

      // If the skater was on track, then he should fall off, see #97
      if ( this.skater.trackProperty.value === track ) {
        this.skater.trackProperty.value = null;
      }

      // If a control point was split and that makes too many "live" control points total, remove a piece of track from
      // the toolbox to keep the total number of control points low enough.
      if ( this.getNumberOfControlPoints() > MAX_NUMBER_CONTROL_POINTS ) {
        // find a nonphysical track, then remove it

        var trackToRemove = this.getNonPhysicalTracks()[ 0 ];
        trackToRemove.removeEmitter.emit();
        this.tracks.remove( trackToRemove );
        trackToRemove.disposeControlPoints();
      }

      // Dispose the control point itself
      controlPointToSplit.dispose();
    },

    /**
     * Join the specified tracks together into a single new track and delete the old tracks.
     *
     * @param a {Track}
     * @param b {Track}
     */
    joinTrackToTrack: function( a, b ) {
      var points = [];
      var i;
      var controlPointGroupTandem = this.controlPointGroupTandem;
      var trackGroupTandem = this.trackGroupTandem;

      var firstTrackForward = function() {
        for ( i = 0; i < a.controlPoints.length; i++ ) {
          points.push( a.controlPoints[ i ].copy( controlPointGroupTandem.createNextTandem() ) );
        }
      };
      var firstTrackBackward = function() {
        for ( i = a.controlPoints.length - 1; i >= 0; i-- ) {
          points.push( a.controlPoints[ i ].copy( controlPointGroupTandem.createNextTandem() ) );
        }
      };
      var secondTrackForward = function() {
        for ( i = 1; i < b.controlPoints.length; i++ ) {
          points.push( b.controlPoints[ i ].copy( controlPointGroupTandem.createNextTandem() ) );
        }
      };
      var secondTrackBackward = function() {
        for ( i = b.controlPoints.length - 2; i >= 0; i-- ) {
          points.push( b.controlPoints[ i ].copy( controlPointGroupTandem.createNextTandem() ) );
        }
      };

      // Only include one copy of the snapped point
      // Forward Forward
      if ( a.controlPoints[ a.controlPoints.length - 1 ].snapTargetProperty.value === b.controlPoints[ 0 ] ) {
        firstTrackForward();
        secondTrackForward();
      }

      // Forward Backward
      else if ( a.controlPoints[ a.controlPoints.length - 1 ].snapTargetProperty.value === b.controlPoints[ b.controlPoints.length - 1 ] ) {
        firstTrackForward();
        secondTrackBackward();
      }

      // Backward Forward
      else if ( a.controlPoints[ 0 ].snapTargetProperty.value === b.controlPoints[ 0 ] ) {
        firstTrackBackward();
        secondTrackForward();
      }

      // Backward backward
      else if ( a.controlPoints[ 0 ].snapTargetProperty.value === b.controlPoints[ b.controlPoints.length - 1 ] ) {
        firstTrackBackward();
        secondTrackBackward();
      }

      var newTrack = new Track( this, this.tracks, points, true, a.getParentsOrSelf().concat( b.getParentsOrSelf() ), this.availableModelBoundsProperty,
        trackGroupTandem.createNextTandem() );
      newTrack.physicalProperty.value = true;
      newTrack.droppedProperty.value = true;

      a.disposeControlPoints();
      a.removeEmitter.emit();
      this.tracks.remove( a );

      b.disposeControlPoints();
      b.removeEmitter.emit();
      this.tracks.remove( b );

      // When tracks are joined, bump the new track above ground so the y value (and potential energy) cannot go negative,
      // and so it won't make the "return skater" button get bigger, see #158
      newTrack.bumpAboveGround();
      this.tracks.add( newTrack );

      // Move skater to new track if he was on the old track, by searching for the best fit point on the new track
      // Note: Energy is not conserved when tracks joined since the user has added or removed energy from the system
      if ( this.skater.trackProperty.value === a || this.skater.trackProperty.value === b ) {

        var originalDirectionVector = this.skater.trackProperty.value.getUnitParallelVector( this.skater.parametricPositionProperty.value ).times( this.skater.parametricSpeedProperty.value );

        // Keep track of the skater direction so we can toggle the 'up' flag if the track orientation changed
        var originalNormal = this.skater.upVector;
        var p = newTrack.getClosestPositionAndParameter( this.skater.positionProperty.value.copy() );
        this.skater.trackProperty.value = newTrack;
        this.skater.parametricPositionProperty.value = p.parametricPosition;
        var x2 = newTrack.getX( p.parametricPosition );
        var y2 = newTrack.getY( p.parametricPosition );
        this.skater.positionProperty.value = new Vector2( x2, y2 );
        this.skater.angleProperty.value = newTrack.getViewAngleAt( p.parametricPosition ) + (this.skater.onTopSideOfTrackProperty.value ? 0 : Math.PI);

        // Trigger an initial update now so we can get the right up vector, see #150
        this.skater.updatedEmitter.emit();
        var newNormal = this.skater.upVector;

        // If the skater flipped upside down because the track directionality is different, toggle his 'up' flag
        if ( originalNormal.dot( newNormal ) < 0 ) {
          this.skater.onTopSideOfTrackProperty.value = !this.skater.onTopSideOfTrackProperty.value;
          this.skater.angleProperty.value = newTrack.getViewAngleAt( p.parametricPosition ) + (this.skater.onTopSideOfTrackProperty.value ? 0 : Math.PI);
          this.skater.updatedEmitter.emit();
        }

        // If the skater changed direction of motion because of the track polarity change, flip the parametric velocity
        // 'parametricSpeed' value, see #180
        var newDirectionVector = this.skater.trackProperty.value.getUnitParallelVector( this.skater.parametricPositionProperty.value ).times( this.skater.parametricSpeedProperty.value );
        debugAttachDetach && debugAttachDetach( newDirectionVector.dot( originalDirectionVector ) );
        if ( newDirectionVector.dot( originalDirectionVector ) < 0 ) {
          this.skater.parametricSpeedProperty.value = -this.skater.parametricSpeedProperty.value;
        }
      }

      // When joining tracks, smooth out the new track, but without moving the point that joined the tracks, see #177 #238
      newTrack.smoothPointOfHighestCurvature( [] );
    },

    // When a track is dragged, update the skater's energy (if the sim was paused), since it wouldn't be handled in the
    // update loop.
    trackModified: function( track ) {
      if ( this.pausedProperty.value && this.skater.trackProperty.value === track ) {
        this.skater.updateEnergy();
      }

      // Flag the track as having changed *this frame* so energy doesn't need to be conserved during this frame, see #127
      this.trackChangePending = true;
    },

    // Get the number of physical control points (i.e. control points outside of the toolbox)
    getNumberOfPhysicalControlPoints: function() {
      var numberOfPointsInEachTrack = _.map( this.getPhysicalTracks(), function( track ) {return track.controlPoints.length;} );
      return _.reduce( numberOfPointsInEachTrack, function( memo, num ) { return memo + num; }, 0 );
    },

    getNumberOfControlPoints: function() {
      var numberOfPointsInEachTrack = _.map( this.tracks.getArray(), function( track ) {return track.controlPoints.length;} );
      return _.reduce( numberOfPointsInEachTrack, function( memo, num ) { return memo + num; }, 0 );
    },

    // Logic to determine whether a control point can be added by cutting a track's control point in two
    // This is feasible if the number of control points in the play area (above y>0) is less than the maximum
    canCutTrackControlPoint: function() {
      return this.getNumberOfPhysicalControlPoints() < MAX_NUMBER_CONTROL_POINTS;
    },

    // Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
    containsTrack: function( track ) {
      return this.tracks.contains( track );
    },

    /**
     * Called by phet-io to clear out the model state before restoring child tracks.
     * @public (phet-io)
     */
    removeAllTracks: function() {

      // TODO: should we leverage this.draggableTracks and only save the truly dynamic tracks?
      while ( this.tracks.length > 0 ) {
        var track = this.tracks.get( 0 );
        track.disposeControlPoints();
        this.tracks.remove( track );
      }
    },

    /**
     * Add a track, called by phet-io in setState (to restore a state).
     * TODO: this code should be called by EnergySkateParkBasicsModel too.
     * @param {Tandem} tandem
     * @param {boolean} interactive - whether the track can be dragged.
     * @param controlPointTandemIDs
     */
    addTrack: function( tandem, interactive, controlPointTandemIDs ) {

      assert && assert( controlPointTandemIDs, 'controlPointTandemIDs should exist' );
      // function Track( events, modelTracks, controlPoints, interactive, parents, availableModelBoundsProperty, tandem ) {
      var controlPoints = controlPointTandemIDs.map( function( id, index ) {
        return new ControlPoint( index, 0, new Tandem( id ) ); // TODO: create with correct initial x & y values.
      } );
      var newTrack = new Track( this, this.tracks, controlPoints, interactive, [], this.availableModelBoundsProperty, tandem );
      this.tracks.add( newTrack );
      return newTrack;
    },

  } );
} );