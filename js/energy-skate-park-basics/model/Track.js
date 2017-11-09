// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for one track in Energy Skate Park Basics, which contains the control points and cubic splines for
 * interpolating between them.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );
  var Emitter = require( 'AXON/Emitter' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SplineEvaluation = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/SplineEvaluation' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TTrack = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/TTrack' );

  // constants
  var FastArray = dot.FastArray;

  /**
   * Model for a track, which has a fixed number of points.  If you added a point to a Track, you need a new track.
   * @param {Events} events event source for sending messages
   * @param {ObservableArray<Track>} modelTracks all model tracks, so this track can add/remove others when joined/split
   * @param {Array<ControlPoint>} controlPoints
   * @param {boolean} interactive
   * @param {Array<Track>} parents the original tracks that were used to make this track (if any) so they can be
   * broken apart when dragged back to control panel
   * @param {Property<Bounds2>} availableModelBoundsProperty function that provides the visible model bounds, to prevent the
   * adjusted control point from going offscreen, see #195
   * @param {Tandem} tandem
   * @constructor
   */
  function Track( events, modelTracks, controlPoints, interactive, parents, availableModelBoundsProperty, tandem ) {
    var self = this;
    this.events = events;
    this.parents = parents;
    this.modelTracks = modelTracks;

    // @public (phet-io), see TTrackReference
    this.trackTandem = tandem;
    this.availableModelBoundsProperty = availableModelBoundsProperty;

    this.translatedEmitter = new Emitter();
    this.resetEmitter = new Emitter();
    this.smoothedEmitter = new Emitter();
    this.updateEmitter = new Emitter();
    this.removeEmitter = new Emitter();

    // Keep track of what component (control point or track body) is dragging the track, so that it can't be dragged by
    // two sources, which causes a flicker, see #282
    this.dragSource = null;

    // Flag to indicate whether the skater transitions from the right edge of this track directly to the ground, see #164
    this.slopeToGround = false;

    // Use an arbitrary position for translating the track during dragging.  Only used for deltas in relative
    // positioning and translation, so an exact "position" is irrelevant, see #260
    this._position = new Vector2( 0, 0 );

    // True if the track can be interacted with.  For screens 1-2 only one track will be physical (and hence visible).
    // For screen 3, tracks in the control panel are visible but non-physical until dragged to the play area
    this.physicalProperty = new Property( false, {
      tandem: tandem.createTandem( 'physicalProperty' ),
      phetioValueType: TBoolean
    } );

    // Flag that shows whether the track has been dragged fully out of the panel
    this.leftThePanelProperty = new Property( false, {
      tandem: tandem.createTandem( 'leftThePanelProperty' ),
      phetioValueType: TBoolean
    } );

    // Keep track of whether the track is dragging, so performance can be optimized while dragging
    this.draggingProperty = new Property( false, {
      tandem: tandem.createTandem( 'draggingProperty' ),
      phetioValueType: TBoolean
    } );

    // Flag to indicate whether the user has dragged the track out of the toolbox.  If dragging from the toolbox,
    // then dragging translates the entire track instead of just a point.
    this.droppedProperty = new Property( false, {
      tandem: tandem.createTandem( 'droppedProperty' ),
      phetioValueType: TBoolean
    } );

    var trackChangedListener = function() { events.trackChangedEmitter.emit(); };
    this.physicalProperty.link( trackChangedListener );

    this.controlPoints = controlPoints;
    assert && assert( this.controlPoints, 'control points should be defined' );

    this.interactive = interactive;
    this.parametricPosition = new FastArray( this.controlPoints.length );
    this.x = new FastArray( this.controlPoints.length );
    this.y = new FastArray( this.controlPoints.length );

    // Sampling points, which will be initialized and updated in updateLinSpace.  These points are evenly spaced
    // in the track parametric coordinates from just before the track parameter space to just after. See updateLinSpace
    this.searchLinSpace = null;
    this.distanceBetweenSamplePoints = null;

    this.updateLinSpace();
    this.updateSplines();

    tandem.addInstance( this, TTrack );

    // In the state.html wrapper, when the state changes, we must update the skater node
    phet.phetIo && phet.phetIo.phetio.setStateEmitter && phet.phetIo.phetio.setStateEmitter.addListener( function() {
      self.updateLinSpace();
      self.updateSplines();
      events.trackChangedEmitter.emit();
      events.updateEmitter.emit();
    } );

    this.disposeTrack = function() {
      tandem.removeInstance( self );
      self.physicalProperty.dispose();
      self.leftThePanelProperty.dispose();
      self.draggingProperty.dispose();
      self.droppedProperty.dispose();
    };
  }

  energySkateParkBasics.register( 'Track', Track );

  return inherit( Object, Track, {

    // when points change, update the spline instance
    updateSplines: function() {

      // Arrays are fixed length, so just overwrite values, see #38
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        this.parametricPosition[ i ] = i / this.controlPoints.length;
        this.x[ i ] = this.controlPoints[ i ].positionProperty.value.x;
        this.y[ i ] = this.controlPoints[ i ].positionProperty.value.y;
      }

      this.xSpline = numeric.spline( this.parametricPosition, this.x );
      this.ySpline = numeric.spline( this.parametricPosition, this.y );

      // Mark search points as dirty
      this.xSearchPoints = null;
      this.ySearchPoints = null;

      // Mark derivatives as dirty
      this.xSplineDiff = null;
      this.ySplineDiff = null;

      this.xSplineDiffDiff = null;
      this.ySplineDiffDiff = null;
    },
    reset: function() {
      this.physicalProperty.reset();
      this.leftThePanelProperty.reset();
      this.draggingProperty.reset();
      this.droppedProperty.reset();
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        this.controlPoints[ i ].reset();
      }

      // Broadcast message so that TrackNode can update the shape
      this.updateSplines();
      this.resetEmitter.emit();
    },

    /**
     * Returns the closest point (Euclidean) and position (parametric) on the track, as an object with {u,point}
     * also checks 1E-6 beyond each side of the track to see if the skater is beyond the edge of the track
     * This currently does a flat search, but if more precision is needed, a finer-grained binary search could be done
     * afterwards. This code is used when dragging the skater (to see if he is dragged near the track) and while the
     * skater is falling toward the track (to see if he should bounce/attach).
     *
     * @param {Vector2} point
     * @returns {{parametricPosition: number, point: Vector2, distance: Number}}
     */
    getClosestPositionAndParameter: function( point ) {

      // Compute the spline points for purposes of getting closest points.
      // keep these points around and invalidate only when necessary
      if ( !this.xSearchPoints ) {
        this.xSearchPoints = SplineEvaluation.atArray( this.xSpline, this.searchLinSpace );
        this.ySearchPoints = SplineEvaluation.atArray( this.ySpline, this.searchLinSpace );
      }

      var bestU = 0;
      var bestDistanceSquared = Number.POSITIVE_INFINITY;
      var bestPoint = new Vector2( 0, 0 );
      for ( var i = 0; i < this.xSearchPoints.length; i++ ) {
        var distanceSquared = point.distanceSquaredXY( this.xSearchPoints[ i ], this.ySearchPoints[ i ] );
        if ( distanceSquared < bestDistanceSquared ) {
          bestDistanceSquared = distanceSquared;
          bestU = this.searchLinSpace[ i ];
          bestPoint.x = this.xSearchPoints[ i ];
          bestPoint.y = this.ySearchPoints[ i ];
        }
      }

      // Binary search in the neighborhood of the best point, to refine the search
      var distanceBetweenSearchPoints = Math.abs( this.searchLinSpace[ 1 ] - this.searchLinSpace[ 0 ] );
      var topU = bestU + distanceBetweenSearchPoints / 2;
      var bottomU = bestU - distanceBetweenSearchPoints / 2;

      var topX = SplineEvaluation.atNumber( this.xSpline, topU );
      var topY = SplineEvaluation.atNumber( this.ySpline, topU );

      var bottomX = SplineEvaluation.atNumber( this.xSpline, bottomU );
      var bottomY = SplineEvaluation.atNumber( this.ySpline, bottomU );

      // Even at 400 binary search iterations, performance is smooth on iPad3, so this loop doesn't seem too invasive
      var maxBinarySearchIterations = 40;
      for ( i = 0; i < maxBinarySearchIterations; i++ ) {

        var topDistanceSquared = point.distanceSquaredXY( topX, topY );
        var bottomDistanceSquared = point.distanceSquaredXY( bottomX, bottomY );

        if ( topDistanceSquared < bottomDistanceSquared ) {
          bottomU = bottomU + (topU - bottomU) / 4;  // move halfway up
          bottomX = SplineEvaluation.atNumber( this.xSpline, bottomU );
          bottomY = SplineEvaluation.atNumber( this.ySpline, bottomU );
          bestDistanceSquared = topDistanceSquared;
        }
        else {
          topU = topU - (topU - bottomU) / 4;  // move halfway down
          topX = SplineEvaluation.atNumber( this.xSpline, topU );
          topY = SplineEvaluation.atNumber( this.ySpline, topU );
          bestDistanceSquared = bottomDistanceSquared;
        }
      }
      bestU = (topU + bottomU) / 2;
      bestPoint.x = SplineEvaluation.atNumber( this.xSpline, bestU );
      bestPoint.y = SplineEvaluation.atNumber( this.ySpline, bestU );

      return { parametricPosition: bestU, point: bestPoint, distance: bestDistanceSquared };
    },

    getX: function( parametricPosition ) { return SplineEvaluation.atNumber( this.xSpline, parametricPosition ); },
    getY: function( parametricPosition ) { return SplineEvaluation.atNumber( this.ySpline, parametricPosition ); },
    getPoint: function( parametricPosition ) {
      var x = SplineEvaluation.atNumber( this.xSpline, parametricPosition );
      var y = SplineEvaluation.atNumber( this.ySpline, parametricPosition );
      return new Vector2( x, y );
    },

    translate: function( dx, dy ) {
      this._position = this._position.plusXY( dx, dy );

      // move all the control points
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        var point = this.controlPoints[ i ];
        point.sourcePositionProperty.value = point.sourcePositionProperty.value.plusXY( dx, dy );
      }

      this.updateSplines();

      // Just observing the control points individually would lead to N expensive callbacks (instead of 1)
      // for each of the N points, So we use this broadcast mechanism instead
      this.translatedEmitter.emit();
    },

    // For purposes of showing the skater angle, get the view angle of the track here.  Note this means inverting the y
    // values, this is called every step while animating on the track, so it was optimized to avoid new allocations
    getViewAngleAt: function( parametricPosition ) {
      if ( this.xSplineDiff === null ) {
        this.xSplineDiff = this.xSpline.diff();
        this.ySplineDiff = this.ySpline.diff();
      }
      return Math.atan2( -SplineEvaluation.atNumber( this.ySplineDiff, parametricPosition ), SplineEvaluation.atNumber( this.xSplineDiff, parametricPosition ) );
    },

    // Get the model angle at the specified position on the track
    getModelAngleAt: function( parametricPosition ) {
      // load xSplineDiff, ySplineDiff here if not already loaded
      if ( this.xSplineDiff === null ) {
        this.xSplineDiff = this.xSpline.diff();
        this.ySplineDiff = this.ySpline.diff();
      }
      return Math.atan2( SplineEvaluation.atNumber( this.ySplineDiff, parametricPosition ), SplineEvaluation.atNumber( this.xSplineDiff, parametricPosition ) );
    },

    // Get the model unit vector at the specified position on the track
    getUnitNormalVector: function( parametricPosition ) {

      // load xSplineDiff, ySplineDiff here if not already loaded
      if ( this.xSplineDiff === null ) {
        this.xSplineDiff = this.xSpline.diff();
        this.ySplineDiff = this.ySpline.diff();
      }
      return new Vector2( -SplineEvaluation.atNumber( this.ySplineDiff, parametricPosition ), SplineEvaluation.atNumber( this.xSplineDiff, parametricPosition ) ).normalize();
    },

    // Get the model parallel vector at the specified position on the track
    getUnitParallelVector: function( parametricPosition ) {

      // load xSplineDiff, ySplineDiff here if not already loaded
      if ( this.xSplineDiff === null ) {
        this.xSplineDiff = this.xSpline.diff();
        this.ySplineDiff = this.ySpline.diff();
      }
      return new Vector2( SplineEvaluation.atNumber( this.xSplineDiff, parametricPosition ), SplineEvaluation.atNumber( this.ySplineDiff, parametricPosition ) ).normalize();
    },

    updateLinSpace: function() {
      this.minPoint = 0;
      this.maxPoint = (this.controlPoints.length - 1) / this.controlPoints.length;
      var prePoint = this.minPoint - 1E-6;
      var postPoint = this.maxPoint + 1E-6;

      // Store for performance
      // made number of sample points depend on the length of the track, to make it smooth enough no matter how long it is
      var n = 20 * (this.controlPoints.length - 1);
      this.searchLinSpace = numeric.linspace( prePoint, postPoint, n );
      this.distanceBetweenSamplePoints = (postPoint - prePoint) / n;
    },

    // Detect whether a parametric point is in bounds of this track, for purposes of telling whether the skater fell
    // past the edge of the track
    isParameterInBounds: function( parametricPosition ) {
      return parametricPosition >= this.minPoint && parametricPosition <= this.maxPoint;
    },

    toString: function() {
      var string = '';
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        var point = this.controlPoints[ i ];
        string = string + '(' + point.positionProperty.value.x + ',' + point.positionProperty.value.y + ')';
      }
      return string;
    },

    getSnapTarget: function() {
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        var o = this.controlPoints[ i ];
        if ( o.snapTargetProperty.value ) {
          return o.snapTargetProperty.value;
        }
      }
      return null;
    },

    getBottomControlPointY: function() {
      var best = Number.POSITIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[ i ].sourcePositionProperty.value.y < best ) {
          best = this.controlPoints[ i ].sourcePositionProperty.value.y;
        }
      }
      return best;
    },

    getTopControlPointY: function() {
      var best = Number.NEGATIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[ i ].sourcePositionProperty.value.y > best ) {
          best = this.controlPoints[ i ].sourcePositionProperty.value.y;
        }
      }
      return best;
    },

    getLeftControlPointX: function() {
      var best = Number.POSITIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[ i ].sourcePositionProperty.value.x < best ) {
          best = this.controlPoints[ i ].sourcePositionProperty.value.x;
        }
      }
      return best;
    },

    getRightControlPointX: function() {
      var best = Number.NEGATIVE_INFINITY;
      var length = this.controlPoints.length;
      for ( var i = 0; i < length; i++ ) {
        if ( this.controlPoints[ i ].sourcePositionProperty.value.x > best ) {
          best = this.controlPoints[ i ].sourcePositionProperty.value.x;
        }
      }
      return best;
    },

    containsControlPoint: function( controlPoint ) {
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        if ( this.controlPoints[ i ] === controlPoint ) {
          return true;
        }
      }
      return false;
    },

    // Return an array which contains all of the Tracks that would need to be reset if this track was reset.
    getParentsOrSelf: function() { return this.parents || [ this ]; },

    returnToControlPanel: function() {
      if ( this.parents ) {
        this.modelTracks.remove( this );
        for ( var i = 0; i < this.parents.length; i++ ) {
          var parent = this.parents[ i ];
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

      // Discrepancy with original version: original version had 10 subdivisions here.  We have reduced it to improve
      // performance at the cost of numerical precision
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
      var epsilon = 1E-8; // ORIGINAL ENERGY SKATE PARK BASICS HAD VALUE 1E-8

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
          assert && assert( count <= 100, 'binary search failed' );
          break;
        }
      }
      return guess - u0;
    },


    /**
     * Compute the signed curvature as defined here: http:// en.wikipedia.org/wiki/Curvature#Local_expressions
     * Used for centripetal force and determining whether the skater flies off the track
     * Curvature parameter is for storing the result as pass-by-value.
     * Sorry, see #50 regarding GC
     *
     * @param parametricPosition
     * @param curvature
     */
    getCurvature: function( parametricPosition, curvature ) {

      if ( this.xSplineDiff === null ) {
        this.xSplineDiff = this.xSpline.diff();
        this.ySplineDiff = this.ySpline.diff();
      }

      if ( this.xSplineDiffDiff === null ) {
        this.xSplineDiffDiff = this.xSplineDiff.diff();
        this.ySplineDiffDiff = this.ySplineDiff.diff();
      }

      var xP = SplineEvaluation.atNumber( this.xSplineDiff, parametricPosition );
      var xPP = SplineEvaluation.atNumber( this.xSplineDiffDiff, parametricPosition );
      var yP = SplineEvaluation.atNumber( this.ySplineDiff, parametricPosition );
      var yPP = SplineEvaluation.atNumber( this.ySplineDiffDiff, parametricPosition );

      var k = (xP * yPP - yP * xPP) /
              Math.pow( (xP * xP + yP * yP), 3 / 2 );

      // Using component-wise maths to avoid allocations, see #50
      var centerX = this.getX( parametricPosition );
      var centerY = this.getY( parametricPosition );

      var unitNormalVector = this.getUnitNormalVector( parametricPosition );
      var vectorX = unitNormalVector.x / k + centerX;
      var vectorY = unitNormalVector.y / k + centerY;

      curvature.r = 1 / k;
      curvature.x = vectorX;
      curvature.y = vectorY;
    },

    // Find the lowest y-point on the spline by sampling, used when dropping the track or a control point to ensure it
    // won't go below y=0
    getLowestY: function() {
      if ( !this.xSearchPoints ) {
        this.xSearchPoints = SplineEvaluation.atArray( this.xSpline, this.searchLinSpace );
        this.ySearchPoints = SplineEvaluation.atArray( this.ySpline, this.searchLinSpace );
      }

      var min = Number.POSITIVE_INFINITY;
      var minIndex = -1;
      var y;
      for ( var i = 0; i < this.ySearchPoints.length; i++ ) {
        y = this.ySearchPoints[ i ];
        if ( y < min ) {
          min = y;
          minIndex = i;
        }
      }

      // Increase resolution in the neighborhood of y
      var foundU = this.searchLinSpace[ minIndex ];

      var minBound = foundU - this.distanceBetweenSamplePoints;
      var maxBound = foundU + this.distanceBetweenSamplePoints;

      var smallerSpace = numeric.linspace( minBound, maxBound, 200 );
      var refinedSearchPoints = SplineEvaluation.atArray( this.ySpline, smallerSpace );

      min = Number.POSITIVE_INFINITY;
      for ( i = 0; i < refinedSearchPoints.length; i++ ) {
        y = refinedSearchPoints[ i ];
        if ( y < min ) {
          min = y;
        }
      }

      return min;
    },

    // If any part of the track is below ground, move the whole track up so it rests at y=0 at its minimum, see #71
    // Called when user releases track or a control point after dragging
    bumpAboveGround: function() {
      var lowestY = this.getLowestY();
      if ( lowestY < 0 ) {
        this.translate( 0, -lowestY );
      }
    },

    /**
     * Smooth out the track so it doesn't have any sharp turns, see #177
     * @param {number} i the index of the control point to adjust
     */
    smooth: function( i ) {
      assert && assert( i >= 0 && i < this.controlPoints.length );
      assert && assert( this.availableModelBoundsProperty );

      var availableModelBounds = this.availableModelBoundsProperty.value;
      assert && assert( availableModelBounds );

      var success = false;
      var numTries = 0;

      // Record the original control point location
      var originalX = this.controlPoints[ i ].sourcePositionProperty.value.x;
      var originalY = this.controlPoints[ i ].sourcePositionProperty.value.y;

      // Spiral outward, searching for a point that gives a smooth enough track.
      var distance = 0.01;
      var angle = 0;
      var MAX_TRIES = 80;
      var MAXIMUM_ACCEPTABLE_RADIUS_OF_CURVATURE = 0.03;

      while ( this.getMinimumRadiusOfCurvature() < MAXIMUM_ACCEPTABLE_RADIUS_OF_CURVATURE && numTries < MAX_TRIES ) {
        var delta = Vector2.createPolar( distance, angle );
        var proposedPosition = delta.plusXY( originalX, originalY );

        // Only search within the visible model bounds, see #195
        var containsPoint = availableModelBounds.containsPoint( proposedPosition );
        if ( containsPoint ) {
          this.controlPoints[ i ].sourcePositionProperty.value = proposedPosition;
          this.updateSplines();
        }
        angle = angle + Math.PI / 9;
        distance = distance + 0.07;
        numTries++;
      }

      // Could not find a better solution, leave the control point where it started.
      if ( numTries >= MAX_TRIES ) {
        this.controlPoints[ i ].sourcePositionProperty.value = new Vector2( originalX, originalY );
        this.updateSplines();
      }
      else {
        success = true;
      }

      this.smoothedEmitter.emit();
      return success;
    },

    /**
     * The user just released a control point with index (indexToIgnore) and the spline needs to be smoothed.
     * Choose the point closest to the sharpest turn and adjust it.
     * @param {Array} indicesToIgnore indices which should not be adjusted (perhaps because the user just released them)
     */
    smoothPointOfHighestCurvature: function( indicesToIgnore ) {

      // Find the sharpest turn on the track
      var highestCurvatureU = this.getUWithHighestCurvature();

      // find the point closest (in parametric coordinates) to the sharpest turn, but not including the indexToIgnore
      // it looks like the control points are equally spaced in parametric coordinates (see the constructor)
      var bestDistance = Number.POSITIVE_INFINITY;
      var bestIndex = -1;
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        if ( indicesToIgnore.indexOf( i ) === -1 ) {
          var controlPointU = i / this.controlPoints.length;
          var distanceFromHighestCurvature = Math.abs( highestCurvatureU - controlPointU );
          if ( distanceFromHighestCurvature < bestDistance ) {
            bestDistance = distanceFromHighestCurvature;
            bestIndex = i;
          }
        }
      }

      // If smoothing succeeded, all is well, otherwise try smoothing based on another point, see #198
      var success = this.smooth( bestIndex );
      if ( success ) {
        return true;
      }
      else {
        indicesToIgnore.push( bestIndex );
        if ( indicesToIgnore.length === this.controlPoints.length ) {
          return false;
        }
        else {
          return this.smoothPointOfHighestCurvature( indicesToIgnore );
        }
      }
    },

    getUWithHighestCurvature: function() {
      // Below implementation copied from getMinimumRadiusOfCurvature.  It is a CPU demanding task, so kept separate to
      // keep the other one fast. Should be kept in sync manually
      var curvature = { r: 0, x: 0, y: 0 };
      var minRadius = Number.POSITIVE_INFINITY;
      var bestU = 0;

      // Search the entire space of the spline.  Larger number of divisions was chosen to prevent large curvatures at a
      // single sampling point.
      var numDivisions = 400;
      var du = (this.maxPoint - this.minPoint) / numDivisions;
      for ( var parametricPosition = this.minPoint; parametricPosition < this.maxPoint; parametricPosition += du ) {
        this.getCurvature( parametricPosition, curvature );
        var r = Math.abs( curvature.r );
        if ( r < minRadius ) {
          minRadius = r;
          bestU = parametricPosition;
        }
      }
      return bestU;
    },

    /**
     * Find the minimum radius of curvature along the track, in meters
     * @returns {number} the minimum radius of curvature along the track, in meters.
     */
    getMinimumRadiusOfCurvature: function() {
      var curvature = { r: 0, x: 0, y: 0 };
      var minRadius = Number.POSITIVE_INFINITY;

      // Search the entire space of the spline.  Larger number of divisions was chosen to prevent large curvatures at a
      // single sampling point.
      var numDivisions = 400;
      var du = (this.maxPoint - this.minPoint) / numDivisions;
      for ( var parametricPosition = this.minPoint; parametricPosition < this.maxPoint; parametricPosition += du ) {
        this.getCurvature( parametricPosition, curvature );
        var r = Math.abs( curvature.r );
        if ( r < minRadius ) {
          minRadius = r;
        }
      }
      return minRadius;
    },

    // Use an arbitrary position for translating the track during dragging.  Only used for deltas in relative
    // positioning and translation, so an exact "position" is irrelevant.
    get position() {
      return this._position.copy();
    },

    set position( newPosition ) {
      var delta = newPosition.minus( this.position );
      this.translate( delta.x, delta.y );
    },

    copyControlPointSources: function() {
      return this.controlPoints.map( function( controlPoint ) {return controlPoint.sourcePositionProperty.value.copy();} );
    },

    getDebugString: function() {
      var string = 'var controlPoints = [';
      for ( var i = 0; i < this.controlPoints.length; i++ ) {
        var controlPoint = this.controlPoints[ i ];
        string += 'new ControlPoint(' + controlPoint.positionProperty.value.x + ',' + controlPoint.positionProperty.value.y + ')';
        if ( i < this.controlPoints.length - 1 ) {
          string += ',';
        }
      }
      return string + '];';
    },

    dispose: function() {
      this.disposeTrack();
    },

    /**
     * Dispose all of the control points of the track when they will not be reused in another track
     * @public
     */
    disposeControlPoints: function() {
      this.controlPoints.forEach( function( controlPoint ) {
        controlPoint.dispose();
      } );
    }
  } );
} );
