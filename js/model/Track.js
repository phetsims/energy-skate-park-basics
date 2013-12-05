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
  var circularRegression = require( 'ENERGY_SKATE_PARK_BASICS/model/circularRegression' );

  /**
   * Model for a track, which has a fixed number of points.  If you added a point to a Track, you need a new track.
   * @param {ObservableArray<Track>} modelTracks all model tracks, so this track can add and remove others when joined/split
   * @param {Array<ControlPoint>} controlPoints
   * @param {Boolean} interactive
   * @param {Array<Number>} parents the original tracks that were used to make this track (if any) so they can be broken apart when dragged back to control panel
   * @constructor
   */
  function Track( modelTracks, controlPoints, interactive, parents ) {
    var track = this;
    this.parents = parents;
    this.modelTracks = modelTracks;

    PropertySet.call( this, {

      //True if the track can be interacted with.  For screens 1-2 only one track will be physical (and hence visible).
      //For screen 3, tracks in the control panel are visible but non-physical until dragged to the play area
      physical: false,

      //Flag that indicates whether the user is about to drop the track into the track creation panel
      overTrackPanel: false,

      //Flag that shows whether the track has been dragged fully out of the panel
      leftThePanel: false,

      //Keep track of whether the track is dragging, so performance can be optimized while dragging
      dragging: false
    } );

    //A track is ready to be returned to the track panel iff it has been taken out once and dragged over the panel
    this.addDerivedProperty( 'readyToReturn', ['overTrackPanel', 'leftThePanel'], function( overTrackPanel, leftThePanel ) {
      return overTrackPanel && leftThePanel;
    } );

    this.overTrackPanelProperty.lazyLink( function( overTrackPanel ) {
      if ( !overTrackPanel ) {
        track.leftThePanel = true;
      }
    } );

    this.controlPoints = controlPoints;

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

      for ( var i = 0; i < track.controlPoints.length; i++ ) {
        track.u.push( i / track.controlPoints.length );
        track.x.push( track.controlPoints[i].position.x );
        track.y.push( track.controlPoints[i].position.y );
      }

      track.xSpline = numeric.spline( track.u, track.x );
      track.ySpline = numeric.spline( track.u, track.y );

      //Mark search points as dirty
      track.xSearchPoints = null;
      track.ySearchPoints = null;
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
      var tolerance = 1E-6;
      var ax = this.xSpline.at( u - tolerance );
      var ay = -this.ySpline.at( u - tolerance );

      var bx = this.xSpline.at( u + tolerance );
      var by = -this.ySpline.at( u + tolerance );

      return Math.atan2( by - ay, bx - ax );
    },

    //For purposes of showing the skater angle, get the model angle of the track here.
    //This is called every step while animating on the track, so it was optimized to avoid new allocations
    getUnitNormalVector: function( u ) {
      var tolerance = 1E-6;
      var ax = this.xSpline.at( u - tolerance );
      var ay = this.ySpline.at( u - tolerance );

      var bx = this.xSpline.at( u + tolerance );
      var by = this.ySpline.at( u + tolerance );

      var angle = Math.atan2( by - ay, bx - ax );
      return Vector2.createPolar( 1, angle + Math.PI / 2 );
    },

    getUnitParallelVector: function( u ) {
      return this.getUnitNormalVector( u ).perpendicular();
    },

    updateLinSpace: function() {
      this.minPoint = 0;
      this.maxPoint = (this.controlPoints.length - 1) / this.controlPoints.length;
      var prePoint = this.minPoint - 1E-6;
      var postPoint = this.maxPoint + 1E-6;

      //Store for performance
      //made number of sample points depend on the length of the track, to make it smooth enough no matter how long it is
      this.searchLinSpace = numeric.linspace( prePoint, postPoint, 20 * (this.controlPoints.length - 1) );
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

    //Returns the euclidean distance between two points on a parametric curve.
    //This function is at the heart of many nested loops, so it must be heavily optimized
    getMetricDelta: function( a0, a1 ) {
      if ( a1 === a0 ) {
        return 0;
      }
      if ( a1 < a0 ) {
        return -this.getMetricDelta( a1, a0 );
      }

      //TODO: Perhaps this can be reduced to improve performance
      var numSegments = 10;//ORIGINAL ENERGY SKATE PARK BASICS HAD VALUE 10
      var da = ( a1 - a0 ) / ( numSegments - 1 );
      var prevX = this.xSpline.at( a0 );
      var prevY = this.ySpline.at( a0 );
      var sum = 0;
      for ( var i = 1; i < numSegments; i++ ) {
        var a = a0 + i * da;
        var ptX = this.xSpline.at( a );
        var ptY = this.ySpline.at( a );

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
    getFractionalDistance: function( u0, ds ) {
      var lowerBound = -1;
      var upperBound = 2;

      var guess = ( upperBound + lowerBound ) / 2.0;

      var metricDelta = this.getMetricDelta( u0, guess );
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
        metricDelta = this.getMetricDelta( u0, guess );
        count++;
        if ( count > 100 ) {
          console.log( "binary search failed: count=" + count );
          break;
        }
      }
//        EnergySkateParkLogging.println( "count = " + count );
      return guess - u0;
    },

    //TODO: avoid Vector2 alloc, perhaps write a customized 3-point circular regression
    getCurvature: function( u ) {
      return circularRegression( [
        new Vector2( this.getX( u ), this.getY( u ) ),
        new Vector2( this.getX( u - 1E-6 ), this.getY( u - 1E-6 ) ),
        new Vector2( this.getX( u + 1E-6 ), this.getY( u + 1E-6 ) )] );
    }
  } );
} );