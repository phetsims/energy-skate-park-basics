// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the Energy Skate Park: Basics sim, including model values for the view settings, such as whether the grid is visible.
 * All units are in metric.
 *
 * The step functions focus on making computations up front and applying changes to the skater at the end of each method, to
 * simplify the logic and make it communicate with the Axon+View as little as possible (for performance reasons).
 *
 * For an analytical model, see http://digitalcommons.calpoly.edu/cgi/viewcontent.cgi?article=1387&context=phy_fac
 * Computational problems in introductory physics: Lessons from a bead on a wire
 * Thomas J. Bensky and Matthew J. Moelter
 *
 * We experimented with the analytical model, but ran into problems with discontinuous tracks, see https://github.com/phetsims/energy-skate-park-basics/issues/15
 * so reverted to using the euclidean model from the original Java version.
 *
 * Please note: Many modifications were made to this file to reduce allocations and garbage collections on iPad, see https://github.com/phetsims/energy-skate-park-basics/issues/50
 * The main changes were: Using pooling, pass by reference, and component-wise math.
 * Unfortunately, these are often compromises in the readability/maintainability of the code, but they seemed important to attain good performance.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Skater = require( 'ENERGY_SKATE_PARK_BASICS/model/Skater' );
  var Track = require( 'ENERGY_SKATE_PARK_BASICS/model/Track' );
  var ControlPoint = require( 'ENERGY_SKATE_PARK_BASICS/model/ControlPoint' );
  var Vector2 = require( 'DOT/Vector2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var SkaterState = require( 'ENERGY_SKATE_PARK_BASICS/model/SkaterState' );

  //Reuse empty object for creating SkaterStates to avoid allocations
  var EMPTY_OBJECT = {};

  //Thrust is not currently implemented in Energy Skate Park: Basics but may be used in a future version, so left in here
  var thrust = new Vector2();

  function isApproxEqual( a, b, tolerance ) { return Math.abs( a - b ) <= tolerance; }

  //Flag to enable debugging for physics issues
  var debugLogEnabled = false;
  var debug = debugLogEnabled ? function( string ) { console.log( string ); } : null;

  var MAX_NUMBER_CONTROL_POINTS = 12;

  /**
   * Main constructor for the EnergySkateParkBasicsModel
   *
   * @param {Boolean} draggableTracks True if this is screen 2-3, where friction is allowed to be on or off
   * @param {Boolean} frictionAllowed True in screen 3 where the user can drag the tracks
   * @constructor
   */
  function EnergySkateParkBasicsModel( draggableTracks, frictionAllowed ) {
    if ( !window.phetModel ) {
      window.phetModel = new PropertySet( {text: ''} );
    }
    this.frictionAllowed = frictionAllowed;
    this.draggableTracks = draggableTracks;

    var model = this;

    //Temporary flag that keeps track of whether the track was changed in the step before the physics update.
    //true if the skater's track is being dragged by the user, so that energy conservation no longer applies.
    //Only applies to one frame at a time (for the immediate next update).
    //See https://github.com/phetsims/energy-skate-park-basics/issues/127
    //Also applies to https://github.com/phetsims/energy-skate-park-basics/issues/135
    this.trackChangePending = false;
    PropertySet.call( this, {

      //Model for visibility of various view parameters
      pieChartVisible: false,
      barGraphVisible: false,
      gridVisible: false,
      speedometerVisible: false,

      //Enabled/disabled for the track editing buttons
      editButtonEnabled: false,
      clearButtonEnabled: false,

      //Whether the sim is paused or running
      paused: false,

      //speed of the model, either 'normal' or 'slow'
      speed: 'normal',

      //Coefficient of friction (unitless) between skater and track
      friction: frictionAllowed ? 0.05 : 0,

      //Whether the skater should stick to the track like a roller coaster, or be able to fly off like a street
      detachable: false,

      //True if the user has pressed 'edit' to modify connected tracks, and the sim is in an "editing" mode
      editing: false
    } );
    this.skater = new Skater();

    //If the mass changes while the sim is paused, trigger an update so the skater image size will update, see #115
    this.skater.property( 'mass' ).link( function() { if ( model.paused ) { model.skater.trigger( 'updated' ); } } );

    this.tracks = new ObservableArray();

    var updateTrackEditingButtonProperties = function() {
      var editEnabled = false;
      var clearEnabled = false;
      var physicalTracks = model.getPhysicalTracks();
      for ( var i = 0; i < physicalTracks.length; i++ ) {
        clearEnabled = true;
        var physicalTrack = physicalTracks[i];
        if ( physicalTrack.controlPoints.length >= 3 ) {
          editEnabled = true;
        }
      }
      model.editButtonEnabled = editEnabled;
      model.clearButtonEnabled = clearEnabled;
    };
    this.tracks.addItemAddedListener( updateTrackEditingButtonProperties );
    this.tracks.addItemRemovedListener( updateTrackEditingButtonProperties );
    this.on( 'track-cut', updateTrackEditingButtonProperties );
    this.on( 'track-changed', updateTrackEditingButtonProperties );

    if ( !draggableTracks ) {

      //For screens 1-2, the index of the selected scene (and track) within the screen
      this.addProperty( 'scene', 0 );

      //Shape types
      //For the double well, move the left well up a bit since the interpolation moves it down by that much, and we don't want the skater to go to y<0 while on the track.  Numbers determined by trial and error.
      var parabola = [new ControlPoint( -4, 6 ), new ControlPoint( 0, 0 ), new ControlPoint( 4, 6 )];
      var slope = [new ControlPoint( -4, 6 ), new ControlPoint( -2, 1.2 ), new ControlPoint( 2, 0.05 )];
      var doubleWell = [new ControlPoint( -4, 5 ), new ControlPoint( -2, 0.0166015 ), new ControlPoint( 0, 2 ), new ControlPoint( 2, 1 ), new ControlPoint( 4, 5 ) ];

      this.tracks.addAll(
        [ new Track( this, this.tracks, parabola, false ),
          new Track( this, this.tracks, slope, false ),
          new Track( this, this.tracks, doubleWell, false )
        ] );

      this.sceneProperty.link( function( scene ) {
        for ( var i = 0; i < model.tracks.length; i++ ) {
          model.tracks.get( i ).physical = (i === scene);
          model.tracks.get( i ).scene = i;
        }
        model.skater.track = null;
      } );
    }
    else {
      this.addDraggableTracks();
    }
  }

  return inherit( PropertySet, EnergySkateParkBasicsModel, {

    //Add the tracks that will be in the track toolbox for the "Playground" screen
    addDraggableTracks: function() {
      for ( var i = 0; i < 4; i++ ) {
        this.addDraggableTrack();
      }
    },

    //Add a single track to the track control panel.
    addDraggableTrack: function() {

      //Move the tracks over so they will be in the right position in the view coordinates, under the grass to the left of the clock controls
      //Could use view transform for this, but it would require creating the view first, so just eyeballing it for now.
      var offset = new Vector2( -5.5 + 0.27, -0.85 );
      var controlPoints = [ new ControlPoint( offset.x - 1, offset.y ), new ControlPoint( offset.x, offset.y ), new ControlPoint( offset.x + 1, offset.y )];
      this.tracks.add( new Track( this, this.tracks, controlPoints, true ) );
    },

    //Reset the model, including the skater, tracks, visualizations, etc.
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.skater.reset();

      this.clearTracks();
    },

    clearTracks: function() {

      //For the first two screens, make the default track physical
      if ( this.draggableTracks ) {
        this.tracks.clear();
        this.addDraggableTracks();

        //If the skater was on a track, then he should fall off, see #97
        if ( this.skater.track ) {
          this.skater.track = null;
        }
      }
    },

    //step one frame, assuming 60fps
    manualStep: function() {
      var skaterState = SkaterState.createFromPool( this.skater, EMPTY_OBJECT );
      var result = this.stepModel( 1.0 / 60, skaterState );
      result.setToSkater( this.skater );
      this.skater.trigger( 'updated' );
    },

    //Step the model, automatically called from Joist
    step: function( dt ) {

      var initialEnergy = null;

      //If the delay makes dt too high, then truncate it.  This helps e.g. when clicking in the address bar on ipad, which gives a huge dt and problems for integration
      if ( !this.paused && !this.skater.dragging ) {

        //If they switched windows or tabs, just bail on that delta
        if ( dt > 1 || dt <= 0 ) {
          dt = 1.0 / 60.0;
        }

        var skaterState = SkaterState.createFromPool( this.skater, EMPTY_OBJECT );
        if ( debug ) {
          initialEnergy = skaterState.getTotalEnergy();
        }

        var updatedState = this.stepModel( this.speed === 'normal' ? dt : dt * 0.25, skaterState );

        //Uncomment this block to debug energy issues.  Commented out instead of blocked with a flag so debugger statement will pass jshint
        if ( debug && Math.abs( updatedState.getTotalEnergy() - initialEnergy ) > 1E-6 ) {
          var redo = this.stepModel( this.speed === 'normal' ? dt : dt * 0.25, SkaterState.createFromPool( this.skater, EMPTY_OBJECT ) );
          console.log( redo );
        }
        updatedState.setToSkater( this.skater );
        this.skater.trigger( 'updated' );
      }

      //Clear the track change pending flag for the next step
      this.trackChangePending = false;

      SkaterState.clearAllocated();
    },

    //The skater moves along the ground with the same coefficient of fraction as the tracks, see https://github.com/phetsims/energy-skate-park-basics/issues/11
    stepGround: function( dt, skaterState ) {
      var x0 = skaterState.positionX;
      var frictionMagnitude = (this.friction === 0 || skaterState.getSpeed() < 1E-2) ? 0 : this.friction * skaterState.mass * skaterState.gravity;
      var acceleration = Math.abs( frictionMagnitude ) * (skaterState.velocityX > 0 ? -1 : 1) / skaterState.mass;

      var v1 = skaterState.velocityX + acceleration * dt;

      //Exponentially decay the velocity if already nearly zero, see https://github.com/phetsims/energy-skate-park-basics/issues/138
      if ( this.friction !== 0 && skaterState.getSpeed() < 1E-2 ) {
        v1 = v1 / 2;
      }
      var x1 = x0 + v1 * dt;
      var newPosition = new Vector2( x1, 0 );
      var originalEnergy = skaterState.getTotalEnergy();

      var updated = skaterState.updatePositionAngleUpVelocity( newPosition.x, newPosition.y, 0, true, v1, 0 );

      var newEnergy = updated.getTotalEnergy();
      return updated.updateThermalEnergy( updated.thermalEnergy + (originalEnergy - newEnergy) );
    },

    //No bouncing on the ground, but the code is very similar to attachment part of interactWithTracksWhileFalling
    switchToGround: function( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt ) {
      var segment = new Vector2( 1, 0 );

      var newSpeed = segment.dot( proposedVelocity );

      //Make sure energy perfectly conserved when falling to the ground.
      var newKineticEnergy = 0.5 * newSpeed * newSpeed * skaterState.mass;
      var newPotentialEnergy = 0;
      var newThermalEnergy = initialEnergy - newKineticEnergy - newPotentialEnergy;

      if ( !isFinite( newThermalEnergy ) ) { throw new Error( "not finite" ); }
      return skaterState.switchToGround( newThermalEnergy, newSpeed, 0, proposedPosition.x, proposedPosition.y );
    },

    //Update the skater in free fall
    stepFreeFall: function( dt, skaterState ) {
      var initialEnergy = skaterState.getTotalEnergy();

      var acceleration = new Vector2( 0, skaterState.gravity );
      var proposedVelocity = skaterState.getVelocity().plus( acceleration.times( dt ) );
      var position = new Vector2( skaterState.positionX, skaterState.positionY );
      var proposedPosition = position.plus( proposedVelocity.times( dt ) );
      if ( proposedPosition.y < 0 ) {
        proposedPosition.y = 0;

        return this.switchToGround( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt );
      }
      else if ( position.x !== proposedPosition.x || position.y !== proposedPosition.y ) {

        //see if it crossed the track
        var physicalTracks = this.getPhysicalTracks();

        //Make sure the skater has gone far enough before connecting to a track, this is to prevent automatically reattaching to the track it just jumped off the middle of.  See #142
        if ( physicalTracks.length && skaterState.timeSinceJump > 3 / 16.0 ) {
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

    //Find the closest track to the skater, to see what he can bounce off of or attach to, and return the closest point on that track took
    getClosestTrackAndPositionAndParameter: function( position, physicalTracks ) {
      var closestTrack = null;
      var closestMatch = null;
      var closestDistance = Number.POSITIVE_INFINITY;
      for ( var i = 0; i < physicalTracks.length; i++ ) {
        var track = physicalTracks[i];

        //PERFORMANCE/ALLOCATION maybe get closest point shouldn't return a new object allocation each time, or use pooling for it, or pass in reference as an arg?
        var bestMatch = track.getClosestPositionAndParameter( position );
        if ( bestMatch.distance < closestDistance ) {
          closestDistance = bestMatch.distance;
          closestTrack = track;
          closestMatch = bestMatch;
        }
      }
      if ( closestTrack ) {
        return {track: closestTrack, u: closestMatch.u, point: closestMatch.point};
      }
      else {
        return null;
      }
    },

    //Check to see if it should hit or attach to track during free fall
    interactWithTracksWhileFalling: function( physicalTracks, skaterState, proposedPosition, initialEnergy, dt, proposedVelocity ) {

      //Find the closest track
      //TODO: Allocations
      var closestTrackAndPositionAndParameter = this.getClosestTrackAndPositionAndParameter( new Vector2( skaterState.positionX, skaterState.positionY ), physicalTracks );
      var track = closestTrackAndPositionAndParameter.track;
      var u = closestTrackAndPositionAndParameter.u;
      var trackPoint = closestTrackAndPositionAndParameter.point;

      if ( !track.isParameterInBounds( u ) ) {
        return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt );
      }
      else {
        var normal = track.getUnitNormalVector( u );
        var segment = normal.perpendicular();

        var beforeVector = new Vector2( skaterState.positionX, skaterState.positionY ).minus( trackPoint );
        var afterVector = proposedPosition.minus( trackPoint );

        //If crossed the track, attach to it.
        if ( beforeVector.dot( afterVector ) < 0 ) {

          var newVelocity = segment.times( segment.dot( proposedVelocity ) );
          var newSpeed = newVelocity.magnitude();
          var newKineticEnergy = 0.5 * skaterState.mass * newVelocity.magnitudeSquared();
          var newPosition = track.getPoint( u );
          var newPotentialEnergy = -skaterState.mass * skaterState.gravity * newPosition.y;
          var newThermalEnergy = initialEnergy - newKineticEnergy - newPotentialEnergy;

          var dot = proposedVelocity.normalized().dot( segment );

          //Sanity test
          assert && assert( isFinite( dot ) );
          assert && assert( isFinite( newVelocity.x ) );
          assert && assert( isFinite( newVelocity.y ) );
          assert && assert( isFinite( newThermalEnergy ) );

          var uD = (dot > 0 ? +1 : -1) * newSpeed;
          var up = beforeVector.dot( normal ) > 0;

          return skaterState.attachToTrack( newThermalEnergy, track, up, u, uD, newVelocity.x, newVelocity.y, newPosition.x, newPosition.y );
        }

        //It just continued in free fall
        else {
          return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt );
        }
      }
    },

    //Started in free fall and did not interact with a track
    continueFreeFall: function( skaterState, initialEnergy, proposedPosition, proposedVelocity, dt ) {

      //make up for the difference by changing the y value
      var y = (initialEnergy - 0.5 * skaterState.mass * proposedVelocity.magnitudeSquared() - skaterState.thermalEnergy) / (-1 * skaterState.mass * skaterState.gravity);
      if ( y <= 0 ) {
        //When falling straight down, stop completely and convert all energy to thermal
        return skaterState.strikeGround( initialEnergy, proposedPosition.x );
      }
      else {
        return skaterState.continueFreeFall( proposedVelocity.x, proposedVelocity.y, proposedPosition.x, y, skaterState.timeSinceJump + dt );
      }
    },

    /**
     * Gets the net force discluding normal force.
     *
     * Split into component-wise to prevent allocations, see #50
     *
     * @param {SkaterState} skaterState the state
     * @return {Number} netForce in the X direction
     */
    getNetForceWithoutNormalX: function( skaterState ) {
      return this.getFrictionForceX( skaterState );
    },

    /**
     * Gets the net force discluding normal force.
     *
     * Split into component-wise to prevent allocations, see #50
     *
     * @param {SkaterState} skaterState the state
     * @return {Number} netForce in the Y direction
     */
    getNetForceWithoutNormalY: function( skaterState ) {
      return skaterState.mass * skaterState.gravity + this.getFrictionForceY( skaterState );
    },

    //The only other force on the object in the direction of motion is the gravity force
    //Component-wise to reduce allocations, see #50
    getFrictionForceX: function( skaterState ) {
      //Friction force should not exceed sum of other forces (in the direction of motion), otherwise the friction could start a stopped object moving
      //Hence we check to see if the object is already stopped and don't add friction in that case
      if ( this.friction === 0 || skaterState.getSpeed() < 1E-2 ) {
        return 0;
      }
      else {
        var magnitude = this.friction * this.getNormalForce( skaterState ).magnitude();
        var angleComponent = Math.cos( skaterState.getVelocity().angle() + Math.PI );
        return magnitude * angleComponent;
      }
    },

    //The only other force on the object in the direction of motion is the gravity force
    //Component-wise to reduce allocations, see #50
    getFrictionForceY: function( skaterState ) {
      //Friction force should not exceed sum of other forces (in the direction of motion), otherwise the friction could start a stopped object moving
      //Hence we check to see if the object is already stopped and don't add friction in that case
      if ( this.friction === 0 || skaterState.getSpeed() < 1E-2 ) {
        return 0;
      }
      else {
        var magnitude = this.friction * this.getNormalForce( skaterState ).magnitude();
        return magnitude * Math.sin( skaterState.getVelocity().angle() + Math.PI );
      }
    },

    //Use a separate pooled curvature variable
    curvatureTemp2: {r: 1, x: 0, y: 0},

    //Get the normal force (Newtons) on the skater
    getNormalForce: function( skaterState ) {
      skaterState.getCurvature( this.curvatureTemp2 );
      var radiusOfCurvature = Math.min( this.curvatureTemp2.r, 100000 );
      var netForceRadial = new Vector2();

      netForceRadial.addXY( 0, skaterState.mass * skaterState.gravity );//gravity
      var curvatureDirection = this.getCurvatureDirection( this.curvatureTemp2, skaterState.positionX, skaterState.positionY );
      var normalForce = skaterState.mass * skaterState.getSpeed() * skaterState.getSpeed() / Math.abs( radiusOfCurvature ) - netForceRadial.dot( curvatureDirection );
      debug && debug( normalForce );

      var n = Vector2.createPolar( normalForce, curvatureDirection.angle() );
      return n;
    },

    //Use an Euler integration step to move the skater along the track
    //This code is in an inner loop of the model physics and has been heavily optimized
    stepEuler: function( dt, skaterState ) {
      var track = skaterState.track;
      var origEnergy = skaterState.getTotalEnergy();
      var origLocX = skaterState.positionX;
      var origLocY = skaterState.positionY;
      var thermalEnergy = skaterState.thermalEnergy;
      var uD = skaterState.uD;
      assert && assert( isFinite( uD ) );
      var u = skaterState.u;

      //Component-wise math to prevent allocations, see #50
      var netForceX = this.getNetForceWithoutNormalX( skaterState );
      var netForceY = this.getNetForceWithoutNormalY( skaterState );
      var netForceMagnitude = Math.sqrt( netForceX * netForceX + netForceY * netForceY );
      var netForceAngle = Math.atan2( netForceY, netForceX );

      //Get the net force in the direction of the track.  Dot product is a * b * cos(theta)
      var a = netForceMagnitude * Math.cos( skaterState.track.getModelAngleAt( u ) - netForceAngle ) / skaterState.mass;

      uD += a * dt;
      assert && assert( isFinite( uD ) );
      u += track.getParametricDistance( u, uD * dt + 1 / 2 * a * dt * dt );
      var newPointX = skaterState.track.getX( u );
      var newPointY = skaterState.track.getY( u );
      var parallelUnitX = skaterState.track.getUnitParallelVectorX( u );
      var parallelUnitY = skaterState.track.getUnitParallelVectorY( u );
      var newVelocityX = parallelUnitX * uD;
      var newVelocityY = parallelUnitY * uD;

      //Exponentially decay the velocity if already nearly zero and on a flat slope, see https://github.com/phetsims/energy-skate-park-basics/issues/129
      if ( parallelUnitX / parallelUnitY > 5 && Math.sqrt( newVelocityX * newVelocityX + newVelocityY * newVelocityY ) < 1E-2 ) {
        newVelocityX /= 2;
        newVelocityY /= 2;
      }

      //choose velocity by using the unit parallel vector to the track
      var newState = skaterState.updateUUDVelocityPosition( u, uD, newVelocityX, newVelocityY, newPointX, newPointY );
      if ( this.friction > 0 ) {

        //Compute friction force magnitude component-wise to prevent allocations, see #50
        var frictionForceX = this.getFrictionForceX( skaterState );
        var frictionForceY = this.getFrictionForceY( skaterState );
        var frictionForceMagnitude = Math.sqrt( frictionForceX * frictionForceX + frictionForceY * frictionForceY );

        var newPoint = new Vector2( newPointX, newPointY );

        var therm = frictionForceMagnitude * newPoint.distanceXY( origLocX, origLocY );
        thermalEnergy += therm;

        var newTotalEnergy = newState.getTotalEnergy() + therm;

        //Conserve energy, but only if the user is not adding energy, see https://github.com/phetsims/energy-skate-park-basics/issues/135
        if ( thrust.magnitude() === 0 && !this.trackChangePending ) {
          if ( newTotalEnergy < origEnergy ) {
            thermalEnergy += Math.abs( newTotalEnergy - origEnergy );//add some thermal to exactly match
            if ( Math.abs( newTotalEnergy - origEnergy ) > 1E-6 ) {
              debug && debug( "Added thermal, dE=" + ( newState.getTotalEnergy() - origEnergy ) );
            }
          }
          if ( newTotalEnergy > origEnergy ) {
            if ( Math.abs( newTotalEnergy - origEnergy ) < therm ) {
              debug && debug( "gained energy, removing thermal (Would have to remove more than we gained)" );
            }
            else {
              thermalEnergy -= Math.abs( newTotalEnergy - origEnergy );
              if ( Math.abs( newTotalEnergy - origEnergy ) > 1E-6 ) {
                debug && debug( "Removed thermal, dE=" + ( newTotalEnergy - origEnergy ) );
              }
            }
          }
        }

        //Discrepancy with original version: original version allowed drop of thermal energy here, to be fixed in the heuristic patch
        //We have clamped it here to make it amenable to a smaller number of euler updates, to improve performance
        return newState.updateThermalEnergy( Math.max( thermalEnergy, skaterState.thermalEnergy ) );
      }
      else {
        return newState;
      }
    },

    curvatureTemp: {r: 1, x: 0, y: 0},

    //Update the skater as it moves along the track, and fly off the track if it goes over a jump or off the end of the track
    stepTrack: function( dt, skaterState ) {

      skaterState.getCurvature( this.curvatureTemp );

      var curvatureDirectionX = this.getCurvatureDirectionX( this.curvatureTemp, skaterState.positionX, skaterState.positionY );
      var curvatureDirectionY = this.getCurvatureDirectionY( this.curvatureTemp, skaterState.positionX, skaterState.positionY );

      var track = skaterState.track;
      var sideVectorX = skaterState.up ? track.getUnitNormalVectorX( skaterState.u ) :
                        track.getUnitNormalVectorX( skaterState.u ) * -1;
      var sideVectorY = skaterState.up ? track.getUnitNormalVectorY( skaterState.u ) :
                        track.getUnitNormalVectorY( skaterState.u ) * -1;

      //Dot product written out component-wise to avoid allocations, see #50
      var outsideCircle = sideVectorX * curvatureDirectionX + sideVectorY * curvatureDirectionY < 0;

      //compare a to v/r^2 to see if it leaves the track
      var r = Math.abs( this.curvatureTemp.r );
      var centripForce = skaterState.mass * skaterState.uD * skaterState.uD / r;

      var netForceWithoutNormalX = this.getNetForceWithoutNormalX( skaterState );
      var netForceWithoutNormalY = this.getNetForceWithoutNormalY( skaterState );

      //Net force in the radial direction is the dot product.  Component-wise to avoid allocations, see #50
      var netForceRadial = netForceWithoutNormalX * curvatureDirectionX + netForceWithoutNormalY * curvatureDirectionY;

      var leaveTrack = (netForceRadial < centripForce && outsideCircle) || (netForceRadial > centripForce && !outsideCircle);
      if ( leaveTrack && this.detachable ) {

        //Leave the track.  Make sure the velocity is pointing away from the track or keep track of frames away from the track so it doesn't immediately recollide
        //Or project a ray and see if a collision is imminent
        var freeSkater = skaterState.leaveTrack();

        //Step after switching to free fall, so it doesn't look like it pauses
        return this.stepFreeFall( dt, freeSkater );
      }
      else {
        var newState = skaterState;

        //Turning this value to 5 or less causes thermal energy to decrease on some time steps
        //Discrepancy with original version: original version had 10 divisions here.  We have reduced it to make it more smooth and less GC
        var numDivisions = 4;
        for ( var i = 0; i < numDivisions; i++ ) {
          newState = this.stepEuler( dt / numDivisions, newState );
        }

        //Correct energy
        var correctedState = this.correctEnergy( skaterState, newState );

        //Fly off the left or right side of the track
        if ( skaterState.track.isParameterInBounds( correctedState.u ) ) {
          return correctedState;
        }
        else {
          return skaterState.updateTrackUDStepsSinceJump( null, 0, 0 );
        }
      }
    },

    //Try to match the target energy by reducing the velocity of the skaterState
    correctEnergyReduceVelocity: function( skaterState, targetState ) {

      //Make a clone we can mutate and return, to protect the input argument
      var newSkaterState = targetState.copy();
      var e0 = skaterState.getTotalEnergy();
      var mass = skaterState.mass;
      var unit = newSkaterState.track.getUnitParallelVector( newSkaterState.u );

      //Binary search, but bail after too many iterations
      for ( var i = 0; i < 100; i++ ) {
        var dv = ( newSkaterState.getTotalEnergy() - e0 ) / ( mass * newSkaterState.uD );

        var newVelocity = newSkaterState.uD - dv;

        //We can just set the state directly instead of calling update since we are keeping a protected clone of the newSkaterState
        newSkaterState.uD = newVelocity;
        var result = unit.times( newVelocity );
        newSkaterState.velocityX = result.x;
        newSkaterState.velocityY = result.y;

        if ( isApproxEqual( e0, newSkaterState.getTotalEnergy(), 1E-8 ) ) {
          break;
        }
      }
      return newSkaterState;
    },

    //Binary search to find the parametric coordinate along the track that matches the e0 energy
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
        }//continue to find best value closest to proposed u, even if several values give dE=0.0
      }
      debug && debug( "After " + numSteps + " steps, origAlpha=" + u0 + ", bestAlpha=" + bestAlpha + ", dE=" + bestDE );
      return bestAlpha;
    },

    //A number of heuristic energy correction steps to ensure energy is conserved while keeping the motion smooth and accurate
    correctEnergy: function( skaterState, newState ) {
      if ( this.trackChangePending ) {
        return newState;
      }
      var u0 = skaterState.u;
      var e0 = skaterState.getTotalEnergy();

      if ( !isFinite( newState.getTotalEnergy() ) ) { throw new Error( 'not finite' );}
      var dE = newState.getTotalEnergy() - e0;
      if ( Math.abs( dE ) < 1E-6 ) {
        //small enough
        return newState;
      }
      else {
        if ( newState.getTotalEnergy() > e0 ) {
          debug && debug( "Energy too high" );

          //can we reduce the velocity enough?
          if ( Math.abs( newState.getKineticEnergy() ) > Math.abs( dE ) ) {//amount we could reduce the energy if we deleted all the kinetic energy:

            //TODO: maybe should only do this if all velocity is not converted
            debug && debug( "Could fix all energy by changing velocity." );
            var correctedStateA = this.correctEnergyReduceVelocity( skaterState, newState );
            debug && debug( "changed velocity: dE=" + ( correctedStateA.getTotalEnergy() - e0 ) );
            if ( !isApproxEqual( e0, correctedStateA.getTotalEnergy(), 1E-8 ) ) {
              debug && debug( "Energy error[0]" );
            }
            return correctedStateA;
          }
          else {
            debug && debug( "Not enough KE to fix with velocity alone: normal:" );
            debug && debug( "changed position u: dE=" + ( newState.getTotalEnergy() - e0 ) );
            //search for a place between u and u0 with a better energy

            var numRecursiveSearches = 10;
            var u = newState.u;
            var bestAlpha = ( u + u0 ) / 2.0;
            var da = ( u - u0 ) / 2;
            for ( var i = 0; i < numRecursiveSearches; i++ ) {
              var numSteps = 10;
              bestAlpha = this.searchSplineForEnergy( newState, bestAlpha - da, bestAlpha + da, e0, numSteps );
              da = ( ( bestAlpha - da ) - ( bestAlpha + da ) ) / numSteps;
            }

            var point = newState.track.getPoint( bestAlpha );
            var correctedState = newState.updateUPosition( bestAlpha, point.x, point.y );
            debug && debug( "changed position u: dE=" + ( correctedState.getTotalEnergy() - e0 ) );
            if ( !isApproxEqual( e0, correctedState.getTotalEnergy(), 1E-8 ) ) {
              if ( Math.abs( correctedState.getKineticEnergy() ) > Math.abs( dE ) ) {//amount we could reduce the energy if we deleted all the kinetic energy:

                //TODO: maybe should only do this if all velocity is not converted
                debug && debug( "Fixed position some, still need to fix velocity as well." );
                var correctedState2 = this.correctEnergyReduceVelocity( skaterState, correctedState );
                if ( !isApproxEqual( e0, correctedState2.getTotalEnergy(), 1E-8 ) ) {
                  debug && debug( "Changed position & Velocity and still had energy error" );
                  debug && debug( "Energy error[123]" );
                }
                return correctedState2;
              }
              else {

                //TODO: This error case can still occur, especially with friction turned on
                console.log( "Changed position, wanted to change velocity, but didn't have enough to fix it..., dE=" + ( newState.getTotalEnergy() - e0 ) );
              }
            }
            return correctedState;
          }
        }
        else {
          if ( !isFinite( newState.getTotalEnergy() ) ) { throw new Error( 'not finite' );}
          debug && debug( "Energy too low" );

          //increasing the kinetic energy
          //Choose the exact velocity in the same direction as current velocity to ensure total energy conserved.
          var vSq = Math.abs( 2 / newState.mass * ( e0 - newState.getPotentialEnergy() - newState.thermalEnergy ) );
          var v = Math.sqrt( vSq );

          //TODO: What if uD ===0?
          var newVelocity = v * (newState.uD > 0 ? +1 : -1);
          var updatedVelocityX = newState.track.getUnitParallelVectorX( newState.u ) * newVelocity;
          var updatedVelocityY = newState.track.getUnitParallelVectorY( newState.u ) * newVelocity;
          var fixedState = newState.updateUDVelocity( newVelocity, updatedVelocityX, updatedVelocityY );
          debug && debug( "Set velocity to match energy, when energy was low: " );
          debug && debug( "INC changed velocity: dE=" + ( fixedState.getTotalEnergy() - e0 ) );
          if ( !isApproxEqual( e0, fixedState.getTotalEnergy(), 1E-8 ) ) {
            new Error( "Energy error[2]" ).printStackTrace();
          }
          return fixedState;
        }
      }
    },

    //PERFORMANCE/ALLOCATION
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

    //Update the skater based on which state it is in
    stepModel: function( dt, skaterState ) {
      return skaterState.dragging ? skaterState : //User is dragging the skater, nothing to update here
             !skaterState.track && skaterState.positionY <= 0 ? this.stepGround( dt, skaterState ) :
             !skaterState.track && skaterState.positionY > 0 ? this.stepFreeFall( dt, skaterState ) :
             skaterState.track ? this.stepTrack( dt, skaterState ) :
             skaterState;
    },

    //Return to the place he was last released by the user.  Also restores the track the skater was on so the initial conditions are the same as the previous release
    returnSkater: function() {

      //if the skater's original track is available, restore her to it, see #143
      var originalTrackAvailable = _.contains( this.getPhysicalTracks(), this.skater.startingTrack );
      if ( originalTrackAvailable ) {
        this.skater.track = this.skater.startingTrack;
      }
      this.skater.returnSkater();
    },

    //Clear the thermal energy from the model
    clearThermal: function() { this.skater.clearThermal(); },

    //Get all of the tracks marked as physical (i.e. that the skater could interact with).
    getPhysicalTracks: function() {

      //Use vanilla instead of lodash for speed since this is in an inner loop
      var physicalTracks = [];
      for ( var i = 0; i < this.tracks.length; i++ ) {
        var track = this.tracks.get( i );

        if ( track.physical ) {
          physicalTracks.push( track );
        }
      }
      return physicalTracks;
    },

    getNonPhysicalTracks: function() {

      //Use vanilla instead of lodash for speed since this is in an inner loop
      var nonphysicalTracks = [];
      for ( var i = 0; i < this.tracks.length; i++ ) {
        var track = this.tracks.get( i );

        if ( !track.physical ) {
          nonphysicalTracks.push( track );
        }
      }
      return nonphysicalTracks;
    },


    //Find whatever track is connected to the specified track and join them together to a new track
    joinTracks: function( track ) {
      var connectedPoint = track.getSnapTarget();
      for ( var i = 0; i < this.getPhysicalTracks().length; i++ ) {
        var otherTrack = this.getPhysicalTracks()[i];
        if ( otherTrack.containsControlPoint( connectedPoint ) ) {
          this.joinTrackToTrack( track, otherTrack );
          break;
        }
      }

      //if the number of control points is low enough, replenish the toolbox
      if ( this.getNumberOfControlPoints() <= MAX_NUMBER_CONTROL_POINTS - 3 ) {
        this.addDraggableTrack();
      }
    },

    //The user has pressed the "delete" button for the specified track's specified control point, and it should be deleted.
    //It should be an inner point of a track (not an end point)
    //If there were only 2 points on the track, just delete the entire track
    deleteControlPoint: function( track, controlPointIndex ) {
      track.trigger( 'remove' );
      this.tracks.remove( track );

      if ( track.controlPoints.length > 2 ) {
        var points = _.without( track.controlPoints, track.controlPoints[controlPointIndex] );
        var newTrack = new Track( this, this.tracks, points, true, track.getParentsOrSelf() );
        newTrack.physical = true;
        this.tracks.add( newTrack );
      }

      //Trigger track changed first to update the edit enabled properties
      this.trigger( 'track-changed' );

      //If the skater was on track, then he should fall off
      if ( this.skater.track === track ) {
        this.skater.track = null;
      }

      //if the number of control points is low enough, replenish the toolbox
      if ( this.getNumberOfControlPoints() <= MAX_NUMBER_CONTROL_POINTS - 3 ) {
        this.addDraggableTrack();
      }
    },

    //The user has pressed the "delete" button for the specified track's specified control point, and it should be deleted.
    //It should be an inner point of a track (not an end point)
    splitControlPoint: function( track, controlPointIndex, modelAngle ) {
      var vector = Vector2.createPolar( 0.5, modelAngle );
      var newPoint1 = new ControlPoint( track.controlPoints[controlPointIndex].sourcePosition.x - vector.x, track.controlPoints[controlPointIndex].sourcePosition.y - vector.y );
      var newPoint2 = new ControlPoint( track.controlPoints[controlPointIndex].sourcePosition.x + vector.x, track.controlPoints[controlPointIndex].sourcePosition.y + vector.y );

      var points1 = track.controlPoints.slice( 0, controlPointIndex );
      var points2 = track.controlPoints.slice( controlPointIndex + 1, track.controlPoints.length );

      points1.push( newPoint1 );
      points2.unshift( newPoint2 );

      var newTrack1 = new Track( this, this.tracks, points1, true, track.getParentsOrSelf() );
      newTrack1.physical = true;
      var newTrack2 = new Track( this, this.tracks, points2, true, track.getParentsOrSelf() );
      newTrack2.physical = true;

      track.trigger( 'remove' );
      this.tracks.remove( track );
      this.tracks.add( newTrack1 );
      this.tracks.add( newTrack2 );

      //Trigger track changed first to update the edit enabled properties
      this.trigger( 'track-changed' );

      //If the skater was on track, then he should fall off, see #97
      if ( this.skater.track === track ) {
        this.skater.track = null;
      }

      //If a control point was split and that makes too many "live" control points total, remove a piece of track from the toolbox to keep the total number of control points low enough.
      if ( this.getNumberOfControlPoints() > MAX_NUMBER_CONTROL_POINTS ) {
        //find a nonphysical track, then remove it

        var trackToRemove = this.getNonPhysicalTracks()[0];
        trackToRemove.trigger( 'remove' );
        this.tracks.remove( trackToRemove );
      }
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

      //Join in the right direction for a & b so that the joined point is in the middle

      var firstTrackForward = function() {for ( i = 0; i < a.controlPoints.length; i++ ) { points.push( a.controlPoints[i].copy() ); }};
      var firstTrackBackward = function() {for ( i = a.controlPoints.length - 1; i >= 0; i-- ) { points.push( a.controlPoints[i].copy() ); }};
      var secondTrackForward = function() {for ( i = 1; i < b.controlPoints.length; i++ ) {points.push( b.controlPoints[i].copy() ); }};
      var secondTrackBackward = function() {for ( i = b.controlPoints.length - 2; i >= 0; i-- ) {points.push( b.controlPoints[i].copy() ); }};

      //Only include one copy of the snapped point
      //Forward Forward
      if ( a.controlPoints[a.controlPoints.length - 1].snapTarget === b.controlPoints[0] ) {
        firstTrackForward();
        secondTrackForward();
      }

      //Forward Backward
      else if ( a.controlPoints[a.controlPoints.length - 1].snapTarget === b.controlPoints[b.controlPoints.length - 1] ) {
        firstTrackForward();
        secondTrackBackward();
      }

      //Backward Forward
      else if ( a.controlPoints[0].snapTarget === b.controlPoints[0] ) {
        firstTrackBackward();
        secondTrackForward();
      }

      //Backward backward
      else if ( a.controlPoints[0].snapTarget === b.controlPoints[b.controlPoints.length - 1] ) {
        firstTrackBackward();
        secondTrackBackward();
      }

      var newTrack = new Track( this, this.tracks, points, true, a.getParentsOrSelf().concat( b.getParentsOrSelf() ) );
      newTrack.physical = true;

      a.trigger( 'remove' );
      this.tracks.remove( a );

      b.trigger( 'remove' );
      this.tracks.remove( b );

      //When tracks are joined, bump the new track above ground so the y value (and potential energy) cannot go negative, and so it won't make the "return skater" button get bigger, see #158
      newTrack.bumpAboveGround();
      this.tracks.add( newTrack );

      //Move skater to new track if he was on the old track, by searching for the best fit point on the new track
      //Note: Energy is not conserved when tracks joined since the user has added or removed energy from the system
      if ( this.skater.track === a || this.skater.track === b ) {

        //Keep track of the skater direction so we can toggle the 'up' flag if the track orientation changed
        var originalNormal = this.skater.upVector;
        var p = newTrack.getClosestPositionAndParameter( new Vector2( this.skater.positionX, this.skater.positionY ) );//TODO: Allocations
        this.skater.track = newTrack;
        this.skater.u = p.u;
        var x2 = newTrack.getX( p.u );
        var y2 = newTrack.getY( p.u );
        this.skater.position = new Vector2( x2, y2 );
        this.skater.angle = newTrack.getViewAngleAt( p.u ) + (this.skater.up ? 0 : Math.PI);

        //Trigger an initial update now so we can get the right up vector, see #150
        this.skater.trigger( 'updated' );
        var newNormal = this.skater.upVector;

        //If the skater flipped upside down because the track directionality is different, toggle his 'up' flag
        if ( originalNormal.dot( newNormal ) < 0 ) {
          this.skater.up = !this.skater.up;
          this.skater.angle = newTrack.getViewAngleAt( p.u ) + (this.skater.up ? 0 : Math.PI);
          this.skater.trigger( 'updated' );
        }
      }
    },

    //When a track is dragged, update the skater's energy (if the sim was paused), since it wouldn't be handled in the update loop.
    trackModified: function( track ) {
      if ( this.paused && this.skater.track === track ) {
        this.skater.updateEnergy();
      }

      //Flag the track as having changed *this frame* so energy doesn't need to be conserved during this frame, see https://github.com/phetsims/energy-skate-park-basics/issues/127
      this.trackChangePending = true;
    },

    //Get the state, say, to put in a query parameter
    getState: function() {
      return {
        properties: this.get(),
        skater: this.skater.getState( this.tracks ),
        tracks: this.tracks.getArray().map( function( track ) {
          return {physical: track.physical, points: track.controlPoints.map( function( controlPoint ) { return controlPoint.sourcePosition; } )};
        } )
      };
    },

    //Set the state, say from a query parameter
    setState: function( state ) {
      //Clear old tracks
      this.tracks.clear();
      for ( var i = 0; i < state.tracks.length; i++ ) {
        var controlPoints = state.tracks[i].points.map( function( point ) {
          return new ControlPoint( point.x, point.y );
        } );
        var newTrack = new Track( this, this.tracks, controlPoints, true, null );
        newTrack.physical = state.tracks[i].physical;
        this.tracks.add( newTrack );
      }

      //Trigger track changed first to update the edit enabled properties
      this.trigger( 'track-changed' );

      this.set( state.properties );

      this.skater.setState( state.skater, this.tracks );
    },

    //Get the number of physical control points (i.e. control points outside of the toolbox)
    getNumberOfPhysicalControlPoints: function() {
      var numberOfPointsInEachTrack = _.map( this.getPhysicalTracks(), function( track ) {return track.controlPoints.length;} );
      return _.reduce( numberOfPointsInEachTrack, function( memo, num ) { return memo + num; }, 0 );
    },

    getNumberOfControlPoints: function() {
      var numberOfPointsInEachTrack = _.map( this.tracks.getArray(), function( track ) {return track.controlPoints.length;} );
      return _.reduce( numberOfPointsInEachTrack, function( memo, num ) { return memo + num; }, 0 );
    },

    //Logic to determine whether a control point can be added by cutting a track's control point in two
    //This is feasible if the number of control points in the play area (above y>0) is less than the maximum
    canCutTrackControlPoint: function() {
      return this.getNumberOfPhysicalControlPoints() < MAX_NUMBER_CONTROL_POINTS;
    }
  } );
} );