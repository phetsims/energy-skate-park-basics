// Copyright 2002-2013, University of Colorado Boulder

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
      closestPoint: new Vector2( 1, 0 ),
      pieChartVisible: false,
      barGraphVisible: true,
      gridVisible: false,
      speedVisible: false,
      paused: false
    } );
    this.skater = new Skater();
    var controlPoints = [ new Property( new Vector2( -2, 2 ) ), new Property( new Vector2( 0, 0 ) ), new Property( new Vector2( 2, 2 ) ) ];
    this.track = new Track( controlPoints );

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

    //See http://digitalcommons.calpoly.edu/cgi/viewcontent.cgi?article=1387&context=phy_fac
    uDD: function( uD, xP, xPP, yP, yPP, g ) {
      return -1 * (uD * uD * (xP * xPP + yP * yPP) - g * yP) / (xP * xP + yP * yP);
    },
    manualStep: function() {
      //step one frame, assuming 60fps
      this.stepModel( 1.0 / 60 );
    },
    step: function( dt ) {
      if ( !this.paused ) {
        this.stepModel( dt );
      }
    },
    stepModel: function( dt ) {
      var skater = this.skater;
      var initialEnergy = skater.totalEnergy;

      //Free fall
      if ( !skater.dragging && !skater.track ) {

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
            }
          }

          //It just continued in free fall
          else {
            var energy = 0.5 * skater.mass * skater.velocity.magnitudeSquared() - skater.mass * skater.gravity * skater.position.y;
            var deltaEnergy = energy - initialEnergy;
            //make up for the difference by changing the y value
            var y = (initialEnergy - 0.5 * skater.mass * skater.velocity.magnitudeSquared()) / (-1 * skater.mass * skater.gravity);

            var fixedEnergy = 0.5 * skater.mass * skater.velocity.magnitudeSquared() - skater.mass * skater.gravity * y;
            var fixedDelta = fixedEnergy - initialEnergy;
//            console.log( fixedDelta, deltaEnergy, initialEnergy, energy );

            //TODO: keep track of all of the variables in a hash so they can be set at once after verification and after energy conserved
            skater.position = new Vector2( proposedPosition.x, y );
            skater.updateEnergy();
          }
        }
      }
      if ( !skater.dragging && skater.track ) {

        var u = skater.u;
        var uD = skater.uD;

        //TODO: Store these diffs when traversing the track to improve performance
        var xP = this.track.xSpline.diff().at( u );
        var yP = this.track.ySpline.diff().at( u );
        var xPP = this.track.xSpline.diff().diff().at( u );
        var yPP = this.track.ySpline.diff().diff().at( u );
        var g = -9.8;
        var uDD1 = this.uDD( uD, xP, xPP, yP, yPP, g );

        var uD2 = uD + uDD1 * dt;
        var u2 = u + (uD + uD2) / 2 * dt; //averaging here really keeps down the average.  It's not exactly forward Euler but I forget the name.

        //TODO: Fine tune based on energy conservation
//        debugger;
        var initialEnergy = this.track.getEnergy( u, uD, skater.mass, skater.gravity );
        var finalEnergy = this.track.getEnergy( u2, uD2, skater.mass, skater.gravity );


        var count = 0;
//        while ( finalEnergy > initialEnergy ) {
//
//          //take the energy from the velocity vector, but try to keep uD in the same direction
//          skater.uD = skater.uD * 0.999;
//          finalEnergy = this.track.getEnergy( u2, uD2, skater.mass, skater.gravity );
//          count++;
//          if ( count > 2 ) {
//            break;
//          }
//        }

        //TODO: use a more accurate numerical integration scheme.  Currently forward Euler
        skater.position = new Vector2( this.track.getX( u2 ), this.track.getY( u2 ) );

        console.log( 'START\n' );
        console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );
        while ( finalEnergy < initialEnergy ) {
          console.log( 'increasing' );
          uD2 = uD2 * 1.001;
          var newFinalEnergy = this.track.getEnergy( u2, uD2, skater.mass, skater.gravity );
          console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );
          if ( newFinalEnergy <= finalEnergy ) {
            finalEnergy = newFinalEnergy;
            break;
          }
          finalEnergy = newFinalEnergy;
        }
        while ( finalEnergy > initialEnergy ) {
          console.log( 'decreasing' );
          uD2 = uD2 * 0.999;
          var newFinalEnergy = this.track.getEnergy( u2, uD2, skater.mass, skater.gravity );
          console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );
          if ( newFinalEnergy >= finalEnergy ) {
            finalEnergy = newFinalEnergy;
            break;
          }
          finalEnergy = newFinalEnergy;
        }
        console.log( (finalEnergy - initialEnergy).toFixed( 2 ), initialEnergy, finalEnergy );
        console.log( 'END\n' );
        skater.uD = uD2;
        skater.u = u2;

        var vx = xP * uD2;
        var vy = yP * uD2;//TODO: compare to this.track.getEnergy, should we duplicate that call or reuse this value?
        var velocity = new Vector2( vx, vy );

        //can we just adjust the velocity to fix the energy?
        var newKineticEnergy = 0.5 * skater.mass * (vx * vx + vy * vy);

        //Energy was higher and we can reduce the velocity to compensate
//        if ( finalEnergy > initialEnergy && newKineticEnergy > (finalEnergy - initialEnergy) ) {
//          var fixedKineticEnergy = newKineticEnergy - (finalEnergy - initialEnergy);
//          var fixedSpeed = Math.sqrt( fixedKineticEnergy * 2 / skater.mass );
//          velocity = Vector2.createPolar( fixedSpeed, velocity.angle() );
//          var energy = -skater.mass * skater.position.y * skater.gravity + 0.5 * skater.mass * velocity.magnitudeSquared();
//          var newError = energy - initialEnergy;
//          console.log( 'corrected', newError );
//          skater.uD = (velocity.x / xP + velocity.y / yP) / 2;
//        }
        skater.velocity = velocity;
        skater.updateEnergy();
      }
    }} );
} );