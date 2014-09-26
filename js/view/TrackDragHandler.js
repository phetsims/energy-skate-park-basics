//  Copyright 2002-2014, University of Colorado Boulder

/**
 * The drag handler for moving the body of a track (not a control point).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {TrackNode} the track node that this listener will drag
   * @constructor
   */
  function TrackDragHandler( trackNode ) {
    var track = trackNode.track;
    var model = trackNode.model;
    var modelViewTransform = trackNode.modelViewTransform;
    var availableBoundsProperty = trackNode.availableBoundsProperty;
    var lastDragPoint;
    var startOffset = null;

    // Keep track of whether the user has started to drag the track.  Click events should not create tracks, only drag
    // events.  See #205
    var startedDrag = false;

    // Drag handler for dragging the track segment itself (not one of the control points)
    // Uses a similar strategy as MovableDragHandler but requires a separate implementation because its bounds are
    // determined by the shape of the track (so it cannot go below ground)
    // And so it can be dragged out of the toolbox but not back into it (so it won't be dragged below ground)
    var trackSegmentDragHandlerOptions = {
      allowTouchSnag: true,

      start: function( event ) {

        // A new press has started, but the user has not moved the track yet, so do not create it yet.  See #205
        startedDrag = false;
      },

      // Drag an entire track
      drag: function( event ) {

        var snapTargetChanged = false;

        // Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
        if ( !model.containsTrack( track ) ) { return; }

        // On the first drag event, move the track out of the toolbox, see #205
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

        // If the user moved it out of the toolbox above y=0, then make it physically interactive
        var bottomControlPointY = track.getBottomControlPointY();
        if ( !track.physical && bottomControlPointY > 0 ) {
          track.physical = true;
        }

        // When dragging track, make sure the control points don't go below ground, see #71
        var modelDelta = location.minus( track.position );
        var translatedBottomControlPointY = bottomControlPointY + modelDelta.y;

        if ( track.physical && translatedBottomControlPointY < 0 ) {
          location.y += Math.abs( translatedBottomControlPointY );
        }

        if ( availableBoundsProperty.value ) {

          // constrain each point to lie within the available bounds
          var availableBounds = availableBoundsProperty.value;

          // Constrain the top
          var topControlPointY = track.getTopControlPointY();
          if ( topControlPointY + modelDelta.y > availableBounds.maxY ) {
            location.y = availableBounds.maxY - (topControlPointY - track.position.y);
          }

          // Constrain the left side
          var leftControlPointX = track.getLeftControlPointX();
          if ( leftControlPointX + modelDelta.x < availableBounds.minX ) {
            location.x = availableBounds.minX - (leftControlPointX - track.position.x);
          }

          // Constrain the right side
          var rightControlPointX = track.getRightControlPointX();
          if ( rightControlPointX + modelDelta.x > availableBounds.maxX ) {
            location.x = availableBounds.maxX - (rightControlPointX - track.position.x);
          }
        }

        track.position = location;

        // If one of the control points is close enough to link to another track, do so
        var tracks = model.getPhysicalTracks();

        var bestDistance = null;
        var myBestPoint = null;
        var otherBestPoint = null;

        var points = [track.controlPoints[0], track.controlPoints[track.controlPoints.length - 1]];

        for ( var i = 0; i < tracks.length; i++ ) {
          var t = tracks[i];
          if ( t !== track ) {

            // 4 cases 00, 01, 10, 11
            var otherPoints = [t.controlPoints[0], t.controlPoints[t.controlPoints.length - 1]];

            // don't match inner points
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

          // Set the opposite point to be unsnapped, you can only snap one at a time
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

        // It costs about 5fps to do this every frame (on iPad3), so only check if the snapTargets have changed.  See #235
        if ( snapTargetChanged ) {
          track.updateSplines();
          trackNode.updateTrackShape();
        }

        // Make it so the track can't be dragged underground when dragged by the track itself (not control point), see #166
        // But if the user is dragging the track out of the toolbox, then leave the motion continuous, see #178
        if ( track.physical ) {
          track.bumpAboveGround();
        }

        model.trackModified( track );
      },

      // End the drag
      end: function() {

        // Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
        if ( !model.containsTrack( track ) ) { return; }

        // If the user never dragged the object, then there is no track to drop in this case, see #205
        if ( startedDrag ) {
          var myPoints = [track.controlPoints[0], track.controlPoints[track.controlPoints.length - 1]];
          if ( myPoints[0].snapTarget || myPoints[1].snapTarget ) {
            model.joinTracks( track );
          }

          track.bumpAboveGround();
          track.dragging = false;
          track.dropped = true;

          if ( window.phetcommon.getQueryParameter( 'debugTrack' ) ) {
            console.log( track.getDebugString() );
          }
          startedDrag = false;
        }
      }
    };
    this.trackSegmentDragHandlerOptions = trackSegmentDragHandlerOptions;
    SimpleDragHandler.call( this, trackSegmentDragHandlerOptions );
  }

  return inherit( SimpleDragHandler, TrackDragHandler, {

    // When the user drags the track out of the toolbox, if they drag the track by a control point, it still translates
    // the track.  In that case (and only that case), the following methods are called by the ControlPointNode drag
    // handler in order to translate the track.
    trackDragStarted: function( event ) {
      this.trackSegmentDragHandlerOptions.start( event );
    },
    trackDragged: function( event ) {
      this.trackSegmentDragHandlerOptions.drag( event );
    },
    trackDragEnded: function( event ) {
      this.trackSegmentDragHandlerOptions.end( event );
    }
  } );
} );