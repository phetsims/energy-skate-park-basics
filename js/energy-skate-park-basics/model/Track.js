// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for one track in Energy Skate Park Basics, which contains the control points and cubic splines for interpolating between them.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Vector2 = require( 'DOT/Vector2' );

  //points is Array of Property of Vector2
  function Track( points ) {
    var track = this;
    ObservableArray.call( this, points );
    this.t = [];
    this.x = [];
    this.y = [];

    //Store for performance
    //TODO: recompute linSpace if length of track changes
    var lastPt = (this.length - 1) / this.length;
    this.linSpace = numeric.linspace( 0, lastPt, 70 );

    //TODO: when points change, update the spline instance

    this.updateSplines = function( pt ) {
      //clear arrays, reusing them to save on garbage
      track.t.length = 0;
      track.x.length = 0;
      track.y.length = 0;

      for ( var i = 0; i < track.length; i++ ) {
        track.t.push( i / track.length );
        track.x.push( track.get( i ).value.x );
        track.y.push( track.get( i ).value.y );
      }

      track.xSpline = numeric.spline( track.t, track.x );
      track.ySpline = numeric.spline( track.t, track.y );

      track.xSplineDiff = track.xSpline.diff();
      track.ySplineDiff = track.ySpline.diff();

      track.xSplineDiffDiff = track.xSplineDiff.diff();
      track.ySplineDiffDiff = track.ySplineDiff.diff();
    };

    for ( var i = 0; i < points.length; i++ ) {
      points[i].link( this.updateSplines );
    }
  }

  return inherit( ObservableArray, Track, {
    reset: function() {
      ObservableArray.prototype.reset.call( this );
      for ( var i = 0; i < this.length; i++ ) {
        this.get( i ).reset();
      }
    },
    getClosestPoint: function( point ) {
      var track = this;

      var xPoints = numeric.spline( this.t, this.x ).at( this.linSpace ); //TODO: number of samples could depend on the total length of the track
      var yPoints = numeric.spline( this.t, this.y ).at( this.linSpace );

      var bestT = 0;
      var best = 9999999999;
      var bestPt = new Vector2( 0, 0 );
      for ( var i = 0; i < xPoints.length; i++ ) {
        var dist = point.distanceXY( xPoints[i], yPoints[i] );
        if ( dist < best ) {
          best = dist;
          bestT = this.linSpace[i];
          bestPt.x = xPoints[i];
          bestPt.y = yPoints[i];
        }
      }
      return {t: bestT, point: bestPt};
    },

    getX: function( t ) {
      return this.xSpline.at( t );
    },
    getY: function( t ) {
      return this.ySpline.at( t );
    },
    getPoint: function( t ) {
      var x = this.xSpline.at( t );
      var y = this.ySpline.at( t );
      return new Vector2( x, y );
    },

    //Get the total energy of a point mass with parametric position u and parametric velocity uD
    getEnergy: function( u, uD, mass, gravity ) {
      //get Euclidean velocity from parametric velocity
      //See equation 8 from the Bensky paper
      var vx = this.xSplineDiff.at( u ) * uD;
      var vy = this.ySplineDiff.at( u ) * uD;
      var vSquared = vx * vx + vy * vy;

      return -mass * gravity * this.ySpline.at( u ) + 1 / 2 * mass * vSquared;
    },

    //Get the maximum parametric value at the rightmost end of the track (left end is 0)
    getMaxU: function() { return (this.length - 1) / this.length; },

    translate: function( dx, dy ) {

      //Unlink and relink later to avoid unnecessary spline computation
      for ( var i = 0; i < this.length; i++ ) {
        this.get( i ).unlink( this.updateSplines );
      }

      for ( i = 0; i < this.length; i++ ) {
        var point = this.get( i );
        point.set( point.value.plus( new Vector2( dx, dy ) ) );
      }

      for ( i = 0; i < this.length; i++ ) {
        this.get( i ).lazyLink( this.updateSplines );
      }

      //batch update for performance
      //TODO: This is still pretty slow, consider translating the entire function directly instead of recomputing splines
      this.updateSplines();
    }
  } );
} );