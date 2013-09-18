// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for one track in Energy Skate Park Basics, which contains the control points and cubic splines for interpolating between them.
 *
 * TODO: For performance in dragging, consider storing an 'offset' x,y value which would add to the position.
 * TODO: Or make sure to get only one 'update' callback when all points are translated
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  //points is Array of Property of Vector2
  function Track( points, interactive ) {
    var track = this;

    //True if the track can be interacted with.  For screens 1-2 only one track will be physical (and hence visible).
    // For screen 3, tracks in the control panel are visible but non-physical until dragged to the play area
    this.physicalProperty = new Property( false );
    ObservableArray.call( this, points );
    this.interactive = interactive;
    this.u = [];
    this.x = [];
    this.y = [];

    this.updateLinSpace();

    //when points change, update the spline instance
    this.updateSplines = function() {
      //clear arrays, reusing them to save on garbage
      track.u.length = 0;
      track.x.length = 0;
      track.y.length = 0;

      for ( var i = 0; i < track.length; i++ ) {
        track.u.push( i / track.length );
        track.x.push( track.get( i ).value.x );
        track.y.push( track.get( i ).value.y );
      }

      track.xSpline = numeric.spline( track.u, track.x );
      track.ySpline = numeric.spline( track.u, track.y );

      track.xSplineDiff = track.xSpline.diff();
      track.ySplineDiff = track.ySpline.diff();

      track.xSplineDiffDiff = track.xSplineDiff.diff();
      track.ySplineDiffDiff = track.ySplineDiff.diff();

      //Mark search points as dirty
      track.xSearchPoints = null;
      track.ySearchPoints = null;
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
      this.physicalProperty.reset();
    },

    //Returns the closest point (Euclidean) and position (parametric) on the track, as an object with {u,point}
    //also checks 1E-6 beyond each side of the track to see if the skater is beyond the edge of the track
    //TODO: Could binary search after coarse serach
    getClosestPositionAndParameter: function( point ) {

      //Compute the spline points for purposes of getting closest points.
      //keep these points around and invalidate only when necessary
      if ( !this.xSearchPoints ) {
        this.xSearchPoints = this.xSpline.at( this.searchLinSpace );
        this.ySearchPoints = this.ySpline.at( this.searchLinSpace );
      }

      var bestT = 0;
      var best = 9999999999;
      var bestPt = new Vector2( 0, 0 );
      for ( var i = 0; i < this.xSearchPoints.length; i++ ) {
        var dist = point.distanceXY( this.xSearchPoints[i], this.ySearchPoints[i] );
        if ( dist < best ) {
          best = dist;
          bestT = this.searchLinSpace[i];
          bestPt.x = this.xSearchPoints[i];
          bestPt.y = this.ySearchPoints[i];
        }
      }
      return {u: bestT, point: bestPt};
    },

    getX: function( u ) {
      return this.xSpline.at( u );
    },
    getY: function( u ) {
      return this.ySpline.at( u );
    },
    getPoint: function( u ) {
      var x = this.xSpline.at( u );
      var y = this.ySpline.at( u );
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
    },

    //For purposes of showing the skater angle, get the view angle of the track here.  Note this means inverting the y values
    //This is called every step while animating on the track, so it was optimized to avoid new allocations
    getViewAngleAt: function( u ) {
      var tolerance = 1E-6;
      var ax = this.xSpline.at( u - tolerance );
      var ay = -this.ySpline.at( u - tolerance );

      var bx = this.xSpline.at( u + tolerance );
      var by = -this.ySpline.at( u + tolerance );

      return Math.atan2( by - ay, bx - ax );
    },

    updateLinSpace: function() {
      this.minPoint = 0;
      this.maxPoint = (this.length - 1) / this.length;
      var prePoint = this.minPoint - 1E-6;
      var postPoint = this.maxPoint + 1E-6;

      //Store for performance
      //TODO: number of samples could depend on the total length of the track
      this.searchLinSpace = numeric.linspace( prePoint, postPoint, 70 );
    },

    //Detect whether a parametric point is in bounds of this track, for purposes of telling whether the skater fell past the edge of the track
    isParameterInBounds: function( u ) { return u >= this.minPoint && u <= this.maxPoint; },

    setControlPoints: function( points ) {
      var lengthChanged = points.length !== this.length;
      while ( this.length < points.length ) {
        this.push( new Property( new Vector2( 0, 0 ) ) );
      }
      while ( this.length > points.length ) {
        this.pop();
      }
      for ( var i = 0; i < points.length; i++ ) {
        this.get( i ).value = new Vector2( points[i].x, points[i].y );
      }
      if ( lengthChanged ) {
        this.updateLinSpace();
      }
      this.updateSplines();
    },

    //Mimic the PropertySet pattern
    get physical() { return this.physicalProperty.get(); },
    set physical( p ) {this.physicalProperty.set( p );}
  } );
} );