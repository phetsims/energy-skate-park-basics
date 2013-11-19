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
    }

    this.bounces = 0;
  }

  return inherit( PropertySet, EnergySkateParkBasicsModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.skater.reset();
      for ( var i = 0; i < this.tracks.length; i++ ) {
        this.tracks.get( i ).reset();
      }

      //For the first two screens, make the default track physical
      if ( !this.draggableTracks ) {
        this.tracks.get( 0 ).physical = true;
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
      if ( !this.paused ) {

        //If they switched windows or tabs, just bail on that delta
        if ( dt > 1 || dt <= 0 ) {
          dt = 1.0 / 60.0;
        }

        //dt has to run at 1/55.0 or less or we will have numerical problems in the integration

        var error = 100000;
        var numDivisions = 1;
        while ( error > 1000 && numDivisions < 100 ) {

          var skaterState = new SkaterState( this.skater, {} );
          var initialEnergy = skaterState.getTotalEnergy();
          for ( var i = 0; i < numDivisions; i++ ) {
            skaterState = this.stepModel( this.speed === 'normal' ? dt / numDivisions : dt / numDivisions * 0.25, skaterState );
          }

          var finalEnergy = skaterState.getTotalEnergy();
          error = Math.abs( finalEnergy - initialEnergy );
          if ( numDivisions > 5 ) {
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
      var initialEnergy = skaterState.totalEnergy;
      var netForce = new Vector2( 0, -9.8 * skaterState.mass );

      var acceleration = netForce.times( 1.0 / skaterState.mass );
      var proposedVelocity = skaterState.velocity.plus( acceleration.times( dt ) );
      var proposedPosition = skaterState.position.plus( proposedVelocity.times( dt ) );
      if ( proposedPosition.y < 0 ) {
        proposedPosition.y = 0;

        //Make sure the skater doesn't flip upside down when landing on the ground, see https://github.com/phetsims/energy-skate-park-basics/issues/14
        return new SkaterState( skaterState, {
          up: true,
          position: proposedPosition,
          velocity: new Vector2()
        } );
      }
      if ( skaterState.position.x !== proposedPosition.x || skaterState.position.y !== proposedPosition.y ) {

        //see if it crossed the track
        var physicalTracks = this.getPhysicalTracks();
        if ( physicalTracks.length ) {
          return this.interactWithTracksWhileFalling( physicalTracks, skaterState, proposedPosition, initialEnergy, dt, proposedVelocity );
        }
        else {
          return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity );
        }
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

      if ( !track.isParameterInBounds( u ) ) {
        return this.continueFreeFall( skaterState, initialEnergy, proposedPosition, proposedVelocity );
      }
      var t1 = u - 1E-6;
      var t2 = u + 1E-6;
      var pt = closestTrackAndPositionAndParameter.point;
      var pt1 = track.getPoint( t1 );
      var pt2 = track.getPoint( t2 );
      var segment = pt2.minus( pt1 ).normalized();
      var normal = segment.rotated( Math.PI / 2 );

      var beforeSign = normal.dot( skaterState.position.minus( pt ) ) > 0;
      var afterSign = normal.dot( proposedPosition.minus( pt ) ) > 0;
      if ( beforeSign !== afterSign ) {

        //reflect the velocity vector
        //http://www.gamedev.net/topic/165537-2d-vector-reflection-/
        var allOK = proposedVelocity && proposedVelocity.minus && normal.times && normal.dot;
//        if ( !allOK ) { alert( 'allOK === false' ); }
        var bounceVelocity = allOK ? proposedVelocity.minus( normal.times( 2 * normal.dot( proposedVelocity ) ) ) :
                             new Vector2( 0, 1 );

        //Attach to track if velocity is close enough to parallel to the track
        var dot = Math.abs( proposedVelocity.normalized().dot( segment ) );

        //If friction is allowed, then bounce with elasticity <1.
        //If friction is not allowed, then bounce with elasticity = 1.
        if ( dot < 0.4 ) {
          this.bounces++;

          return new SkaterState( skaterState, {
            velocity: bounceVelocity
          } );
        }
        else {
          //If friction is allowed, keep the parallel component of velocity.
          //If friction is not allowed, then either attach to the track with no change in speed

          //Estimate u dot from equations (8) & (9) in the paper
          var uDx = proposedVelocity.x / track.xSplineDiff.at( u );
          var uDy = proposedVelocity.y / track.ySplineDiff.at( u );
          var uD = (uDx + uDy) / 2;

          var newEnergy = track.getEnergy( u, skaterState.uD, skaterState.mass, skaterState.gravity );
          var delta = newEnergy - initialEnergy;
          var newThermalEnergy = skaterState.thermalEnergy;
          if ( delta < 0 ) {
            var lostEnergy = Math.abs( delta );
            newThermalEnergy = skaterState.thermalEnergy + lostEnergy;
          }

          return new SkaterState( skaterState, {
            thermalEnergy: newThermalEnergy,
            track: track,
            u: u,
            uD: uD
          } );
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
        return new SkaterState( skaterState, {
          velocity: new Vector2( 0, 0 ),
          thermalEnergy: initialEnergy,
          angle: 0,
          position: new Vector2( proposedPosition.x, 0 )
        } );
      }
      else {
        return new SkaterState( skaterState, {
          velocity: proposedVelocity,
          position: new Vector2( proposedPosition.x, y )
        } );
      }
    },

    //Update the skater if he is on the track
    stepTrack: function( dt, skaterState ) {

      var track = skaterState.track;
      var u = skaterState.u;
      var uD = skaterState.uD;

      //Factor out constants for inner loops
      var mass = skaterState.mass;
      var gravity = skaterState.gravity;

      //P means Prime (i.e. derivative with respect to time)
      //D means Dot (i.e. derivative with respect to x)
      //2 means after the step
      var xP = track.xSplineDiff.at( u );
      var yP = track.ySplineDiff.at( u );
      var xPP = track.xSplineDiffDiff.at( u );
      var yPP = track.ySplineDiffDiff.at( u );
      var uDD = this.uDD( uD, xP, xPP, yP, yPP, gravity );

      var uD2 = uD + uDD * dt;
      var u2 = u + (uD + uD2) / 2 * dt; //averaging here really keeps down the average error.  It's not exactly forward Euler but I forget the name.

      var x2 = track.getX( u2 );
      var y2 = track.getY( u2 );
      var initialEnergy = track.getEnergy( u, uD, mass, gravity );
      var finalEnergy = track.getEnergy( u2, uD2, mass, gravity );

      var count = 0;
      var upperBound = uD2 * 2;
      var lowerBound = uD2 * 0.5;

      //Binary search on the parametric velocity to make sure energy is exactly conserved
//        console.log( 'START BINARY' );
//        console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );

      var xPrime2 = track.xSplineDiff.at( u2 );
      var yPrime2 = track.ySplineDiff.at( u2 );
//      var potentialEnergy = -mass * gravity * y2;
//      var factoredEnergy = 1 / 2 * mass * (xPrime2 * xPrime2 + yPrime2 * yPrime2);

      //Tuning this error criterion lower and lower guarantees better conservation of energy when traveling along the track
      while ( Math.abs( finalEnergy - initialEnergy ) > 1E-10 ) {
        var uDMid = (upperBound + lowerBound) / 2;
        var midEnergy = track.getEnergy( u2, uDMid, mass, gravity );
        if ( midEnergy > initialEnergy ) {
          upperBound = uDMid;
        }
        else {
          lowerBound = uDMid;
        }
        finalEnergy = midEnergy;
        count++;
        if ( count >= 500 ) {
//          console.log( 'count', count );
          break;
        }
      }
      uD2 = (upperBound + lowerBound) / 2;
//        console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );
//        console.log( "END BINARY, count=", count );

      if ( this.friction > 0 ) {

        var coefficient = Util.linear( 0, 1, 1, 0.95, this.friction );
        //But perhaps since friction is qualitative in this sim it will be okay.
        //If we do need the full friction treatment, perhaps we could modify the parametric equation uDD above to account for friction as it accounts for gravity force.
        uD2 = uD2 * coefficient;
      }

      var vx = xPrime2 * uD2;
      var vy = yPrime2 * uD2;

      var newThermalEnergy = skaterState.thermalEnergy;
      if ( this.friction > 0 ) {

        //make up for energy losses due to friction
        var finalEnergy2 = track.getEnergy( u2, uD2, mass, gravity );
        var thermalEnergy = finalEnergy - finalEnergy2;
        if ( thermalEnergy > 0 ) {
          newThermalEnergy = skaterState.thermalEnergy + thermalEnergy;
        }
      }

      var flyOffMidTrack = false;
      if ( !this.stickToTrack ) {

        //check out the radius of curvature
        var curvature = circularRegression( [
          new Vector2( track.getX( skaterState.u ), track.getY( skaterState.u ) ),
          new Vector2( track.getX( skaterState.u - 1E-6 ), track.getY( skaterState.u - 1E-6 ) ),
          new Vector2( track.getX( skaterState.u + 1E-6 ), track.getY( skaterState.u + 1E-6 ) )] );

        //compare a to v/r^2 to see if it leaves the track
        var sideVector = track.getUnitNormalVector( u2 ).timesScalar( skaterState.top ? -1 : 1 );
        var outsideCircle = sideVector.dot( this.getCurvatureDirection( curvature, x2, y2 ) ) < 0;
        var r = curvature.r;
        var speedSquared = vx * vx + vy * vy;
        var centripetalForce = mass * speedSquared / r;
        var netForce = new Vector2( 0, mass * gravity );//no need for friction here since perpendicular to curvature (?)
        var netForceRadial = netForce.dot( this.getCurvatureDirection( curvature, x2, y2 ) );

        flyOffMidTrack = netForceRadial < centripetalForce && outsideCircle || netForceRadial > centripetalForce && !outsideCircle;
      }

      //Fly off the left or right side of the track
      if ( !skaterState.track.isParameterInBounds( u2 ) ) {

        return new SkaterState( skaterState, {
          track: null,
          thermalEnergy: newThermalEnergy,
          uD: 0,
          velocity: new Vector2( vx, vy ),
          position: new Vector2( x2, y2 )
        } );

      }
      else if ( flyOffMidTrack ) {
        return new SkaterState( skaterState, {
          track: null,
          uD: 0
        } );
      }
      else {
        return new SkaterState( skaterState, {
          u: u2,
          uD: uD2,
          thermalEnergy: newThermalEnergy,
          velocity: new Vector2( vx, vy ),
          position: new Vector2( x2, y2 )
        } );
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