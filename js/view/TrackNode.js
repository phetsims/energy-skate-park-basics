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

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var LineStyles = require( 'KITE/util/LineStyles' );
  var SplineEvaluation = require( 'ENERGY_SKATE_PARK_BASICS/model/SplineEvaluation' );
  var ControlPointUI = require( 'ENERGY_SKATE_PARK_BASICS/view/ControlPointUI' );

  /*
   * Constructor for TrackNode
   * @param model the entire model.  Not absolutely necessary, but so many methods are called on it for joining and splitting tracks that we pass the entire model anyways.
   * @param track the track for this track node
   * @param modelViewTransform the model view transform for the view
   * @constructor
   */
  function TrackNode( model, track, modelViewTransform, availableBoundsProperty ) {
    var trackNode = this;
    Node.call( this );

    //When dragging the track out of the toolbox, the control points should be able to drag the track.  However, don't use that feature if the track is already in the play area (physical) when created.
    var trackDropped = track.physical;

    var road = new Path( null, {fill: 'gray', cursor: track.interactive ? 'pointer' : 'default'} );
    var centerLine = new Path( null, {stroke: 'black', lineWidth: '1.2', lineDash: [11, 8]} );
    model.property( 'detachable' ).link( function( detachable ) { centerLine.lineDash = detachable ? null : [11, 8]; } );

    this.addChild( road );
    this.addChild( centerLine );

    if ( track.interactive ) {
      var lastDragPoint;
      var startOffset = null;

      //Keep track of whether the user has started to drag the track.  Click events should not create tracks, only drag events.  See #205
      var startedDrag = false;

      //Drag handler for dragging the track segment itself (not one of the control points)
      //Uses a similar strategy as MovableDragHandler but requires a separate implementation because its bounds are determined by the shape of the track (so it cannot go below ground)
      //And so it can be dragged out of the toolbox but not back into it (so it won't be dragged below ground)
      var trackSegmentDragHandlerOptions = {
        allowTouchSnag: true,

        start: function( event ) {

          //A new press has started, but the user has not moved the track yet, so do not create it yet.  See #205
          startedDrag = false;
        },

        //Drag an entire track
        drag: function( event ) {

          var snapTargetChanged = false;

          //Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
          if ( !model.containsTrack( track ) ) { return; }

          //On the first drag event, move the track out of the toolbox, see #205
          if ( !startedDrag ) {
            lastDragPoint = event.pointer.point;
            track.dragging = true;

            var startingPosition = modelViewTransform.modelToViewPosition( track.position );
            startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startingPosition );
            startedDrag = true;
          }
          track.dragging = true;

          var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
          var location = modelViewTransform.viewToModelPosition( parentPoint );

          //If the user moved it out of the toolbox above y=0, then make it physically interactive
          var bottomControlPointY = track.getBottomControlPointY();
          if ( !track.physical && bottomControlPointY > 0 ) {
            track.physical = true;
          }

          //When dragging track, make sure the control points don't go below ground, see #71
          var modelDelta = location.minus( track.position );
          var translatedBottomControlPointY = bottomControlPointY + modelDelta.y;

          if ( track.physical && translatedBottomControlPointY < 0 ) {
            location.y += Math.abs( translatedBottomControlPointY );
          }

          if ( availableBoundsProperty.value ) {

            //constrain each point to lie within the available bounds
            var availableBounds = availableBoundsProperty.value;

            //Constrain the top
            var topControlPointY = track.getTopControlPointY();
            if ( topControlPointY + modelDelta.y > availableBounds.maxY ) {
              location.y = availableBounds.maxY - (topControlPointY - track.position.y);
            }

            //Constrain the left side
            var leftControlPointX = track.getLeftControlPointX();
            if ( leftControlPointX + modelDelta.x < availableBounds.minX ) {
              location.x = availableBounds.minX - (leftControlPointX - track.position.x);
            }

            //Constrain the right side
            var rightControlPointX = track.getRightControlPointX();
            if ( rightControlPointX + modelDelta.x > availableBounds.maxX ) {
              location.x = availableBounds.maxX - (rightControlPointX - track.position.x);
            }
          }

          track.position = location;

          //If one of the control points is close enough to link to another track, do so
          var tracks = model.getPhysicalTracks();

          var bestDistance = null;
          var myBestPoint = null;
          var otherBestPoint = null;

          var points = [track.controlPoints[0], track.controlPoints[track.controlPoints.length - 1]];

          for ( var i = 0; i < tracks.length; i++ ) {
            var t = tracks[i];
            if ( t !== track ) {

              //4 cases 00, 01, 10, 11
              var otherPoints = [t.controlPoints[0], t.controlPoints[t.controlPoints.length - 1]];

              //don't match inner points
              for ( var j = 0; j < points.length; j++ ) {
                var point = points[j];
                for ( var k = 0; k < otherPoints.length; k++ ) {
                  var otherPoint = otherPoints[k];
                  var distance = point.sourcePosition.distance( otherPoint.position );
                  if ( (bestDistance === null && distance > 1E-6) || (distance < bestDistance ) ) {
                    bestDistance = distance;
                    myBestPoint = point;
                    otherBestPoint = otherPoint;
                  }
                }
              }
            }
          }

          if ( bestDistance !== null && bestDistance < 1 ) {
            if ( myBestPoint.snapTarget !== otherBestPoint ) {
              snapTargetChanged = true;
            }
            myBestPoint.snapTarget = otherBestPoint;

            //Set the opposite point to be unsnapped, you can only snap one at a time
            var source = (myBestPoint === points[0] ? points[1] : points[0]);
            if ( source.snapTarget !== null ) {
              snapTargetChanged = true;
            }
            source.snapTarget = null;
          }
          else {

            if ( points[0].snapTarget !== null || points[1].snapTarget !== null ) {
              snapTargetChanged = true;
            }
            points[0].snapTarget = null;
            points[1].snapTarget = null;
          }

          //It costs about 5fps to do this every frame (on iPad3), so only check if the snapTargets have changed.  See #235
          if ( snapTargetChanged ) {
            track.updateSplines();
            updateTrackShape();
          }

          //Make it so the track can't be dragged underground when dragged by the track itself (not control point), see #166
          //But if the user is dragging the track out of the toolbox, then leave the motion continuous, see #178
          if ( track.physical ) {
            track.bumpAboveGround();
          }

          model.trackModified( track );
        },

        //End the drag
        end: function() {

          //Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
          if ( !model.containsTrack( track ) ) { return; }

          //If the user never dragged the object, then there is no track to drop in this case, see #205
          if ( startedDrag ) {
            var myPoints = [track.controlPoints[0], track.controlPoints[track.controlPoints.length - 1]];
            if ( myPoints[0].snapTarget || myPoints[1].snapTarget ) {
              model.joinTracks( track );
            }

            track.bumpAboveGround();
            track.dragging = false;
            trackDropped = true;

            if ( window.phetcommon.getQueryParameter( 'debugTrack' ) ) {
              console.log( track.getDebugString() );
            }
            startedDrag = false;
          }
        }
      };
      var trackSegmentDragHandler = new SimpleDragHandler( trackSegmentDragHandlerOptions );

      road.addInputListener( trackSegmentDragHandler );
    }

    //Reuse arrays to save allocations and prevent garbage collections, see #38
    var x = new Array( track.controlPoints.length );
    var y = new Array( track.controlPoints.length );

    //Store for performance
    var lastPt = (track.controlPoints.length - 1) / track.controlPoints.length;

    //Sample space, which is recomputed if the track gets longer, to keep it looking smooth no matter how many control points
    var linSpace = numeric.linspace( 0, lastPt, 20 * (track.controlPoints.length - 1) );
    var lengthForLinSpace = track.controlPoints.length;

    var updateTrackShape = function() {

      var i;
      //Update the sample range when the number of control points has changed
      if ( lengthForLinSpace !== track.controlPoints.length ) {
        lastPt = (track.controlPoints.length - 1) / track.controlPoints.length;
        linSpace = numeric.linspace( 0, lastPt, 20 * (track.controlPoints.length - 1) );
        lengthForLinSpace = track.controlPoints.length;
      }

      //Arrays are fixed length, so just overwrite values
      for ( i = 0; i < track.controlPoints.length; i++ ) {
        x[i] = track.controlPoints[i].position.x;
        y[i] = track.controlPoints[i].position.y;
      }

      //Compute points for lineTo
      var xPoints = SplineEvaluation.atArray( track.xSpline, linSpace );
      var yPoints = SplineEvaluation.atArray( track.ySpline, linSpace );

      var tx = trackNode.getTranslation();
      var shape = new Shape().moveTo( modelViewTransform.modelToViewX( xPoints[0] ) - tx.x, modelViewTransform.modelToViewY( yPoints[0] ) - tx.y );

      //Show the track at reduced resolution while dragging so it will be smooth and responsive while dragging (whether updating the entire track, some of the control points or both)
      var delta = track.dragging ? 3 : 1;
      for ( i = 1; i < xPoints.length; i = i + delta ) {
        shape.lineTo( modelViewTransform.modelToViewX( xPoints[i] ) - tx.x, modelViewTransform.modelToViewY( yPoints[i] ) - tx.y );
      }

      //If at reduced resolution, still make sure we draw to the end point
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

      //Update the skater if the track is moved while the sim is paused, see https://github.com/phetsims/energy-skate-park-basics/issues/84
      if ( model.skater.track === track && model.paused ) {
        model.skater.position = track.getPoint( model.skater.u );
        model.skater.angle = model.skater.track.getViewAngleAt( model.skater.u ) + (model.skater.up ? 0 : Math.PI);
        model.skater.trigger( 'updated' );
      }
    };

    //Add the control points
    if ( track.interactive ) {
      for ( var i = 0; i < track.controlPoints.length; i++ ) {
        (function( i, isEndPoint ) {
          var controlPoint = track.controlPoints[i];

          var controlPointNode = new Circle( 14, {pickable: true, opacity: 0.7, stroke: 'black', lineWidth: 2, fill: 'red', cursor: 'pointer', translation: modelViewTransform.modelToViewPosition( controlPoint.position )} );

          //Show a dotted line for the exterior track points, which can be connected to other track
          if ( i === 0 || i === track.controlPoints.length - 1 ) {
            controlPointNode.lineDash = [ 4, 5 ];
          }

          controlPoint.positionProperty.link( function( position ) {
            controlPointNode.translation = modelViewTransform.modelToViewPosition( position );
          } );
          var dragEvents = 0;
          var controlPointInputListener = new SimpleDragHandler(
            {
              allowTouchSnag: true,
              start: function( event ) {

                //If control point dragged out of the control panel, translate the entire track, see #130
                if ( !track.physical || !trackDropped ) {
                  trackSegmentDragHandlerOptions.start( event );
                  return;
                }
                track.dragging = true;
                dragEvents = 0;
              },
              drag: function( event ) {

                //Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
                if ( !model.containsTrack( track ) ) { return; }

                //If control point dragged out of the control panel, translate the entire track, see #130
                if ( !track.physical || !trackDropped ) {
                  trackSegmentDragHandlerOptions.drag( event );
                  return;
                }
                dragEvents++;
                track.dragging = true;
                var globalPoint = controlPointNode.globalToParentPoint( event.pointer.point );

                //trigger reconstruction of the track shape based on the control points
                var pt = modelViewTransform.viewToModelPosition( globalPoint );

                //Constrain the control points to remain in y>0, see #71
                pt.y = Math.max( pt.y, 0 );

                if ( availableBoundsProperty.value ) {
                  var availableBounds = availableBoundsProperty.value;

                  //Constrain the control points to be onscreen, see #94
                  pt.x = Math.max( pt.x, availableBounds.minX );
                  pt.x = Math.min( pt.x, availableBounds.maxX );
                  pt.y = Math.min( pt.y, availableBounds.maxY );
                }

                controlPoint.sourcePosition = pt;

                if ( isEndPoint ) {
                  //If one of the control points is close enough to link to another track, do so
                  var tracks = model.getPhysicalTracks();

                  var bestDistance = Number.POSITIVE_INFINITY;
                  var bestMatch = null;

                  for ( var i = 0; i < tracks.length; i++ ) {
                    var t = tracks[i];
                    if ( t !== track ) {

                      //don't match inner points
                      var otherPoints = [t.controlPoints[0], t.controlPoints[t.controlPoints.length - 1]];

                      for ( var k = 0; k < otherPoints.length; k++ ) {
                        var otherPoint = otherPoints[k];
                        var distance = controlPoint.sourcePosition.distance( otherPoint.position );

                        if ( distance < bestDistance ) {
                          bestDistance = distance;
                          bestMatch = otherPoint;
                        }
                      }
                    }
                  }

                  controlPoint.snapTarget = bestDistance !== null && bestDistance < 1 ? bestMatch : null;
                }

                //When one control point dragged, update the track and the node shape
                track.updateSplines();
                updateTrackShape();
                model.trackModified( track );
              },
              end: function( event ) {

                //Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
                if ( !model.containsTrack( track ) ) { return; }

                //If control point dragged out of the control panel, translate the entire track, see #130
                if ( !track.physical || !trackDropped ) {
                  trackSegmentDragHandlerOptions.end( event );
                  return;
                }
                if ( isEndPoint && controlPoint.snapTarget ) {
                  model.joinTracks( track );
                }
                else {
                  track.smoothPointOfHighestCurvature( [i] );
                  model.trackModified( track );
                }
                track.bumpAboveGround();
                track.dragging = false;

                //Show the 'control point editing' ui, but only if the user didn't drag the control point.
                //Threshold at a few drag events in case the user didn't mean to drag it but accidentally moved it a few pixels.
                if ( dragEvents <= 3 ) {
                  var controlPointUI = new ControlPointUI( model, track, i, modelViewTransform, trackNode.parents[0] );
                  track.on( 'remove', function() { controlPointUI.detach(); } );
                  trackNode.parents[0].addChild( controlPointUI );
                }

                if ( window.phetcommon.getQueryParameter( 'debugTrack' ) ) {
                  console.log( track.getDebugString() );
                }
              }
            } );
          controlPointNode.addInputListener( controlPointInputListener );
          trackNode.addChild( controlPointNode );
        })( i, i === 0 || i === track.controlPoints.length - 1 );
      }
    }

    //Init the track shape
    updateTrackShape();

    //Update the track shape when the whole track is translated
    //Just observing the control points individually would lead to N expensive callbacks (instead of 1) for each of the N points
    //So we use this broadcast mechanism instead
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