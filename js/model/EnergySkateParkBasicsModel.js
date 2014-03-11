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
  var LinearFunction = require( 'DOT/LinearFunction' );

  //Thrust is not currently implemented in Energy Skate Park: Basics but may be used in a future version, so left in here
  var thrust = new Vector2();

  function isApproxEqual( a, b, tolerance ) { return Math.abs( a - b ) <= tolerance; }

  function getSign( a ) {return a > 0 ? +1 : -1;}

  var debugLogEnabled = false;
  var debug = {log: debugLogEnabled ? function( string ) { console.log( string ); } : function( string ) {}};

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
      var offset = new Vector2( -5.5 + 0.27, -0.73 );
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
      var result = this.stepModel( 1.0 / 60, new SkaterState( this.skater, {} ) );
      result.setToSkater( this.skater );
      this.skater.trigger( 'updated' );
    },

    //Step the model, automatically called from Joist
    step: function( dt ) {

      var debugEnergy = false;
      var initialEnergy = null;

      //If the delay makes dt too high, then truncate it.  This helps e.g. when clicking in the address bar on ipad, which gives a huge dt and problems for integration
      if ( !this.paused && !this.skater.dragging ) {

        //If they switched windows or tabs, just bail on that delta
        if ( dt > 1 || dt <= 0 ) {
          dt = 1.0 / 60.0;
        }

        var skaterState = new SkaterState( this.skater, {} );
        if ( debugEnergy ) {
          initialEnergy = skaterState.getTotalEnergy();
        }

        skaterState = this.stepModel( this.speed === 'normal' ? dt : dt * 0.25, skaterState );

        //Uncomment this block to debug energy issues.  Commented out instead of blocked with a flag so debugger statement will pass jshint
        if ( debugEnergy && Math.abs( skaterState.getTotalEnergy() - initialEnergy ) > 1E-6 ) {
          var redo = this.stepModel( this.speed === 'normal' ? dt : dt * 0.25, new SkaterState( this.skater, {} ) );
          console.log( redo );
        }
        skaterState.setToSkater( this.skater );
        this.skater.trigger( 'updated' );
      }
    },

    //The skater moves along the ground with the same coefficient of fraction as the tracks, see https://github.com/phetsims/energy-skate-park-basics/issues/11
    stepGround: function( dt, skaterState ) {
      var x0 = skaterState.position.x;
      var frictionMagnitude = (this.friction === 0 || skaterState.velocity.magnitude() < 1E-2) ? 0 : this.friction * skaterState.mass * skaterState.gravity;
      var acceleration = Math.abs( frictionMagnitude ) * (skaterState.velocity.x > 0 ? -1 : 1) / skaterState.mass;
      var v1 = skaterState.velocity.x + acceleration * dt;
      var x1 = x0 + v1 * dt;
      var newPosition = new Vector2( x1, 0 );
      var originalEnergy = skaterState.getTotalEnergy();

      var updated = skaterState.update( {
        position: newPosition,
        angle: 0,
        up: true,
        velocity: new Vector2( v1, 0 )
      } );

      var newEnergy = updated.getTotalEnergy();
      return updated.update( {
        thermalEnergy: updated.thermalEnergy + (originalEnergy - newEnergy)
      } );
    },

    switchToGround: function( skaterState, initialEnergy, proposedPosition, proposedVelocity ) {
      var dot = proposedVelocity.dotXY( 0, 1 );

      //Gain some thermal energy in the landing, but not too much!
      //dot product of 0 converts to 0% thermal
      //dot product of 0.6 converts to 10% thermal
      //More than 0.6 is a bounce
      var fractionOfKEToConvertToThermal = new LinearFunction( 0, 0.6, 0, 0.1 )( Math.abs( dot ) );
      fractionOfKEToConvertToThermal = Math.min( fractionOfKEToConvertToThermal, 1 );

      var KE = 0.5 * proposedVelocity.magnitudeSquared() * skaterState.mass;
      var addedThermalEnergy = KE * fractionOfKEToConvertToThermal;
      var newKE = KE - addedThermalEnergy;
      var newSpeed = Math.sqrt( 2 * newKE / skaterState.mass );

      //Make sure energy perfectly conserved when falling to the ground.
      if ( fractionOfKEToConvertToThermal === 1 ) {
        newSpeed = 0;
        addedThermalEnergy = skaterState.getKineticEnergy() + skaterState.getPotentialEnergy();
      }

      var newThermalEnergy = skaterState.thermalEnergy + addedThermalEnergy;
      if ( isNaN( newThermalEnergy ) ) { throw new Error( "nan" ); }
      return skaterState.update( {
        thermalEnergy: newThermalEnergy,
        track: null,
        up: true,
        angle: 0,
        velocity: proposedVelocity.normalized().timesScalar( newSpeed ),
        position: proposedPosition
      } );
    },

    //Update the skater in free fall
    stepFreeFall: function( dt, skaterState ) {
      var initialEnergy = skaterState.getTotalEnergy();

      var acceleration = new Vector2( 0, skaterState.gravity );
      var proposedVelocity = skaterState.velocity.plus( acceleration.times( dt ) );
      var proposedPosition = skaterState.position.plus( proposedVelocity.times( dt ) );
      if ( proposedPosition.y < 0 ) {
        proposedPosition.y = 0;

        return this.switchToGround( skaterState, initialEnergy, proposedPosition, proposedVelocity );
      }
      else if ( skaterState.position.x !== proposedPosition.x || skaterState.position.y !== proposedPosition.y ) {

        //see if it crossed the track
        var physicalTracks = this.getPhysicalTracks();
        if ( physicalTracks.length && skaterState.stepsSinceJump > 10 ) {
          return this.interactWithTracksWhileFalling( physicalTracks, skaterState, proposedPosition, initialEnergy, dt, proposedVelocity );
        }
        else {
          return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity );
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
      var closestTrackAndPositionAndParameter = this.getClosestTrackAndPositionAndParameter( skaterState.position, physicalTracks );
      var track = closestTrackAndPositionAndParameter.track;
      var u = closestTrackAndPositionAndParameter.u;
      var trackPoint = closestTrackAndPositionAndParameter.point;

      if ( !track.isParameterInBounds( u ) ) {
        return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity );
      }
      else {
        var normal = track.getUnitNormalVector( u );
        var segment = normal.perpendicular();

        var beforeVector = skaterState.position.minus( trackPoint );
        var afterVector = proposedPosition.minus( trackPoint );
        if ( beforeVector.dot( afterVector ) < 0 ) {

          //reflect the velocity vector, see http://www.gamedev.net/topic/165537-2d-vector-reflection-/

          //Possible heisenbug workaround.  Probably no longer an issue in Mobile Safari in iOS7
          var allOK = proposedVelocity && proposedVelocity.minus && normal.times && normal.dot;

          var normalDotVelocity = normal.dot( proposedVelocity );
          var bounceVelocity = allOK ? proposedVelocity.minus( normal.times( 2 * normalDotVelocity ) ) : new Vector2( 0, 1 );
          bounceVelocity.setMagnitude( skaterState.velocity.magnitude() );

          //Attach to track if velocity is close enough to parallel to the track
          var dot = proposedVelocity.normalized().dot( segment );

          //If friction is allowed, then bounce with elasticity <1.
          //If friction is not allowed, then bounce with elasticity = 1.

          var elasticity = 0.6;
          var newNormalVelocity = normal.times( elasticity * normal.dot( proposedVelocity ) );
          var parallelVelocity = segment.times( segment.dot( proposedVelocity ) );
          var newVelocity = parallelVelocity.minus( newNormalVelocity );

          var testVal = Math.abs( newNormalVelocity.magnitude() / newVelocity.magnitude() );

          var p = Math.abs( proposedVelocity.magnitude() / skaterState.gravity / dt );

          var bounce = testVal >= 0.9;
          var GRAB_THRESHOLD = 3.0;
          if ( p < GRAB_THRESHOLD ) {
            bounce = false;
          }

          if ( bounce ) {
            return skaterState.update( {velocity: newVelocity} );
          }
          else {

            //Gain some thermal energy in the landing, but not too much!
            //dot product of 0 converts to 0% thermal
            //dot product of 0.6 converts to 10% thermal
            //More than 0.6 is a bounce
            var fractionOfKEToConvertToThermal = new LinearFunction( 0, 0.6, 0, 0.1 )( Math.abs( dot ) );

            var KE = 0.5 * proposedVelocity.magnitudeSquared() * skaterState.mass;
            var addedThermalEnergy = KE * fractionOfKEToConvertToThermal;
            var newKE = KE - addedThermalEnergy;
            var newSpeed = Math.sqrt( 2 * newKE / skaterState.mass );
            var uD = (dot > 0 ? +1 : -1) * newSpeed;
            var up = beforeVector.dot( normal ) > 0;

            console.log( 'IWTWF', up );
            var newThermalEnergy = skaterState.thermalEnergy + addedThermalEnergy;
            if ( isNaN( newThermalEnergy ) ) { throw new Error( "nan" ); }
            var result = skaterState.update( {
              thermalEnergy: newThermalEnergy,
              track: track,
              up: up,
              u: u,
              uD: uD,
              velocity: proposedVelocity.normalized().timesScalar( Math.abs( uD ) ),
              position: track.getPoint( u )
            } );

            return this.correctEnergyReduceVelocity( skaterState, result );
          }
        }

        //It just continued in free fall
        else {
          return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity );
        }
      }
    },

    //Started in free fall and did not interact with a track
    continueFreeFall: function( skaterState, initialEnergy, proposedPosition, proposedVelocity ) {

      //make up for the difference by changing the y value
      var y = (initialEnergy - 0.5 * skaterState.mass * proposedVelocity.magnitudeSquared() - skaterState.thermalEnergy) / (-1 * skaterState.mass * skaterState.gravity);
      if ( y <= 0 ) {
        //When falling straight down, stop completely and convert all energy to thermal
        return skaterState.update( {
          velocity: new Vector2( 0, 0 ),
          thermalEnergy: initialEnergy,
          angle: 0,
          up: true,
          position: new Vector2( proposedPosition.x, 0 ),
          stepsSinceJump: 0
        } );
      }
      else {
        return skaterState.update( {
          velocity: proposedVelocity,
          position: new Vector2( proposedPosition.x, y ),
          stepsSinceJump: skaterState.stepsSinceJump + 1
        } );
      }
    },

    /**
     * Gets the net force discluding normal force.
     *
     * @param {SkaterState} skaterState the state
     * @param {Vector2} netForce the return value, should be allocated beforehand using Vector2.createFromPool.
     * @returns {Vector2} netForce
     */
    getNetForceWithoutNormal: function( skaterState, netForce ) {
      netForce.addXY( 0, skaterState.mass * skaterState.gravity );//gravity
      netForce.add( this.getFrictionForce( skaterState ) );
      return netForce;
    },

    //TODO: Friction force should not exceed sum of other forces (in the direction of motion), otherwise the friction could start a stopped object moving
    //The only other force on the object in the direction of motion is the gravity force
    getFrictionForce: function( skaterState ) {
      if ( this.friction === 0 || skaterState.velocity.magnitude() < 1E-2 ) {
        return Vector2.ZERO;
      }
      else {
        var magnitude = this.friction * this.getNormalForce( skaterState ).magnitude();
        return Vector2.createPolar( magnitude, skaterState.velocity.angle() + Math.PI );
      }
    },

    //Get the normal force (Newtons) on the skater
    getNormalForce: function( skaterState ) {
      var curvature = skaterState.getCurvature();
      if ( curvature < 0 ) {
        console.log( 'curvature was less than zero, therefore the straight line code below must be changed' );
      }
      var radiusOfCurvature = Math.min( curvature.r, 100000 );
      var netForceRadial = new Vector2();

      netForceRadial.addXY( 0, skaterState.mass * skaterState.gravity );//gravity
      var curvatureDirection = this.getCurvatureDirection( curvature, skaterState.position.x, skaterState.position.y );
      var normalForce = skaterState.mass * skaterState.velocity.magnitudeSquared() / Math.abs( radiusOfCurvature ) - netForceRadial.dot( curvatureDirection );
      debug.log( normalForce );
      return Vector2.createPolar( normalForce, curvatureDirection.angle() );
    },

    //Use an Euler integration step to move the skater along the track
    stepEuler: function( dt, skaterState ) {
      var track = skaterState.track;
      var origEnergy = skaterState.getTotalEnergy();
      var origLoc = skaterState.position;
      var thermalEnergy = skaterState.thermalEnergy;
      var uD = skaterState.uD;
      var u = skaterState.u;

      var netForce = this.getNetForceWithoutNormal( skaterState, Vector2.createFromPool( 0, 0 ) );

      //Get the net force in the direction of the track.  Dot product is a * b * cos(theta)
      var a = netForce.magnitude() * Math.cos( skaterState.track.getModelAngleAt( u ) - netForce.angle() ) / skaterState.mass;
      netForce.freeToPool();

      uD += a * dt;
      u += track.getParametricDistance( u, uD * dt + 1 / 2 * a * dt * dt );
      var newPoint = skaterState.track.getPoint( u );
      var newState = skaterState.update( {
        u: u,
        uD: uD,

        //choose velocity by using the unit parallel vector to the track
        velocity: skaterState.track.getUnitParallelVector( u ).multiplyScalar( uD ),
        position: newPoint
      } );
      if ( this.friction > 0 ) {
        var frictionForce = this.getFrictionForce( skaterState );
        var therm = frictionForce.magnitude() * newPoint.distance( origLoc );
        thermalEnergy += therm;

        var newTotalEnergy = newState.getTotalEnergy() + therm;

        //Conserve energy, but only if the user is not adding energy
        if ( thrust.magnitude() === 0 ) {
          if ( newTotalEnergy < origEnergy ) {
            thermalEnergy += Math.abs( newTotalEnergy - origEnergy );//add some thermal to exactly match
            if ( Math.abs( newTotalEnergy - origEnergy ) > 1E-6 ) {
              debug.log( "Added thermal, dE=" + ( newState.getTotalEnergy() - origEnergy ) );
            }
          }
          if ( newTotalEnergy > origEnergy ) {
            if ( Math.abs( newTotalEnergy - origEnergy ) < therm ) {
              debug.log( "gained energy, removing thermal (Would have to remove more than we gained)" );
            }
            else {
              thermalEnergy -= Math.abs( newTotalEnergy - origEnergy );
              if ( Math.abs( newTotalEnergy - origEnergy ) > 1E-6 ) {
                debug.log( "Removed thermal, dE=" + ( newTotalEnergy - origEnergy ) );
              }
            }
          }
        }

        //Discrepancy with original version: original version allowed drop of thermal energy here, to be fixed in the heuristic patch
        //We have clamped it here to make it amenable to a smaller number of euler updates, to improve performance
        return newState.update( {thermalEnergy: Math.max( thermalEnergy, skaterState.thermalEnergy )} );
      }
      else {
        return newState;
      }
    },

    //Update the skater as it moves along the track, and fly off the track if it goes over a jump or off the end of the track
    stepTrack: function( dt, skaterState ) {

      var curvature = skaterState.getCurvature();
      var curvatureDirection = this.getCurvatureDirection( curvature, skaterState.position.x, skaterState.position.y );

      var track = skaterState.track;
      var sideVector = skaterState.up ? track.getUnitNormalVector( skaterState.u ) :
                       track.getUnitNormalVector( skaterState.u ).timesScalar( -1 );
      var outsideCircle = sideVector.dot( curvatureDirection ) < 0;

      //compare a to v/r^2 to see if it leaves the track
      var r = Math.abs( curvature.r );
      var centripForce = skaterState.mass * skaterState.uD * skaterState.uD / r;

      var netForce = Vector2.createFromPool( 0, 0 );
      var netForceRadial = this.getNetForceWithoutNormal( skaterState, netForce ).dot( curvatureDirection );
      netForce.freeToPool();

      var leaveTrack = (netForceRadial < centripForce && outsideCircle) || (netForceRadial > centripForce && !outsideCircle);
      if ( leaveTrack && this.detachable ) {

        //Leave the track.  Make sure the velocity is pointing away from the track or keep track of frames away from the track so it doesn't immediately recollide
        //Or project a ray and see if a collision is imminent
        var freeSkater = skaterState.update( {
          track: null,
          uD: 0,

          //Keep track of the steps since jumping, otherwise it can run into the track again immediately, which increases thermal energy
          stepsSinceJump: 0
        } );

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
        newState = this.correctEnergy( skaterState, newState );

        //Fly off the left or right side of the track
        if ( skaterState.track.isParameterInBounds( newState.u ) ) {
          return newState;
        }
        else {
          return skaterState.update( {
            track: null,
            uD: 0,
            stepsSinceJump: 0
          } );
        }
      }
    },

    //Try to match the target energy by reducing the velocity of the skaterState
    correctEnergyReduceVelocity: function( skaterState, targetState ) {

      //Make a clone we can mutate and return, to protect the input argument
      var newSkaterState = targetState.update( {} );
      var e0 = skaterState.getTotalEnergy();
      var mass = skaterState.mass;
      var unit = newSkaterState.track.getUnitParallelVector( newSkaterState.u );

      //Binary search, but bail after too many iterations
      for ( var i = 0; i < 100; i++ ) {
        var dv = ( newSkaterState.getTotalEnergy() - e0 ) / ( mass * newSkaterState.uD );

        var newVelocity = newSkaterState.uD - dv;

        //We can just set the state directly instead of calling update since we are keeping a protected clone of the newSkaterState
        newSkaterState.uD = newVelocity;
        newSkaterState.velocity = unit.times( newVelocity );

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
      var bestDE = skaterState.update( {position: skaterState.track.getPoint( bestAlpha )} ).getTotalEnergy();
      for ( var i = 0; i < numSteps; i++ ) {
        var proposedAlpha = u0 + da * i;
        var e = skaterState.update( {position: skaterState.track.getPoint( bestAlpha )} ).getTotalEnergy();
        if ( Math.abs( e - e0 ) <= Math.abs( bestDE ) ) {
          bestDE = e - e0;
          bestAlpha = proposedAlpha;
        }//continue to find best value closest to proposed u, even if several values give dE=0.0
      }
      debug.log( "After " + numSteps + " steps, origAlpha=" + u0 + ", bestAlpha=" + bestAlpha + ", dE=" + bestDE );
      return bestAlpha;
    },

    //A number of heuristic energy correction steps to ensure energy is conserved while keeping the motion smooth and accurate
    correctEnergy: function( skaterState, newState ) {
      var u0 = skaterState.u;
      var e0 = skaterState.getTotalEnergy();

      if ( isNaN( newState.getTotalEnergy() ) ) { throw new Error( 'nan' );}
      var dE = newState.getTotalEnergy() - e0;
      if ( Math.abs( dE ) < 1E-6 ) {
        //small enough
        return newState;
      }
      else {
        if ( newState.getTotalEnergy() > e0 ) {
          debug.log( "Energy too high" );

          //can we reduce the velocity enough?
          if ( Math.abs( newState.getKineticEnergy() ) > Math.abs( dE ) ) {//amount we could reduce the energy if we deleted all the kinetic energy:

            //TODO: maybe should only do this if all velocity is not converted
            debug.log( "Could fix all energy by changing velocity." );
            var correctedStateA = this.correctEnergyReduceVelocity( skaterState, newState );
            debug.log( "changed velocity: dE=" + ( correctedStateA.getTotalEnergy() - e0 ) );
            if ( !isApproxEqual( e0, correctedStateA.getTotalEnergy(), 1E-8 ) ) {
              debug.log( "Energy error[0]" );
            }
            return correctedStateA;
          }
          else {
            debug.log( "Not enough KE to fix with velocity alone: normal:" );
            debug.log( "changed position u: dE=" + ( newState.getTotalEnergy() - e0 ) );
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

            var correctedState = newState.update( {
              u: bestAlpha,
              position: newState.track.getPoint( bestAlpha )
            } );
            debug.log( "changed position u: dE=" + ( correctedState.getTotalEnergy() - e0 ) );
            if ( !isApproxEqual( e0, correctedState.getTotalEnergy(), 1E-8 ) ) {
              if ( Math.abs( correctedState.getKineticEnergy() ) > Math.abs( dE ) ) {//amount we could reduce the energy if we deleted all the kinetic energy:

                //TODO: maybe should only do this if all velocity is not converted
                debug.log( "Fixed position some, still need to fix velocity as well." );
                var correctedState2 = this.correctEnergyReduceVelocity( skaterState, correctedState );
                if ( !isApproxEqual( e0, correctedState2.getTotalEnergy(), 1E-8 ) ) {
                  debug.log( "Changed position & Velocity and still had energy error" );
                  debug.log( "Energy error[123]" );
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
          if ( isNaN( newState.getTotalEnergy() ) ) { throw new Error( 'nan' );}
          debug.log( "Energy too low" );

          //increasing the kinetic energy
          //Choose the exact velocity in the same direction as current velocity to ensure total energy conserved.
          var vSq = Math.abs( 2 / newState.mass * ( e0 - newState.getPotentialEnergy() - newState.thermalEnergy ) );
          var v = Math.sqrt( vSq );
          var newVelocity = v * getSign( newState.uD );
          var fixedState = newState.update( {
            uD: newVelocity,
            velocity: newState.track.getUnitParallelVector( newState.u ).multiplyScalar( newVelocity )
          } );
          debug.log( "Set velocity to match energy, when energy was low: " );
          debug.log( "INC changed velocity: dE=" + ( fixedState.getTotalEnergy() - e0 ) );
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

    //Update the skater based on which state it is in
    stepModel: function( dt, skaterState ) {
      return skaterState.dragging ? skaterState : //User is dragging the skater, nothing to update here
             !skaterState.track && skaterState.position.y <= 0 ? this.stepGround( dt, skaterState ) :
             !skaterState.track && skaterState.position.y > 0 ? this.stepFreeFall( dt, skaterState ) :
             skaterState.track ? this.stepTrack( dt, skaterState ) :
             skaterState;
    },

    //Return to the place he was last released by the user.  Also restores the track the skater was on so the initial conditions are the same as the previous release
    returnSkater: function() {
      if ( this.skater.startingTrack && this.skater.startingTrack.scene !== undefined ) {
        this.scene = this.skater.startingTrack.scene;
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

        this.tracks.remove( this.getNonPhysicalTracks()[0] );
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
      this.tracks.remove( a );
      this.tracks.remove( b );
      this.tracks.add( newTrack );

      //Move skater to new track if he was on the old track, by searching for the best fit point on the new track
      //Note: Energy is not conserved when tracks joined since the user has added or removed energy from the system
      if ( this.skater.track === a || this.skater.track === b ) {

        //Keep track of the skater direction so we can toggle the 'up' flag if the track orientation changed
        var originalNormal = this.skater.upVector;
        var p = newTrack.getClosestPositionAndParameter( this.skater.position );
        this.skater.track = newTrack;
        this.skater.u = p.u;
        var x2 = newTrack.getX( p.u );
        var y2 = newTrack.getY( p.u );
        this.skater.position = new Vector2( x2, y2 );
        this.skater.angle = newTrack.getViewAngleAt( p.u ) + (this.skater.up ? 0 : Math.PI);
        var newNormal = this.skater.upVector;

        //If the skater flipped upside down because the track directionality is different, toggle his 'up' flag
        if ( originalNormal.dot( newNormal ) < 0 ) {
          this.skater.up = !this.skater.up;
          this.skater.angle = newTrack.getViewAngleAt( p.u ) + (this.skater.up ? 0 : Math.PI);
        }
        this.skater.trigger( 'updated' );
      }
    },

    //Bindings to PropertySet
    getState: function() {
      return {
        properties: this.get(),
        skater: this.skater.getState( this.tracks ),
        tracks: this.tracks.getArray().map( function( track ) {
          return {physical: track.physical, points: track.controlPoints.map( function( controlPoint ) { return controlPoint.sourcePosition; } )};
        } )
      };
    },

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