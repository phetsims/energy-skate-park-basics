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
  var Util = require( 'DOT/Util' );

  /**
   * Main constructor for the EnergySkateParkBasicsModel
   *
   * @param {Boolean} draggableTracks True if this is screen 2-3, where friction is allowed to be on or off
   * @param {Boolean} frictionAllowed True in screen 3 where the user can drag the tracks
   * @constructor
   */
  function EnergySkateParkBasicsModel( draggableTracks, frictionAllowed ) {
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
      var doubleWell = [new Vector2( -4, 5 ), new Vector2( -2, 0 ), new Vector2( 0, 2 ), new Vector2( 2, 1 ), new Vector2( 4, 5 ) ];
      var toControlPoint = function( pt ) {return new ControlPoint( pt.x, pt.y );};
      this.tracks.addAll( [
        new Track( this.tracks, _.map( parabola, toControlPoint ), false ),
        new Track( this.tracks, _.map( slope, toControlPoint ), false ),
        new Track( this.tracks, _.map( doubleWell, toControlPoint ), false )] );

      this.sceneProperty.link( function( scene ) {
        for ( var i = 0; i < model.tracks.length; i++ ) {
          model.tracks.get( i ).physical = (i === scene);
        }
        model.skater.track = null;
      } );
    }
    else {
      for ( var i = 0; i < 4; i++ ) {
        //Move the tracks over so they will be in the right position in the view coordinates, under the grass to the left of the clock controls
        //Could use view transform for this, but it would require creating the view first, so just eyeballing it for now.
        var offset = new Vector2( -5, -0.7 );
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
    //TODO: We probably need to add friction here.  Could be easy if is symmetric in x & y, factor out an ax, ay term
    uDD: function( uD, xP, xPP, yP, yPP, g ) {
      return -1 * (uD * uD * (xP * xPP + yP * yPP) - g * yP) / (xP * xP + yP * yP);
    },
    manualStep: function() {
      //step one frame, assuming 60fps
      this.stepModel( 1.0 / 60 );
    },

    //Step the model, automatically called from Joist
    step: function( dt ) {
      //If the delay makes dt too high, then truncate it.  This helps e.g. when clicking in the address bar on ipad, which gives a huge dt and problems for integration
      //TODO: on the iPad3 if all features are turned on, the model will have numerical integration problems and buggy behavior.  We should subdivide dt or find another solution
      if ( dt > 1.0 / 10 ) {
        dt = 1.0 / 10;
      }
      if ( !this.paused ) {
        this.stepModel( this.speed === 'normal' ? dt : dt * 0.25 );
      }
    },
    stepGround: function( dt ) { },

    //Update the skater in free fall
    stepFreeFall: function( dt ) {
      var skater = this.skater;
      var initialEnergy = skater.totalEnergy;
      var netForce = new Vector2( 0, -9.8 * skater.mass );

      var acceleration = netForce.times( 1.0 / skater.mass );
      var proposedVelocity = skater.velocity.plus( acceleration.times( dt ) );
      var proposedPosition = skater.position.plus( proposedVelocity.times( dt ) );
      if ( proposedPosition.y < 0 ) {
        proposedPosition.y = 0;
      }
      if ( skater.position.x !== proposedPosition.x || skater.position.y !== proposedPosition.y ) {

        //see if it crossed the track
        var physicalTracks = this.getPhysicalTracks();
        if ( physicalTracks.length ) {
          this.interactWithTracksWhileFalling( physicalTracks, skater, proposedPosition, initialEnergy, dt, proposedVelocity );
        }
        else {
          this.continueFreeFall( skater, initialEnergy, proposedPosition, proposedVelocity );
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

        //TODO: maybe get closest point shouldn't return a new object allocation each time, or use pooling for it, or pass in reference as an arg?
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
    interactWithTracksWhileFalling: function( physicalTracks, skater, proposedPosition, initialEnergy, dt, proposedVelocity ) {

      //Find the closest track
      var closestTrackAndPositionAndParameter = this.getClosestTrackAndPositionAndParameter( skater.position, physicalTracks );
      var track = closestTrackAndPositionAndParameter.track;
      var u = closestTrackAndPositionAndParameter.u;

      if ( !track.isParameterInBounds( u ) ) {
        this.continueFreeFall( skater, initialEnergy, proposedPosition, proposedVelocity );
        return;
      }
      var t1 = u - 1E-6;
      var t2 = u + 1E-6;
      var pt = closestTrackAndPositionAndParameter.point;
      var pt1 = track.getPoint( t1 );
      var pt2 = track.getPoint( t2 );
      var segment = pt2.minus( pt1 ).normalized();
      var normal = segment.rotated( Math.PI / 2 );

      var beforeSign = normal.dot( skater.position.minus( pt ) ) > 0;
      var afterSign = normal.dot( proposedPosition.minus( pt ) ) > 0;
//          console.log( normal.dot( skater.position ), normal.dot( proposedPosition ), beforeSign, afterSign );
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
          skater.velocity = bounceVelocity;
          this.bounces++;
        }
        else {
          //If friction is allowed, keep the parallel component of velocity.
          //If friction is not allowed, then either attach to the track with no change in speed

          //Estimate u dot from equations (8) & (9) in the paper
          var uDx = proposedVelocity.x / track.xSplineDiff.at( u );
          var uDy = proposedVelocity.y / track.ySplineDiff.at( u );
          var uD = (uDx + uDy) / 2;

          //update skater variables
          skater.track = track;
          skater.u = u;
          skater.uD = uD;

          //TODO: Refine uD estimate based on energy conservation

          var newEnergy = track.getEnergy( u, skater.uD, skater.mass, skater.gravity );
          var delta = newEnergy - initialEnergy;
          if ( delta < 0 ) {
            var lostEnergy = Math.abs( delta );
            skater.thermalEnergy = skater.thermalEnergy + lostEnergy;
          }

          this.stepTrack( dt );
        }
      }

      //It just continued in free fall
      else {
        this.continueFreeFall( skater, initialEnergy, proposedPosition, proposedVelocity );
      }
    },

    //Started in free fall and did not interact with a track
    //TODO: handle the case where the skater is moving to the left/right when landing on the ground
    continueFreeFall: function( skater, initialEnergy, proposedPosition, proposedVelocity ) {

      //make up for the difference by changing the y value
      var y = (initialEnergy - 0.5 * skater.mass * proposedVelocity.magnitudeSquared() - skater.thermalEnergy) / (-1 * skater.mass * skater.gravity);
      if ( y < 0 ) {

        //When falling straight down, stop completely and convert all energy to thermal
        skater.velocity = new Vector2( 0, 0 );
        skater.thermalEnergy = initialEnergy;
        skater.angle = 0;
      }
      else {

        skater.position = new Vector2( proposedPosition.x, y );
        skater.velocity = proposedVelocity;
      }
      skater.updateEnergy();
    },

    //Update the skater if he is on the track
    //TODO: Add support for friction.  Could try deriving the parametric equations with a friction term, but may be difficult since we have to account for the
    //normal force in the friction computation.
    stepTrack: function( dt ) {

      var skater = this.skater;
      var x1 = skater.position.x;
      var y1 = skater.position.y;
      var track = skater.track;
      var u = skater.u;
      var uD = skater.uD;

      //Factor out constants for inner loops
      var mass = skater.mass;
      var gravity = skater.gravity;

      //P means Prime (i.e. derivative with respect to time)
      //D means Dot (i.e. derivative with repsect to x)
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

      //TODO: use a more accurate numerical integration scheme.  Currently forward Euler

      var count = 0;
      var upperBound = uD2 * 1.2;
      var lowerBound = uD2 * 0.8;

      //Binary search on the parametric velocity to make sure energy is exactly conserved
//        console.log( 'START BINARY' );
//        console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );

      var xPrime2 = track.xSplineDiff.at( u2 );
      var yPrime2 = track.ySplineDiff.at( u2 );
      var potentialEnergy = -mass * gravity * y2;
      var factoredEnergy = 1 / 2 * mass * (xPrime2 * xPrime2 + yPrime2 * yPrime2);
      while ( Math.abs( finalEnergy - initialEnergy ) > 1E-2 ) {
//          console.log( (finalEnergy - initialEnergy).toFixed( 2 ), 'binary search, lowerBound=', lowerBound, 'upperBound', upperBound );
        var uMid = (upperBound + lowerBound) / 2;

        //TODO: if we need to tweak u as well as uD then we may need to use track.getEnergy and forego some optimizations
        var midEnergy = potentialEnergy + factoredEnergy * uMid * uMid;
        if ( midEnergy > initialEnergy ) {
          upperBound = uMid;
        }
        else {
          lowerBound = uMid;
        }
        finalEnergy = midEnergy;
        count++;
        if ( count >= 1000 ) {
          console.log( 'count', count );
          break;
        }
      }
      uD2 = (upperBound + lowerBound) / 2;
//        console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );
//        console.log( "END BINARY, count=", count );

      if ( this.friction > 0 ) {

        var coefficient = Util.linear( 0, 1, 1, 0.95, this.friction );
        //TODO: this is technically incorrect because it is in parametric units, but is it close enough?  When will it break down?  When the metric space of the track is radically different (control points differently spaced)
        //But perhaps since friction is qualitative in this sim it will be okay.
        //If we do need the full friction treatment, perhaps we could modify the parametric equation uDD above to account for friction as it accounts for gravity force.
        skater.uD = uD2 * coefficient;
      }
      else {
        skater.uD = uD2;
      }
      skater.u = u2;

      var vx = xPrime2 * uD2;
      var vy = yPrime2 * uD2;

      //check out the radius of curvature
      var curvature = circularRegression( [
        new Vector2( track.getX( skater.u ), track.getY( skater.u ) ),
        new Vector2( track.getX( skater.u - 1E-6 ), track.getY( skater.u - 1E-6 ) ),
        new Vector2( track.getX( skater.u + 1E-6 ), track.getY( skater.u + 1E-6 ) )] );

      //Debugging facility for showing the curvature
      if ( this.showCircularRegression ) {
        this.circularRegression = curvature;
      }

      if ( this.friction > 0 ) {

        //make up for energy losses due to friction
        var finalEnergy2 = track.getEnergy( u2, skater.uD, mass, gravity );
        var thermalEnergy = finalEnergy - finalEnergy2;
        if ( thermalEnergy > 0 ) {
          skater.thermalEnergy = skater.thermalEnergy + thermalEnergy;
        }

        //TODO: we may use this code for integrating the friction with the above computation
//        var normalForce = this.getNormalForce( x2, y2, vx, vy, curvature );
//        console.log( 'normalForce', normalForce.magnitude() );

//        var frictionForce = new Vector2( vx, vy ).normalized().timesScalar( -this.friction * normalForce.magnitude() * 25 );
//        var thermalEnergy = frictionForce.magnitude() * new Vector2( x2, y2 ).distance( new Vector2( x1, y1 ) );
//        skater.thermalEnergy = skater.thermalEnergy + thermalEnergy;
//        console.log( thermalEnergy );

        //reduce velocity to account for loss of energy to thermal
        //0.5mvv=e
//        vx = vx / 2;
//        vy = vy / 2;
      }

      var flyOffMidTrack = false;
      if ( !this.stickToTrack ) {
        //compare a to v/r^2 to see if it leaves the track
        var sideVector = track.getUnitNormalVector( u2 ).timesScalar( skater.top ? -1 : 1 );
        var outsideCircle = sideVector.dot( this.getCurvatureDirection( curvature, x2, y2 ) ) < 0;
        var r = curvature.r;
        var speedSquared = vx * vx + vy * vy;
        var centripetalForce = mass * speedSquared / r;
        var netForce = new Vector2( 0, mass * gravity );//no need for friction here since perpendicular to curvature (?)
        var netForceRadial = netForce.dot( this.getCurvatureDirection( curvature, x2, y2 ) );

        flyOffMidTrack = netForceRadial < centripetalForce && outsideCircle || netForceRadial > centripetalForce && !outsideCircle;
      }

      skater.velocity = new Vector2( vx, vy );
      skater.angle = skater.track.getViewAngleAt( skater.u );
      skater.position = new Vector2( x2, y2 );
      skater.updateEnergy();

      //Fly off the left or right side of the track
      if ( !skater.track.isParameterInBounds( u2 ) ) {
        skater.track = null;
        skater.uD = 0;
      }
      else if ( flyOffMidTrack ) {
        console.log( 'leaving track' );
        skater.track = null;
        skater.uD = 0;
      }
    },

    getRadiusOfCurvature: function( curvature ) {
      return curvature.r;
    },

    //TODO: allocation
    getCurvatureDirection: function( curvature, x2, y2 ) {
      return new Vector2( curvature.x - x2, curvature.y - y2 ).normalized();
    },

    getNormalForce: function( x2, y2, vx, vy, curvature ) {
      var v = Math.sqrt( vx * vx + vy * vy );
      var curvatureDirection = this.getCurvatureDirection( curvature, x2, y2 );
      var netForce = new Vector2( 0, -this.skater.mass * this.skater.gravity );
//      netForceRadial.add( new MutableVector2D( xThrust * mass, yThrust * mass ) );//thrust
      var normalForceMagnitude = this.skater.mass * v * v / curvature.r - netForce.dot( curvatureDirection );
      return Vector2.createPolar( normalForceMagnitude, curvatureDirection.angle() );
    },

    stepModel: function( dt ) {
      var skater = this.skater;

      //User is dragging the skater, nothing to update here
      if ( skater.dragging ) {
      }

      //Free fall
      else if ( !skater.track && skater.position.y > 0 ) {
        this.stepFreeFall( dt );
      }

      //On the ground
      else if ( !skater.track && skater.position.y <= 0 ) {
        this.stepGround( dt );
      }

      //On a track
      else if ( skater.track ) {
        this.stepTrack( dt );
      }
    },

    //Return to the place he was last released by the user
    returnSkater: function() { this.skater.returnSkater(); },

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
        var p = newTrack.getClosestPositionAndParameter( this.skater.position );
        this.skater.track = newTrack;
        this.skater.u = p.u;

        //TODO: Skater sometimes flips upside down when tracks joined, see TODO in Skater.js
      }
    }
  } );
} );