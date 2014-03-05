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
   * @param model the entire model
   * @param track the track for this track node
   * @param modelViewTransform the model view transform for the view
   * @constructor
   */
  function TrackNode( model, track, modelViewTransform, availableBoundsProperty ) {
    var trackNode = this;
    Node.call( this );
    var road = new Path( null, {fill: 'gray', cursor: track.interactive ? 'pointer' : 'default'} );
    var dashedLine = new Path( null, {stroke: 'black', lineWidth: '1.2', lineDash: [11, 8]} );
    model.property( 'detachable' ).link( function( detachable ) { dashedLine.visible = !detachable; } );

    this.addChild( road );
    this.addChild( dashedLine );

    if ( track.interactive ) {
      var lastDragPoint;
      var startOffset = null;

      //Drag handler for dragging the track segment itself (not one of the control points)
      //Uses a similar strategy as MovableDragHandler but requires a separate implementation because its bounds are determined by the shape of the track (so it cannot go below ground)
      //And so it can be dragged out of the toolbox but not back into it (so it won't be dragged below ground)
      var trackSegmentDragHandler = new SimpleDragHandler( {
          allowTouchSnag: true,

          start: function( event ) {
            lastDragPoint = event.pointer.point;
            track.dragging = true;

            var location = modelViewTransform.modelToViewPosition( track.position );
            startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );
          },

          //Drag an entire track
          drag: function( event ) {
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

            var myPoints = [track.controlPoints[0], track.controlPoints[track.controlPoints.length - 1]];

            for ( var i = 0; i < tracks.length; i++ ) {
              var t = tracks[i];
              if ( t !== track ) {

                //4 cases 00, 01, 10, 11
                var otherPoints = [t.controlPoints[0], t.controlPoints[t.controlPoints.length - 1]];

                //don't match inner points
                for ( var j = 0; j < myPoints.length; j++ ) {
                  var myPoint = myPoints[j];
                  for ( var k = 0; k < otherPoints.length; k++ ) {
                    var otherPoint = otherPoints[k];
                    var distance = myPoint.sourcePosition.distance( otherPoint.position );
                    if ( (bestDistance === null && distance > 1E-6) || (distance < bestDistance ) ) {
                      bestDistance = distance;
                      myBestPoint = myPoint;
                      otherBestPoint = otherPoint;
                    }
                  }
                }
              }
            }

            if ( bestDistance !== null && bestDistance < 1 ) {
              myBestPoint.snapTarget = otherBestPoint;

              //Set the opposite point to be unsnapped, you can only snap one at a time
              (myBestPoint === myPoints[0] ? myPoints[1] : myPoints[0]).snapTarget = null;
            }
            else {
              myPoints[0].snapTarget = null;
              myPoints[1].snapTarget = null;
            }
          },

          //End the drag
          end: function() {
            var myPoints = [track.controlPoints[0], track.controlPoints[track.controlPoints.length - 1]];
            if ( myPoints[0].snapTarget || myPoints[1].snapTarget ) {
              model.joinTracks( track );
            }

            track.bumpAboveGround();
            track.dragging = false;
          }
        }
      );

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
      var xPoints = SplineEvaluation.at( track.xSpline, linSpace );
      var yPoints = SplineEvaluation.at( track.ySpline, linSpace );

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
      dashedLine.shape = shape;

      //Update the skater if the track is moved while the sim is paused, see https://github.com/phetsims/energy-skate-park-basics/issues/84
      if ( model.skater.track === track && model.paused ) {
        model.skater.position = track.getPoint( model.skater.u );
        model.skater.angle = model.skater.track.getViewAngleAt( model.skater.u ) + (model.skater.up ? 0 : Math.PI);
        model.skater.trigger( 'updated' );
      }
    };

    if ( track.interactive ) {
      for ( var i = 0; i < track.controlPoints.length; i++ ) {
        (function( i, isEndPoint ) {
          var controlPoint = track.controlPoints[i];

          //TODO: Don't allow the control points to be dragged offscreen
          var controlPointNode = new Circle( 14, {pickable: false, opacity: 0.7, stroke: 'black', lineWidth: 2, fill: 'red', cursor: 'pointer', translation: modelViewTransform.modelToViewPosition( controlPoint.position )} );

          //Show a dotted line for the exterior track points, which can be connected to other track
          if ( i === 0 || i === track.controlPoints.length - 1 ) {
            controlPointNode.lineDash = [ 4, 5 ];
          }

          //Make it so you can only translate the track to bring it out of the toolbox, but once it is out of the toolbox it can be reshaped
          track.physicalProperty.link( function( physical ) { controlPointNode.pickable = physical; } );

          controlPoint.positionProperty.link( function( position ) {
            controlPointNode.translation = modelViewTransform.modelToViewPosition( position );
          } );
          controlPointNode.addInputListener( new SimpleDragHandler(
            {
              allowTouchSnag: true,
              start: function() {
                track.dragging = true;
              },
              drag: function( event ) {
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
              },
              end: function() {
                if ( isEndPoint && controlPoint.snapTarget ) {
                  model.joinTracks( track );
                }
                track.bumpAboveGround();
                track.dragging = false;

                //Show the 'control point editing' ui
                trackNode.addChild( new ControlPointUI( model, track, i, modelViewTransform, trackNode ) );
              }
            } ) );
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
  }

  return inherit( Node, TrackNode );
} );