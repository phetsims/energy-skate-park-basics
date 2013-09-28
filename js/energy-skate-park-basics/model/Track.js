// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for one track in Energy Skate Park Basics, which contains the control points and cubic splines for interpolating between them.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  //points is Array of Property of Vector2
  //TODO: Track has a fixed number of points.  If you added a point to a Track, you need a new track.
  function Track( points, interactive ) {
    var track = this;

    PropertySet.call( this, {

      //True if the track can be interacted with.  For screens 1-2 only one track will be physical (and hence visible).
      //For screen 3, tracks in the control panel are visible but non-physical until dragged to the play area
      physical: false,

      //Store the offset in a separate field for translation, to improve performance when dragging the track
      offset: new Vector2()
    } );

    this.points = points;
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

      var x = this.offsetProperty.get().x;
      var y = this.offsetProperty.get().y;

      for ( var i = 0; i < track.points.length; i++ ) {
        track.u.push( i / track.points.length );
        track.x.push( track.points[i].value.x + x );
        track.y.push( track.points[i].value.y + y );
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
      points[i].lazyLink( this.updateSplines.bind( this ) );
    }

    this.translationListeners = [];
    this.updateSplines();
  }

  return inherit( PropertySet, Track, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      for ( var i = 0; i < this.points.length; i++ ) {
        this.points[i].reset();
      }
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
      return {u: bestT, point: bestPt, distance: best};
    },

    getX: function( u ) { return this.xSpline.at( u ); },
    getY: function( u ) { return this.ySpline.at( u ); },
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

    //Get the total energy of a point mass with parametric position u and parametric velocity uD
    getEnergyShortcut: function( xPrime2, yPrime2, y, uD, mass, gravity ) {

      //get Euclidean velocity from parametric velocity
      //See equation 8 from the Bensky paper
      return -mass * gravity * y + 1 / 2 * mass * (xPrime2 * xPrime2 + yPrime2 * yPrime2) * uD * uD;
    },

    translate: function( dx, dy ) {
      this.offsetProperty.set( this.offsetProperty.get().plusXY( dx, dy ) );
      for ( var i = 0; i < this.translationListeners.length; i++ ) {
        var listener = this.translationListeners[i];
        listener( dx, dy );
      }
      this.updateSplines();
    },

    addTranslationListener: function( listener ) { this.translationListeners.push( listener ); },

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
      this.maxPoint = (this.points.length - 1) / this.points.length;
      var prePoint = this.minPoint - 1E-6;
      var postPoint = this.maxPoint + 1E-6;

      //Store for performance
      //made number of sample points depend on the length of the track, to make it smooth enough no matter how long it is
      this.searchLinSpace = numeric.linspace( prePoint, postPoint, 20 * (this.points.length - 1) );
    },

    //Detect whether a parametric point is in bounds of this track, for purposes of telling whether the skater fell past the edge of the track
    isParameterInBounds: function( u ) { return u >= this.minPoint && u <= this.maxPoint; },

    //Setter/getter for physical property, mimic the PropertySet pattern instead of using PropertySet multiple inheritance
    get physical() { return this.physicalProperty.get(); },
    set physical( p ) {this.physicalProperty.set( p );}
  } );
} );