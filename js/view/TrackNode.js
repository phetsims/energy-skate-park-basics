// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the track, which can be translated by dragging the track, or manipulated by dragging its control points.
 * If the track's length is changed (by deleting a control point or linking two tracks together) a new TrackNode is created.
 * Keep track of whether the track is dragging, so performance can be optimized while dragging
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var LineStyles = require( 'KITE/util/LineStyles' );
  var SplineEvaluation = require( 'ENERGY_SKATE_PARK_BASICS/model/SplineEvaluation' );
  var ControlPointUI = require( 'ENERGY_SKATE_PARK_BASICS/view/ControlPointUI' );
  var ControlPointNode = require( 'ENERGY_SKATE_PARK_BASICS/view/ControlPointNode' );
  var TrackSegmentDragHandler = require( 'ENERGY_SKATE_PARK_BASICS/view/TrackSegmentDragHandler' );
  var dot = require( 'DOT/dot' );

  // constants
  var FastArray = dot.FastArray;

  /*
   * Constructor for TrackNode
   * @param model the entire model.  Not absolutely necessary, but so many methods are called on it for joining and
   * splitting tracks that we pass the entire model anyways.
   * @param track the track for this track node
   * @param modelViewTransform the model view transform for the view
   * @constructor
   */
  function TrackNode( model, track, modelViewTransform, availableBoundsProperty ) {
    var trackNode = this;
    this.track = track;
    this.model = model;
    this.modelViewTransform = modelViewTransform;
    this.availableBoundsProperty = availableBoundsProperty;
    Node.call( this );

    var road = new Path( null, {fill: 'gray', cursor: track.interactive ? 'pointer' : 'default'} );
    var centerLine = new Path( null, {stroke: 'black', lineWidth: '1.2', lineDash: [11, 8]} );
    model.property( 'detachable' ).link( function( detachable ) { centerLine.lineDash = detachable ? null : [11, 8]; } );

    this.addChild( road );
    this.addChild( centerLine );

    // Reuse arrays to save allocations and prevent garbage collections, see #38
    var x = new FastArray( track.controlPoints.length );
    var y = new FastArray( track.controlPoints.length );

    // Store for performance
    var lastPt = (track.controlPoints.length - 1) / track.controlPoints.length;

    // Sample space, which is recomputed if the track gets longer, to keep it looking smooth no matter how many control points
    var linSpace = numeric.linspace( 0, lastPt, 20 * (track.controlPoints.length - 1) );
    var lengthForLinSpace = track.controlPoints.length;

    var updateTrackShape = function() {

      var i;
      // Update the sample range when the number of control points has changed
      if ( lengthForLinSpace !== track.controlPoints.length ) {
        lastPt = (track.controlPoints.length - 1) / track.controlPoints.length;
        linSpace = numeric.linspace( 0, lastPt, 20 * (track.controlPoints.length - 1) );
        lengthForLinSpace = track.controlPoints.length;
      }

      // Arrays are fixed length, so just overwrite values
      for ( i = 0; i < track.controlPoints.length; i++ ) {
        x[i] = track.controlPoints[i].position.x;
        y[i] = track.controlPoints[i].position.y;
      }

      // Compute points for lineTo
      var xPoints = SplineEvaluation.atArray( track.xSpline, linSpace );
      var yPoints = SplineEvaluation.atArray( track.ySpline, linSpace );

      var tx = trackNode.getTranslation();
      var shape = new Shape().moveTo( modelViewTransform.modelToViewX( xPoints[0] ) - tx.x, modelViewTransform.modelToViewY( yPoints[0] ) - tx.y );

      // Show the track at reduced resolution while dragging so it will be smooth and responsive while dragging
      // (whether updating the entire track, some of the control points or both)
      var delta = track.dragging ? 3 : 1;
      for ( i = 1; i < xPoints.length; i = i + delta ) {
        shape.lineTo( modelViewTransform.modelToViewX( xPoints[i] ) - tx.x, modelViewTransform.modelToViewY( yPoints[i] ) - tx.y );
      }

      // If at reduced resolution, still make sure we draw to the end point
      if ( i !== xPoints.length - 1 ) {
        i = xPoints.length - 1;
        shape.lineTo( modelViewTransform.modelToViewX( xPoints[i] ) - tx.x, modelViewTransform.modelToViewY( yPoints[i] ) - tx.y );
      }

      var strokeStyles = new LineStyles( {
        lineWidth: 10,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10
      } );
      road.shape = shape.getStrokedShape( strokeStyles );
      centerLine.shape = shape;

      // Update the skater if the track is moved while the sim is paused,
      // see https:// github.com/phetsims/energy-skate-park-basics/issues/84
      if ( model.skater.track === track && model.paused ) {
        model.skater.position = track.getPoint( model.skater.u );
        model.skater.angle = model.skater.track.getViewAngleAt( model.skater.u ) + (model.skater.up ? 0 : Math.PI);
        model.skater.trigger( 'updated' );
      }
    };

    //If the track is interactive, make it draggable and make the control points visible and draggable
    if ( track.interactive ) {

      var trackSegmentDragHandler = new TrackSegmentDragHandler( this, updateTrackShape );
      road.addInputListener( trackSegmentDragHandler );

      for ( var i = 0; i < track.controlPoints.length; i++ ) {
        (function( i, isEndPoint ) {
          var controlPointNode = new ControlPointNode( trackNode, trackSegmentDragHandler, updateTrackShape, i, isEndPoint );
          trackNode.addChild( controlPointNode );
        })( i, i === 0 || i === track.controlPoints.length - 1 );
      }
    }

    // Init the track shape
    updateTrackShape();

    // Update the track shape when the whole track is translated
    // Just observing the control points individually would lead to N expensive callbacks (instead of 1) for each of the N points
    // So we use this broadcast mechanism instead
    track.on( 'translated', updateTrackShape );

    track.draggingProperty.link( function( dragging ) {
      if ( !dragging ) {
        updateTrackShape();
      }
    } );

    track.on( 'reset', updateTrackShape );
    track.on( 'smoothed', updateTrackShape );
  }

  return inherit( Node, TrackNode );
} );