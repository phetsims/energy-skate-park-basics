// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the Energy Skate Park: Basics sim, including model values for the view settings, such as whether the grid is visible.
 * All units are in metric.
 *
 * The step functions focus on making computations up front and applying changes to the skater at the end of each method, to
 * simplify the logic and make it communicate with the Axon+View as little as possible (for performance reasons).
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Skater = require( 'ENERGY_SKATE_PARK_BASICS/model/Skater' );
  var Track = require( 'ENERGY_SKATE_PARK_BASICS/model/Track' );
  var ControlPoint = require( 'ENERGY_SKATE_PARK_BASICS/model/ControlPoint' );
  var circularRegression = require( 'ENERGY_SKATE_PARK_BASICS/model/circularRegression' );
  var Vector2 = require( 'DOT/Vector2' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var SkaterState = require( 'ENERGY_SKATE_PARK_BASICS/model/SkaterState' );
  var Util = require( 'DOT/Util' );
  var Particle1D = require( 'ENERGY_SKATE_PARK_BASICS/model/Particle1D' );

  var thrust = new Vector2();

  function isApproxEqual( a, b, tolerance ) { return Math.abs( a - b ) <= tolerance; }

  function getSign( a ) {return a > 0 ? +1 : -1;}

  var debugLogEnabled = false;
  var debug = {log: debugLogEnabled ? function( string ) { console.log( string ); } : function( string ) {}};

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

    //Flag for debugging whether the circular regression steps should be shown
    this.showCircularRegression = false;
    var model = this;
    PropertySet.call( this, {

      //For debugging the circular regression
      circularRegression: {},
      pieChartVisible: false,
      barGraphVisible: false,
      gridVisible: false,
      speedometerVisible: false,
      paused: false,

      //speed of the model, either 'normal' or 'slow'
      speed: 'normal',

      friction: frictionAllowed ? 0.2 : 0,
      stickToTrack: true
    } );
    this.skater = new Skater();
    this.tracks = new ObservableArray();

    if ( !draggableTracks ) {

      //For screens 1-2, the index of the selected scene (and track) within the screen
      this.addProperty( 'scene', 0 );
      var parabola = [new Vector2( -4, 6 ), new Vector2( 0, 0 ), new Vector2( 4, 6 )];
      var slope = [new Vector2( -4, 4 ), new Vector2( -2, 2 ), new Vector2( 2, 1 )];

      //Move the left well up a bit since the interpolation moves it down by that much, and we don't want the skater to go to y<0 while on the track
      var doubleWell = [new Vector2( -4, 5 ), new Vector2( -2, 0.0166015 ), new Vector2( 0, 2 ), new Vector2( 2, 1 ), new Vector2( 4, 5 ) ];
      var toControlPoint = function( pt ) {return new ControlPoint( pt.x, pt.y );};
      this.tracks.addAll( [
        new Track( this.tracks, _.map( parabola, toControlPoint ), false ),
        new Track( this.tracks, _.map( slope, toControlPoint ), false ),
        new Track( this.tracks, _.map( doubleWell, toControlPoint ), false )] );

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

    this.bounces = 0;
  }

  return inherit( PropertySet, EnergySkateParkBasicsModel, {

    addDraggableTracks: function() {
      for ( var i = 0; i < 4; i++ ) {
        //Move the tracks over so they will be in the right position in the view coordinates, under the grass to the left of the clock controls
        //Could use view transform for this, but it would require creating the view first, so just eyeballing it for now.
        var offset = new Vector2( -5.5, -0.8 );
        var a = new Vector2( -1, 0 ).plus( offset );
        var b = new Vector2( 0, 0 ).plus( offset );
        var c = new Vector2( 1, 0 ).plus( offset );
        var controlPoints = [ new ControlPoint( a.x, a.y ), new ControlPoint( b.x, b.y ), new ControlPoint( c.x, c.y )];
        this.tracks.add( new Track( this.tracks, controlPoints, true ) );
      }
    },
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.skater.reset();

      //For the first two screens, make the default track physical
      if ( this.draggableTracks ) {
        this.tracks.clear();
        this.addDraggableTracks();
      }
    },

    //See http://digitalcommons.calpoly.edu/cgi/viewcontent.cgi?article=1387&context=phy_fac
    //Computational problems in introductory physics: Lessons from a bead on a wire
    //Thomas J. Bensky and Matthew J. Moelter
    uDD: function( uD, xP, xPP, yP, yPP, g ) {
      return -1 * (uD * uD * (xP * xPP + yP * yPP) - g * yP) / (xP * xP + yP * yP);
    },
    manualStep: function() {
      //step one frame, assuming 60fps
      var result = this.stepModel( 1.0 / 60, new SkaterState( this.skater, {} ) );
      result.setToSkater( this.skater );
    },

    //Step the model, automatically called from Joist
    step: function( dt ) {
      //If the delay makes dt too high, then truncate it.  This helps e.g. when clicking in the address bar on ipad, which gives a huge dt and problems for integration
      if ( !this.paused && !this.skater.dragging ) {

        //If they switched windows or tabs, just bail on that delta
        if ( dt > 1 || dt <= 0 ) {
          dt = 1.0 / 60.0;
        }

        //dt has to run at 1/55.0 or less or we will have numerical problems in the integration

        var error = 100000;
        var numDivisions = 1;
        var skaterState = null;
        while ( error > 1E-6 && numDivisions <= 2 ) {

          skaterState = new SkaterState( this.skater, {} );
          var initialEnergy = skaterState.getTotalEnergy();
          for ( var i = 0; i < numDivisions; i++ ) {
            skaterState = this.stepModel( this.speed === 'normal' ? dt / numDivisions : dt / numDivisions * 0.25, skaterState );
          }

          var finalEnergy = skaterState.getTotalEnergy();
          error = Math.abs( finalEnergy - initialEnergy );
          if ( error > 1E-6 ) {
//            debugger;
          }
          if ( numDivisions >= 30 ) {
            console.log( 'numDivisions', numDivisions, 'dt', dt / numDivisions, 'error', error );
          }
          numDivisions = numDivisions * 2;
        }
        skaterState.setToSkater( this.skater );
      }
    },

    stepGround: function( dt, skaterState ) {
      return skaterState;
    },

    //Update the skater in free fall
    stepFreeFall: function( dt, skaterState ) {
      var initialEnergy = skaterState.getTotalEnergy();
      var netForce = new Vector2( 0, skaterState.gravity * skaterState.mass );

      var acceleration = netForce.times( 1.0 / skaterState.mass );
      var proposedVelocity = skaterState.velocity.plus( acceleration.times( dt ) );
      var proposedPosition = skaterState.position.plus( proposedVelocity.times( dt ) );
      if ( proposedPosition.y < 0 ) {
        proposedPosition.y = 0;

        //TODO: Make sure the skater doesn't flip upside down when landing on the ground, see https://github.com/phetsims/energy-skate-park-basics/issues/1
        return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity );
      }
      else if ( skaterState.position.x !== proposedPosition.x || skaterState.position.y !== proposedPosition.y ) {

        //see if it crossed the track
        var physicalTracks = this.getPhysicalTracks();
        if ( physicalTracks.length ) {
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
      var closestDistance = null;
      var closestMatch = null;
      for ( var i = 0; i < physicalTracks.length; i++ ) {
        var track = physicalTracks[i];

        //PERFORMANCE/ALLOCATION maybe get closest point shouldn't return a new object allocation each time, or use pooling for it, or pass in reference as an arg?
        var bestMatch = track.getClosestPositionAndParameter( position );
        if ( closestDistance === null || bestMatch.distance < closestDistance ) {
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
      var pt = closestTrackAndPositionAndParameter.point;

      if ( !track.isParameterInBounds( u ) ) {
        return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity );
      }
      var normal = track.getUnitNormalVector( u );
      var segment = normal.perpendicular();

      var beforeSign = normal.dot( skaterState.position.minus( pt ) ) > 0;
      var afterSign = normal.dot( proposedPosition.minus( pt ) ) > 0;
      if ( beforeSign !== afterSign ) {

        //reflect the velocity vector
        //http://www.gamedev.net/topic/165537-2d-vector-reflection-/

        //Possible heisenbug workaround
        var allOK = proposedVelocity && proposedVelocity.minus && normal.times && normal.dot;

        var bounceVelocity = allOK ? proposedVelocity.minus( normal.times( 2 * normal.dot( proposedVelocity ) ) ) : new Vector2( 0, 1 );

        //Attach to track if velocity is close enough to parallel to the track
        var normalized = proposedVelocity.normalized();
        var dot = normalized.dot( segment );

        //If friction is allowed, then bounce with elasticity <1.
        //If friction is not allowed, then bounce with elasticity = 1.
        if ( Math.abs( dot ) < 0.4 ) {
          this.bounces++;
          return skaterState.update( {velocity: bounceVelocity} );
        }
        else {
//          debugger;
          //If friction is allowed, keep the parallel component of velocity.
          //If friction is not allowed, then either attach to the track with no change in speed

          var uD = (dot > 0 ? +1 : -1) * proposedVelocity.magnitude();

          //TODO: gain some thermal energy in the landing, but not too much!
          var newThermalEnergy = skaterState.thermalEnergy;
          var result = skaterState.update( {
            thermalEnergy: newThermalEnergy,
            track: track,
            u: u,
            uD: uD,
            velocity: proposedVelocity,
            position: track.getPoint( u )
          } );

          return this.correctEnergyReduceVelocity( skaterState, result );
        }
      }

      //It just continued in free fall
      else {
        return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity );
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
          position: new Vector2( proposedPosition.x, 0 )
        } );
      }
      else {
        return skaterState.update( {
          velocity: proposedVelocity,
          position: new Vector2( proposedPosition.x, y )
        } );
      }
    },

    getNetForce: function( skaterState ) {
      var netForce = new Vector2();
      netForce.addXY( 0, skaterState.mass * skaterState.gravity );//gravity
      netForce.add( this.getFrictionForce( skaterState ) );
      return netForce;
    },

    getFrictionForce: function( skaterState ) {
      if ( this.friction === 0 || skaterState.velocity.magnitude() < 1E-2 ) {
        return new Vector2();
      }
      else {
        var magnitude = this.friction * this.getNormalForce( skaterState ).magnitude();
        return Vector2.createPolar( magnitude, skaterState.velocity.angle() + Math.PI );
      }
    },

    getCurvature: function( skaterState ) {
      var track = skaterState.track;
      var curvature = circularRegression( [
        new Vector2( track.getX( skaterState.u ), track.getY( skaterState.u ) ),
        new Vector2( track.getX( skaterState.u - 1E-6 ), track.getY( skaterState.u - 1E-6 ) ),
        new Vector2( track.getX( skaterState.u + 1E-6 ), track.getY( skaterState.u + 1E-6 ) )] );
      return curvature;
    },

    //todo: store the radius of curvature on the skaterState, only recompute if undefined
    getNormalForce: function( skaterState ) {
      var curvature = this.getCurvature( skaterState );
      if ( curvature < 0 ) {
        console.log( 'curvature was less than zero, therefore the straight line code below must be changed' );
      }
      var radiusOfCurvature = Math.min( curvature.r, 100000 );
      var netForceRadial = new Vector2();

      var normalForce;
      netForceRadial.addXY( 0, skaterState.mass * skaterState.gravity );//gravity
//        netForceRadial.add( new MutableVector2D( xThrust * mass, yThrust * mass ) );//thrust
      var curvatureDirection = this.getCurvatureDirection( curvature, skaterState.position.x, skaterState.position.y );
      normalForce = skaterState.mass * skaterState.velocity.magnitudeSquared() / Math.abs( radiusOfCurvature ) - netForceRadial.dot( curvatureDirection );
      debug.log( normalForce );
      return Vector2.createPolar( normalForce, curvatureDirection.angle() );
    },

    updateEuler: function( dt, skaterState ) {
      var track = skaterState.track;
      var origEnergy = skaterState.getTotalEnergy();
      var origLoc = skaterState.position;
      var netForce = this.getNetForce( skaterState );
      var thermalEnergy = skaterState.thermalEnergy;
      var velocity = skaterState.uD;
      var alpha = skaterState.u;
      var a = skaterState.track.getUnitParallelVector( alpha ).dot( netForce ) / skaterState.mass;
      velocity += a * dt;
      alpha += track.getFractionalDistance( alpha, velocity * dt + 1 / 2 * a * dt * dt );
      var newPoint = skaterState.track.getPoint( alpha );
      var newState = skaterState.update( {
        u: alpha,
        uD: velocity,
        velocity: new Vector2( (newPoint.x - skaterState.position.x) / dt, (newPoint.y - skaterState.position.y) / dt ),
        position: newPoint
      } );
      if ( this.friction > 0 ) {
        var frictionForce = this.getFrictionForce( skaterState );
        var therm = frictionForce.magnitude() * newPoint.distance( origLoc );
        thermalEnergy += therm;
        if ( thrust.magnitude() === 0 ) {//only conserve energy if the user is not adding energy
          if ( newState.getTotalEnergy() < origEnergy ) {
            thermalEnergy += Math.abs( newState.getTotalEnergy() - origEnergy );//add some thermal to exactly match
            if ( Math.abs( newState.getTotalEnergy() - origEnergy ) > 1E-6 ) {
              debug.log( "Added thermal, dE=" + ( newState.getTotalEnergy() - origEnergy ) );
            }
          }
          if ( newState.getTotalEnergy() > origEnergy ) {
            if ( Math.abs( newState.getTotalEnergy() - origEnergy ) < therm ) {
              debug.log( "gained energy, removing thermal (Would have to remove more than we gained)" );
            }
            else {
              var editThermal = Math.abs( newState.getTotalEnergy() - origEnergy );
              thermalEnergy -= editThermal;
              if ( Math.abs( newState.getTotalEnergy() - origEnergy ) > 1E-6 ) {
                debug.log( "Removed thermal, dE=" + ( newState.getTotalEnergy() - origEnergy ) );
              }
            }
          }
        }
        return newState.update( {thermalEnergy: thermalEnergy} );
      }
      else {
        return newState;
      }
      //TODO: Error checking
//      if ( ( isNaN( getKineticEnergy() ) ) ) { throw new IllegalArgumentException();}
//      if ( ( isInfinite( getKineticEnergy() ) ) ) { throw new IllegalArgumentException();}
//      if ( ( isNaN( getVelocity2D().magnitude() ) ) ) { throw new IllegalArgumentException();}
//      handleBoundary();
    },

    //TODO: Reduce garbage collection and improve performance
    stepTrack: function( dt, skaterState ) {

      var particle1D = new Particle1D( skaterState );

      //From Particle1DUpdate
      var sideVector = particle1D.getSideVector();
      var outsideCircle = sideVector.dot( particle1D.getCurvatureDirection() ) < 0;

      //compare a to v/r^2 to see if it leaves the track
      var r = Math.abs( particle1D.getRadiusOfCurvature() );
      var centripForce = skaterState.mass * particle1D.getSpeed() * particle1D.getSpeed() / r;
      var netForceRadial = this.getNetForce( skaterState ).dot( particle1D.getCurvatureDirection() );

      var leaveTrack = false;
      if ( netForceRadial < centripForce && outsideCircle ) {
        leaveTrack = true;
      }
      if ( netForceRadial > centripForce && !outsideCircle ) {
        leaveTrack = true;
      }
      if ( leaveTrack && !this.stickToTrack ) {

        //TODO: Step after switching to free fall?
        return skaterState.update( {
          track: null,
          uD: 0
        } );
      }
      else {
        var newState = skaterState;
        for ( var i = 0; i < 10; i++ ) {
          newState = this.updateEuler( dt / 10, newState );
        }

        //Correct energy
        newState = this.correctEnergy( skaterState, newState );

        //Fly off the left or right side of the track
        if ( !skaterState.track.isParameterInBounds( newState.u ) ) {
          return skaterState.update( {
            track: null,
            uD: 0
          } );
        }
        return newState;
      }
    },

    correctEnergyReduceVelocity: function( skaterState, newSkaterState ) {
      var e0 = skaterState.getTotalEnergy();
      var mass = skaterState.mass;

      for ( var i = 0; i < 100; i++ ) {
        var dv = ( newSkaterState.getTotalEnergy() - e0 ) / ( mass * newSkaterState.uD );

        //TODO: Could be much faster
        var newVelocity = newSkaterState.uD - dv;
        newSkaterState = newSkaterState.update( {
          uD: newVelocity,
          velocity: newSkaterState.track.getUnitParallelVector( newSkaterState.u ).normalized().times( newVelocity )
        } );
        if ( isApproxEqual( e0, newSkaterState.getTotalEnergy(), 1E-8 ) ) {
          break;
        }
      }
      return newSkaterState;
    },

    searchAlpha: function( skaterState, alpha0, alpha1, e0, numSteps ) {
      var da = ( alpha1 - alpha0 ) / numSteps;
      var bestAlpha = ( alpha1 - alpha0 ) / 2;
      var bestDE = skaterState.update( {position: skaterState.track.getPoint( bestAlpha )} ).getTotalEnergy();
      for ( var i = 0; i < numSteps; i++ ) {
        var proposedAlpha = alpha0 + da * i;
        var e = skaterState.update( {position: skaterState.track.getPoint( bestAlpha )} ).getTotalEnergy();
        if ( Math.abs( e - e0 ) <= Math.abs( bestDE ) ) {
          bestDE = e - e0;
          bestAlpha = proposedAlpha;
        }//continue to find best value closest to proposed alpha, even if several values give dE=0.0
      }
      debug.log( "After " + numSteps + " steps, origAlpha=" + alpha0 + ", bestAlpha=" + bestAlpha + ", dE=" + bestDE );
      return bestAlpha;
    },

    correctEnergy: function( skaterState, newState ) {
      var alpha0 = skaterState.u;
      var e0 = skaterState.getTotalEnergy();

      if ( isNaN( newState.getTotalEnergy() ) ) { throw new Error( 'nan' );}
      var dE = newState.getTotalEnergy() - e0;
      if ( Math.abs( dE ) < 1E-6 ) {
        //small enough
      }
      if ( newState.getTotalEnergy() > e0 ) {
        debug.log( "Energy too high" );
        //can we reduce the velocity enough?
        if ( Math.abs( newState.getKineticEnergy() ) > Math.abs( dE ) ) {//amount we could reduce the energy if we deleted all the kinetic energy:
          debug.log( "Could fix all energy by changing velocity." );//todo: maybe should only do this if all velocity is not converted
          var correctedStateA = this.correctEnergyReduceVelocity( skaterState, newState );
          debug.log( "changed velocity: dE=" + ( correctedStateA.getTotalEnergy() - e0 ) );
          if ( !isApproxEqual( e0, correctedStateA.getTotalEnergy(), 1E-8 ) ) {
            debug.log( "Energy error[0]" );
          }
          return correctedStateA;
        }
        else {
          debug.log( "Not enough KE to fix with velocity alone: normal:" );
          debug.log( "changed position alpha: dE=" + ( newState.getTotalEnergy() - e0 ) );
          //search for a place between alpha and alpha0 with a better energy

          var numRecursiveSearches = 10;
          var alpha = newState.u;
          var bestAlpha = ( alpha + alpha0 ) / 2.0;
          var da = ( alpha - alpha0 ) / 2;
          for ( var i = 0; i < numRecursiveSearches; i++ ) {
            var numSteps = 10;
            bestAlpha = this.searchAlpha( newState, bestAlpha - da, bestAlpha + da, e0, numSteps );
            da = ( ( bestAlpha - da ) - ( bestAlpha + da ) ) / numSteps;
          }

          var correctedState = newState.update( {
            u: bestAlpha,
            position: newState.track.getPoint( bestAlpha )
          } );
          debug.log( "changed position alpha: dE=" + ( correctedState.getTotalEnergy() - e0 ) );
          if ( !isApproxEqual( e0, correctedState.getTotalEnergy(), 1E-8 ) ) {
            if ( Math.abs( correctedState.getKineticEnergy() ) > Math.abs( dE ) ) {//amount we could reduce the energy if we deleted all the kinetic energy:
              debug.log( "Fixed position some, still need to fix velocity as well." );//todo: maybe should only do this if all velocity is not converted
              var correctedState2 = this.correctEnergyReduceVelocity( skaterState, correctedState );
              if ( !isApproxEqual( e0, correctedState2.getTotalEnergy(), 1E-8 ) ) {
                debug.log( "Changed position & Velocity and still had energy error" );
                debug.log( "Energy error[123]" );
              }
              return correctedState2;
            }
            else {

              //TODO: removed this logging output, but this case can still occur, especially with friction turned on
              debug.log( "Changed position, wanted to change velocity, but didn't have enough to fix it..., dE=" + ( newState.getTotalEnergy() - e0 ) );
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
          velocity: newState.track.getUnitParallelVector( newState.u ).normalized().times( newVelocity )
        } );
        debug.log( "Set velocity to match energy, when energy was low: " );
        debug.log( "INC changed velocity: dE=" + ( fixedState.getTotalEnergy() - e0 ) );
        if ( !isApproxEqual( e0, fixedState.getTotalEnergy(), 1E-8 ) ) {
          new Error( "Energy error[2]" ).printStackTrace();
        }
        return fixedState;
      }
    },

    //PERFORMANCE/ALLOCATION
    getCurvatureDirection: function( curvature, x2, y2 ) {
      return new Vector2( curvature.x - x2, curvature.y - y2 ).normalized();
    },

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
    },

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

      var newTrack = new Track( this.tracks, points, true, a.getParentsOrSelf().concat( b.getParentsOrSelf() ) );
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
        this.skater.angle = newTrack.getViewAngleAt( p.u );
        var newNormal = this.skater.upVector;

        //If the skater flipped upside down because the track directionality is different, toggle his 'up' flag
        if ( originalNormal.dot( newNormal ) < 0 ) {
          this.skater.up = !this.skater.up;
        }
      }
    }
  } );
} );