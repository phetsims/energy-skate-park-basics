// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for one track in Energy Skate Park Basics, which contains the control points and cubic splines for interpolating between them.
 *
 * TODO: For performance in dragging, consider storing an 'offset' x,y value which would add to the position.
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
    this.t = [];
    this.x = [];
    this.y = [];

    this.updateLinSpace();

    //when points change, update the spline instance
    this.updateSplines = function() {
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
      this.physicalProperty.reset();
    },

    //Returns the closest point on the track, as an object with {t,point}
    //also checks 1E-6 beyond each side of the track to see if the skater is beyond the edge of the track
    getClosestPoint: function( point ) {

      //Compute the spline points for purposes of getting closest points.
      var xPoints = this.xSpline.at( this.searchLinSpace );
      var yPoints = this.ySpline.at( this.searchLinSpace );

      var bestT = 0;
      var best = 9999999999;
      var bestPt = new Vector2( 0, 0 );
      for ( var i = 0; i < xPoints.length; i++ ) {
        var dist = point.distanceXY( xPoints[i], yPoints[i] );
        if ( dist < best ) {
          best = dist;
          bestT = this.searchLinSpace[i];
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

    //TODO: optimize
    //For purposes of showing the skater angle, get the view angle of the track here.  Note this means inverting the y values
    getViewAngleAt: function( u ) {
      var a = this.getPoint( u - 1E-6 );
      a.y = -a.y;
      var b = this.getPoint( u + 1E-6 );
      b.y = -b.y;
      return b.minus( a ).angle();
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
    isParameterInBounds: function( t ) { return t >= this.minPoint && t <= this.maxPoint; },

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