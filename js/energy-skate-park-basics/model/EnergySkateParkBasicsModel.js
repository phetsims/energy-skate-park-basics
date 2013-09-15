// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for the Energy Skate Park: Basics sim, including model values for the view settings, such as whether the grid is visible.
 * All units are in metric.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Skater = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/Skater' );
  var Track = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/Track' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsModel() {
    var energySkateParkBasicsModel = this;
    PropertySet.call( this, {
      closestPoint: new Vector2( 0, 0 ),
      pieChartVisible: false,
      barGraphVisible: false,
      gridVisible: false,
      speedometerVisible: false,
      paused: false,

      //speed of the model, either 'normal' or 'slow'
      speed: 'normal'
    } );
    this.skater = new Skater();
    var controlPoints = [ new Property( new Vector2( -2, 2 ) ), new Property( new Vector2( 0, 0 ) ), new Property( new Vector2( 2, 1 ) ), new Property( new Vector2( 2.5, 1 ) ), new Property( new Vector2( 3, 1 ) )];
    this.track = new Track( controlPoints );

    //TODO: Remove 'closest point' debugging tool to improve performance
    var updateClosestPoint = function() {
      energySkateParkBasicsModel.closestPoint = energySkateParkBasicsModel.track.getClosestPoint( energySkateParkBasicsModel.skater.position ).point;
    };
    this.skater.positionProperty.link( updateClosestPoint );
    for ( var i = 0; i < controlPoints.length; i++ ) {
      var controlPoint = controlPoints[i];
      controlPoint.link( updateClosestPoint );
    }

    this.bounces = 0;
  }

  return inherit( PropertySet, EnergySkateParkBasicsModel, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.skater.reset();
      this.track.reset();
    },

    //See http://digitalcommons.calpoly.edu/cgi/viewcontent.cgi?article=1387&context=phy_fac
    //Computational problems in introductory physics: Lessons from a bead on a wire
    //Thomas J. Bensky and Matthew J. Moelter
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
      if ( dt > 1.0 / 10 ) {
        dt = 1.0 / 10;
      }
      if ( !this.paused ) {
        this.stepModel( this.speed === 'normal' ? dt : dt * 0.25 );
      }
    },
    stepGround: function( dt ) {
    },
    //Update the skater in free fall
    stepFreeFall: function( dt ) {
      var skater = this.skater;
      var initialEnergy = skater.totalEnergy;
      var netForce = new Vector2( 0, -9.8 * skater.mass );
      skater.acceleration = netForce.times( 1.0 / skater.mass );
      skater.velocity = skater.velocity.plus( skater.acceleration.times( dt ) );
      var proposedPosition = skater.position.plus( skater.velocity.times( dt ) );
      if ( proposedPosition.y < 0 ) {
        proposedPosition.y = 0;
      }
      if ( skater.position.x !== proposedPosition.x || skater.position.y !== proposedPosition.y ) {

        //see if it crossed the track

        //TODO: return t value so they can be averaged

        //TODO: extend t range just outside the track in each direction to see if the skater just "missed" the track
        var t = this.track.getClosestPoint( this.skater.position ).t;
        var t1 = t - 1E-6;
        var t2 = t + 1E-6;
        var pt = this.track.getPoint( t );
        var pt1 = this.track.getPoint( t1 );
        var pt2 = this.track.getPoint( t2 );
        var segment = pt2.minus( pt1 );
        var normal = segment.rotated( Math.PI / 2 ).normalized();

        var beforeSign = normal.dot( skater.position.minus( pt ) ) > 0;
        var afterSign = normal.dot( proposedPosition.minus( pt ) ) > 0;
//          console.log( normal.dot( skater.position ), normal.dot( proposedPosition ), beforeSign, afterSign );
        if ( beforeSign !== afterSign ) {
          //reflect the velocity vector
          //http://www.gamedev.net/topic/165537-2d-vector-reflection-/
          var allok = skater.velocity && skater.velocity.minus && normal.times && normal.dot;
          if ( !allok ) { alert( 'allok === false' ); }
          var newVelocity = allok ? skater.velocity.minus( normal.times( 2 * normal.dot( skater.velocity ) ) ) :
                            new Vector2( 0, 1 );

          if ( this.bounces < 2 ) {
            skater.velocity = newVelocity;
            this.bounces++;
          }
          else {
            //attach to track
            skater.track = this.track;
            skater.u = t;
            var newEnergy = this.track.getEnergy( t, skater.uD, skater.mass, skater.gravity );
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
          var energy = 0.5 * skater.mass * skater.velocity.magnitudeSquared() - skater.mass * skater.gravity * skater.position.y + skater.thermalEnergy;
          //make up for the difference by changing the y value
          var y = (initialEnergy - 0.5 * skater.mass * skater.velocity.magnitudeSquared() - skater.thermalEnergy) / (-1 * skater.mass * skater.gravity);
          if ( y < 0 ) {
            y = 0;
          }

          //TODO: keep track of all of the variables in a hash so they can be set at once after verification and after energy conserved
          skater.position = new Vector2( proposedPosition.x, y );
          skater.updateEnergy();
        }
      }
    },

    //Update the skater if he is on the track
    stepTrack: function( dt ) {
      var skater = this.skater;
      var u = skater.u;
      var uD = skater.uD;

      var xP = this.track.xSplineDiff.at( u );
      var yP = this.track.ySplineDiff.at( u );
      var xPP = this.track.xSplineDiffDiff.at( u );
      var yPP = this.track.ySplineDiffDiff.at( u );
      var g = -9.8;
      var uDD1 = this.uDD( uD, xP, xPP, yP, yPP, g );

      var uD2 = uD + uDD1 * dt;
      var u2 = u + (uD + uD2) / 2 * dt; //averaging here really keeps down the average error.  It's not exactly forward Euler but I forget the name.

      var initialEnergy = this.track.getEnergy( u, uD, skater.mass, skater.gravity );
      var finalEnergy = this.track.getEnergy( u2, uD2, skater.mass, skater.gravity );

      //TODO: use a more accurate numerical integration scheme.  Currently forward Euler
      skater.position = new Vector2( this.track.getX( u2 ), this.track.getY( u2 ) );

      var count = 0;
      var upperBound = uD2 * 1.2;
      var lowerBound = uD2 * 0.8;

      //Binary search on the parametric velocity to make sure energy is exactly conserved
//        console.log( 'START BINARY' );
//        console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );
      while ( Math.abs( finalEnergy - initialEnergy ) > 1E-2 ) {
//          console.log( (finalEnergy - initialEnergy).toFixed( 2 ), 'binary search, lowerBound=', lowerBound, 'upperBound', upperBound );
        var uMid = (upperBound + lowerBound) / 2;
        var midEnergy = this.track.getEnergy( u2, uMid, skater.mass, skater.gravity );
        if ( midEnergy > initialEnergy ) {
          upperBound = uMid;
        }
        else {
          lowerBound = uMid;
        }
        finalEnergy = this.track.getEnergy( u2, uMid, skater.mass, skater.gravity );
        count++;
        if ( count >= 1000 ) {
          console.log( 'count', count );
          break;
        }
      }
      uD2 = (upperBound + lowerBound) / 2;
//        console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );
//        console.log( "END BINARY, count=", count );

      skater.uD = uD2;
      skater.u = u2;

      var vx = this.track.xSplineDiff.at( u2 ) * uD2;
      var vy = this.track.ySplineDiff.at( u2 ) * uD2;
      var velocity = new Vector2( vx, vy );

      skater.velocity = velocity;
      skater.updateEnergy();
//        console.log( 'skater energy', skater.totalEnergy );

      //Fly off the left side of the track
      if ( u2 < 0 || u2 > skater.track.getMaxU() ) {
        skater.track = null;
      }
    },
    stepModel: function( dt ) {
      var skater = this.skater;

      //Free fall
      if ( !skater.dragging && !skater.track && skater.position.y > 0 ) {
        this.stepFreeFall( dt );
      }
      else if ( !skater.dragging && !skater.track && skater.position.y <= 0 ) {
        this.stepGround( dt );
      }
      else if ( !skater.dragging && skater.track ) {
        this.stepTrack( dt );
      }
    },

    //TODO: Return to the place he was last released by the user
    returnSkater: function() {
      this.skater.reset();
    },

    clearThermal: function() {
      this.skater.clearThermal();
    }
  } );
} );