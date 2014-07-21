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
  var Vector2 = require( 'DOT/Vector2' );
  var SplineEvaluation = require( 'ENERGY_SKATE_PARK_BASICS/model/SplineEvaluation' );

  /**
   * Model for a track, which has a fixed number of points.  If you added a point to a Track, you need a new track.
   * @param {Events} events event source for sending messages
   * @param {ObservableArray<Track>} modelTracks all model tracks, so this track can add and remove others when joined/split
   * @param {Array<ControlPoint>} controlPoints
   * @param {Boolean} interactive
   * @param {Array<Number>} parents the original tracks that were used to make this track (if any) so they can be broken apart when dragged back to control panel
   * @constructor
   */
  function Track( events, modelTracks, controlPoints, interactive, parents ) {
    var track = this;
    this.events = events;
    this.parents = parents;
    this.modelTracks = modelTracks;

    //Flag to indicate whether the skater transitions from the right edge of this track directly to the ground, see #164
    this.slopeToGround = false;

    PropertySet.call( this, {

      //True if the track can be interacted with.  For screens 1-2 only one track will be physical (and hence visible).
      //For screen 3, tracks in the control panel are visible but non-physical until dragged to the play area
      physical: false,

      //Flag that shows whether the track has been dragged fully out of the panel
      leftThePanel: false,

      //Keep track of whether the track is dragging, so performance can be optimized while dragging
      dragging: false
    } );

    this.property( 'physical' ).link( function() { events.trigger( 'track-changed' ); } );

    this.controlPoints = controlPoints;

    this.interactive = interactive;
    this.u = new Array( track.controlPoints.length );
    this.x = new Array( track.controlPoints.length );
    this.y = new Array( track.controlPoints.length );

    this.updateLinSpace();

    //when points change, update the spline instance
    this.updateSplines = function() {

      //Arrays are fixed length, so just overwrite values, see #38
      for ( var i = 0; i < track.controlPoints.length; i++ ) {
        track.u[i] = i / track.controlPoints.length;
        track.x[i] = track.controlPoints[i].position.x;
        track.y[i] = track.controlPoints[i].position.y;
      }

      track.xSpline = numeric.spline( track.u, track.x );
      track.ySpline = numeric.spline( track.u, track.y );

      //Mark search points as dirty
      track.xSearchPoints = null;
      track.ySearchPoints = null;

      //Mark derivatives as dirty
      track.xSplineDiff = null;
      track.ySplineDiff = null;

      track.xSplineDiffDiff = null;
      track.ySplineDiffDiff = null;
    };

    this.updateSplines();
  }

  return inherit( PropertySet, Track, {
    reset: function() {
      PropertySet.prototype.reset.call( this );
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        this.controlPoints[i].reset();
      }

      //Broadcast message so that TrackNode can update the shape
      this.updateSplines();
      this.trigger( 'reset' );
    },

    //Returns the closest point (Euclidean) and position (parametric) on the track, as an object with {u,point}
    //also checks 1E-6 beyond each side of the track to see if the skater is beyond the edge of the track
    //This currently does a flat search, but if more precision is needed, a finer-grained binary search could be done afterwards
    //This code is used when dragging the skater (to see if he is dragged near the track) and while the skater is falling toward the track
    // (to see if he should bounce/attach)
    getClosestPositionAndParameter: function( point ) {

      //Compute the spline points for purposes of getting closest points.
      //keep these points around and invalidate only when necessary
      if ( !this.xSearchPoints ) {
        this.xSearchPoints = SplineEvaluation.atArray( this.xSpline, this.searchLinSpace );
        this.ySearchPoints = SplineEvaluation.atArray( this.ySpline, this.searchLinSpace );
      }

      var bestU = 0;
      var bestDistanceSquared = Number.POSITIVE_INFINITY;
      var bestPoint = new Vector2( 0, 0 );
      for ( var i = 0; i < this.xSearchPoints.length; i++ ) {
        var distanceSquared = point.distanceSquaredXY( this.xSearchPoints[i], this.ySearchPoints[i] );
        if ( distanceSquared < bestDistanceSquared ) {
          bestDistanceSquared = distanceSquared;
          bestU = this.searchLinSpace[i];
          bestPoint.x = this.xSearchPoints[i];
          bestPoint.y = this.ySearchPoints[i];
        }
      }

      //Binary search in the neighborhood of the best point, to refine the search
      var distanceBetweenSearchPoints = Math.abs( this.xSearchPoints[1] - this.xSearchPoints[0] );
      var topU = bestU + distanceBetweenSearchPoints / 2;
      var bottomU = bestU - distanceBetweenSearchPoints / 2;

      var topX = SplineEvaluation.atNumber( this.xSpline, topU );
      var topY = SplineEvaluation.atNumber( this.ySpline, topU );

      var bottomX = SplineEvaluation.atNumber( this.xSpline, bottomU );
      var bottomY = SplineEvaluation.atNumber( this.ySpline, bottomU );

      //Even at 400 binary search iterations, performance is smooth on iPad3, so this loop doesn't seem too invasive
      var maxBinarySearchIterations = 40;
      for ( i = 0; i < maxBinarySearchIterations; i++ ) {

        var topDistanceSquared = point.distanceSquaredXY( topX, topY );
        var bottomDistanceSquared = point.distanceSquaredXY( bottomX, bottomY );

        if ( topDistanceSquared < bottomDistanceSquared ) {
          bottomU = bottomU + (topU - bottomU) / 4;  //move halfway up
          bottomX = SplineEvaluation.atNumber( this.xSpline, bottomU );
          bottomY = SplineEvaluation.atNumber( this.ySpline, bottomU );
          bestDistanceSquared = topDistanceSquared;
        }
        else {
          topU = topU - (topU - bottomU) / 4;  //move halfway down
          topX = SplineEvaluation.atNumber( this.xSpline, topU );
          topY = SplineEvaluation.atNumber( this.ySpline, topU );
          bestDistanceSquared = bottomDistanceSquared;
        }
      }
      bestU = (topU + bottomU) / 2;
      bestPoint.x = SplineEvaluation.atNumber( this.xSpline, bestU );
      bestPoint.y = SplineEvaluation.atNumber( this.ySpline, bestU );

      return {u: bestU, point: bestPoint, distance: bestDistanceSquared};
    },

    getX: function( u ) { return SplineEvaluation.atNumber( this.xSpline, u ); },
    getY: function( u ) { return SplineEvaluation.atNumber( this.ySpline, u ); },
    getPoint: function( u ) {
      var x = SplineEvaluation.atNumber( this.xSpline, u );
      var y = SplineEvaluation.atNumber( this.ySpline, u );
      return new Vector2( x, y );
    },

    translate: function( dx, dy ) {
      //move all the control points
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        var point = this.controlPoints[i];
        point.sourcePosition = point.sourcePosition.plusXY( dx, dy );
      }

      this.updateSplines();

      //Just observing the control points individually would lead to N expensive callbacks (instead of 1) for each of the N points
      //So we use this broadcast mechanism instead
      this.trigger( 'translated' );
    },

    //For purposes of showing the skater angle, get the view angle of the track here.  Note this means inverting the y values
    //This is called every step while animating on the track, so it was optimized to avoid new allocations
    getViewAngleAt: function( u ) {
      if ( this.xSplineDiff === null ) {
        this.xSplineDiff = this.xSpline.diff();
        this.ySplineDiff = this.ySpline.diff();
      }
      return Math.atan2( -SplineEvaluation.atNumber( this.ySplineDiff, u ), SplineEvaluation.atNumber( this.xSplineDiff, u ) );
    },

    //Get the model angle at the specified position on the track
    getModelAngleAt: function( u ) {
      if ( this.xSplineDiff === null ) {
        this.xSplineDiff = this.xSpline.diff();
        this.ySplineDiff = this.ySpline.diff();
      }
      return Math.atan2( SplineEvaluation.atNumber( this.ySplineDiff, u ), SplineEvaluation.atNumber( this.xSplineDiff, u ) );
    },

    //Get the model unit vector at the specified position on the track
    getUnitNormalVector: function( u ) {
      return Vector2.createPolar( 1, this.getModelAngleAt( u ) + Math.PI / 2 );
    },

    getUnitNormalVectorX: function( u ) {
      return Math.cos( this.getModelAngleAt( u ) + Math.PI / 2 );
    },

    getUnitNormalVectorY: function( u ) {
      return Math.sin( this.getModelAngleAt( u ) + Math.PI / 2 );
    },

    //Get the model parallel vector at the specified position on the track
    getUnitParallelVector: function( u ) {
      return Vector2.createPolar( 1, this.getModelAngleAt( u ) );
    },

    //Get the model parallel vector at the specified position on the track
    getUnitParallelVectorX: function( u ) {
      return Math.cos( this.getModelAngleAt( u ) );
    },

    //Get the model parallel vector at the specified position on the track
    getUnitParallelVectorY: function( u ) {
      return Math.sin( this.getModelAngleAt( u ) );
    },

    updateLinSpace: function() {
      this.minPoint = 0;
      this.maxPoint = (this.controlPoints.length - 1) / this.controlPoints.length;
      var prePoint = this.minPoint - 1E-6;
      var postPoint = this.maxPoint + 1E-6;

      //Store for performance
      //made number of sample points depend on the length of the track, to make it smooth enough no matter how long it is
      var n = 20 * (this.controlPoints.length - 1);
      this.searchLinSpace = numeric.linspace( prePoint, postPoint, n );
      this.distanceBetweenSamplePoints = (postPoint - prePoint) / n;
    },

    //Detect whether a parametric point is in bounds of this track, for purposes of telling whether the skater fell past the edge of the track
    isParameterInBounds: function( u ) { return u >= this.minPoint && u <= this.maxPoint; },

    //Setter/getter for physical property, mimic the PropertySet pattern instead of using PropertySet multiple inheritance
    get physical() { return this.physicalProperty.get(); },
    set physical( p ) {this.physicalProperty.set( p );},

    toString: function() {
      var string = '';
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        var point = this.controlPoints[i];
        string = string + '(' + point.position.x + ',' + point.position.y + ')';
      }
      return string;
    },

    getSnapTarget: function() {
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        var o = this.controlPoints[i];
        if ( o.snapTarget ) {
          return o.snapTarget;
        }
      }
      return null;
    },

    getBottomControlPointY: function() {
      var best = Number.POSITIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[i].sourcePosition.y < best ) {
          best = this.controlPoints[i].sourcePosition.y;
        }
      }
      return best;
    },

    getTopControlPointY: function() {
      var best = Number.NEGATIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[i].sourcePosition.y > best ) {
          best = this.controlPoints[i].sourcePosition.y;
        }
      }
      return best;
    },

    getLeftControlPointX: function() {
      var best = Number.POSITIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[i].sourcePosition.x < best ) {
          best = this.controlPoints[i].sourcePosition.x;
        }
      }
      return best;
    },

    getRightControlPointX: function() {
      var best = Number.NEGATIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[i].sourcePosition.x > best ) {
          best = this.controlPoints[i].sourcePosition.x;
        }
      }
      return best;
    },

    containsControlPoint: function( controlPoint ) {
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        if ( this.controlPoints[i] === controlPoint ) {
          return true;
        }
      }
      return false;
    },

    //Return an array which contains all of the Tracks that would need to be reset if this track was reset.
    getParentsOrSelf: function() { return this.parents || [this]; },

    returnToControlPanel: function() {
      if ( this.parents ) {
        this.modelTracks.remove( this );
        for ( var i = 0; i < this.parents.length; i++ ) {
          var parent = this.parents[i];
          parent.reset();
          this.modelTracks.add( parent );
        }
      }
      else {
        this.reset();
      }
    },

    /**
     * Returns the arc length (in meters) between two points on a parametric curve.
     * This function is at the heart of many nested loops, so it must be heavily optimized
     * @param {number} u0
     * @param {number} u1
     * @returns {number}
     */
    getArcLength: function( u0, u1 ) {
      if ( u1 === u0 ) {
        return 0;
      }
      if ( u1 < u0 ) {
        return -this.getArcLength( u1, u0 );
      }

      //Discrepancy with original version: original version had 10 subdivisions here.  We have reduced it to improve performance at the cost of numerical precision
      var numSegments = 4;
      var da = ( u1 - u0 ) / ( numSegments - 1 );
      var prevX = SplineEvaluation.atNumber( this.xSpline, u0 );
      var prevY = SplineEvaluation.atNumber( this.ySpline, u0 );
      var sum = 0;
      for ( var i = 1; i < numSegments; i++ ) {
        var a = u0 + i * da;
        var ptX = SplineEvaluation.atNumber( this.xSpline, a );
        var ptY = SplineEvaluation.atNumber( this.ySpline, a );

        var dx = prevX - ptX;
        var dy = prevY - ptY;

        sum += Math.sqrt( dx * dx + dy * dy );
        prevX = ptX;
        prevY = ptY;
      }
      return sum;
    },

    /**
     * Find the parametric distance along the track, starting at u0 and moving ds meters
     * @param {number} u0 the starting point along the track in parametric coordinates
     * @param {number} ds meters to traverse along the track
     * @returns {number}
     */
    getParametricDistance: function( u0, ds ) {
      var lowerBound = -1;
      var upperBound = 2;

      var guess = ( upperBound + lowerBound ) / 2.0;

      var metricDelta = this.getArcLength( u0, guess );
      var epsilon = 1E-8; //ORIGINAL ENERGY SKATE PARK BASICS HAD VALUE 1E-8

      var count = 0;
      while ( Math.abs( metricDelta - ds ) > epsilon ) {
        if ( metricDelta > ds ) {
          upperBound = guess;
        }
        else {
          lowerBound = guess;
        }
        guess = ( upperBound + lowerBound ) / 2.0;
        metricDelta = this.getArcLength( u0, guess );
        count++;
        if ( count > 100 ) {
          console.log( "binary search failed: count=" + count );
          break;
        }
      }
      return guess - u0;
    },

    //Compute the signed curvature as defined here: http://en.wikipedia.org/wiki/Curvature#Local_expressions
    //Used for centripetal force and determining whether the skater flies off the track
    //Curvature parameter is for storing the result as pass-by-value.  Sorry, see https://github.com/phetsims/energy-skate-park-basics/issues/50 regarding GC
    getCurvature: function( u, curvature ) {

      if ( this.xSplineDiff === null ) {
        this.xSplineDiff = this.xSpline.diff();
        this.ySplineDiff = this.ySpline.diff();
      }

      if ( this.xSplineDiffDiff === null ) {
        this.xSplineDiffDiff = this.xSplineDiff.diff();
        this.ySplineDiffDiff = this.ySplineDiff.diff();
      }

      var xP = SplineEvaluation.atNumber( this.xSplineDiff, u );
      var xPP = SplineEvaluation.atNumber( this.xSplineDiffDiff, u );
      var yP = SplineEvaluation.atNumber( this.ySplineDiff, u );
      var yPP = SplineEvaluation.atNumber( this.ySplineDiffDiff, u );

      var k = (xP * yPP - yP * xPP) /
              Math.pow( (xP * xP + yP * yP), 3 / 2 );

      //Using component-wise maths to avoid allocations, see #50
      var centerX = this.getX( u );
      var centerY = this.getY( u );

      var vectorX = this.getUnitNormalVectorX( u ) * 1 / k + centerX;
      var vectorY = this.getUnitNormalVectorY( u ) * 1 / k + centerY;

      curvature.r = 1 / k;
      curvature.x = vectorX;
      curvature.y = vectorY;
    },

    //Find the lowest y-point on the spline by sampling, used when dropping the track or a control point to ensure it won't go below y=0
    getLowestY: function() {
      if ( !this.xSearchPoints ) {
        this.xSearchPoints = SplineEvaluation.atArray( this.xSpline, this.searchLinSpace );
        this.ySearchPoints = SplineEvaluation.atArray( this.ySpline, this.searchLinSpace );
      }

      var min = Number.POSITIVE_INFINITY;
      var minIndex = -1;
      var y;
      for ( var i = 0; i < this.ySearchPoints.length; i++ ) {
        y = this.ySearchPoints[i];
        if ( y < min ) {
          min = y;
          minIndex = i;
        }
      }

      //Increase resolution in the neighborhood of y
      var foundU = this.searchLinSpace[minIndex];

      var minBound = foundU - this.distanceBetweenSamplePoints;
      var maxBound = foundU + this.distanceBetweenSamplePoints;

      var smallerSpace = numeric.linspace( minBound, maxBound, 200 );
      var refinedSearchPoints = SplineEvaluation.atArray( this.ySpline, smallerSpace );

      min = Number.POSITIVE_INFINITY;
      for ( i = 0; i < refinedSearchPoints.length; i++ ) {
        y = refinedSearchPoints[i];
        if ( y < min ) {
          min = y;
        }
      }

      return min;
    },

    //If any part of the track is below ground, move the whole track up so it rests at y=0 at its minimum, see #71
    //Called when user releases track or a control point after dragging
    bumpAboveGround: function() {
      var lowestY = this.getLowestY();
      if ( lowestY < 0 ) {
        this.translate( 0, -lowestY );
      }
    },

    //Use the position of the 0th control point as the position of the track, used when dragging the track.  Only used for relative positioning and translation, so an exact "position" is irrelevant
    //Use the source position instead of the snapped position or buggy "jumpy" behavior will occur, see #98
    get position() {
      return this.controlPoints[0].sourcePosition;
    },

    set position( p ) {
      var delta = p.minus( this.position );
      this.translate( delta.x, delta.y );
    },

    copyControlPointSources: function() {
      return this.controlPoints.map( function( controlPoint ) {return controlPoint.sourcePosition.copy();} );
    }
  } );
} );