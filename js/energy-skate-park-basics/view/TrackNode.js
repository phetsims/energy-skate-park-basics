// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the track, which can be translated by dragging the track, or manipulated by dragging its control points.
 * If the track's length is changed (by deleting a control point or linking two tracks together) and new TrackNode is created.
 *
 * TODO: Link tracks together by connecting them.
 * TODO: Show a dotted line along the track in 'stick to track' mode.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var LineStyles = require( 'KITE/util/LineStyles' );

  function TrackNode( model, track, modelViewTransform ) {
    var trackNode = this;
    Node.call( this, { renderer: 'svg' } );
    var road = new Path( null, {fill: 'black', cursor: track.interactive ? 'pointer' : 'default'} );
    this.addChild( road );
    var clickOffset = null;

    var dragHandler = new SimpleDragHandler( {
        allowTouchSnag: true,
        translate: function( options ) {
          var delta = options.delta;
          var modelDelta = modelViewTransform.viewToModelDelta( delta );
          track.translate( modelDelta.x, modelDelta.y );

          //If the user moved it out of the toolbox, then make it physically interactive
          track.physical = true;

          //TODO: if one of the control points is close enough to link to another track, do so
          var tracks = model.getPhysicalTracks();

          var bestDistance = null;
          var myBestPoint = null;
          var otherBestPoint = null;

          var myPoints = [track.controlPoints[0], track.controlPoints[track.controlPoints.length - 1]];

          for ( var i = 0; i < tracks.length; i++ ) {
            var t = tracks[i];
            if ( t !== track ) {

//              console.log( "comparing this = ", track.toString(), 'to', t.toString() );

              //4 cases 00, 01, 10, 11
              var otherPoints = [t.controlPoints[0], t.controlPoints[t.controlPoints.length - 1]];

              //don't match inner points

              for ( var j = 0; j < myPoints.length; j++ ) {
                var myPoint = myPoints[j];
                for ( var k = 0; k < otherPoints.length; k++ ) {
                  var otherPoint = otherPoints[k];
//                  debugger;
                  var distance = myPoint.sourcePosition.distance( otherPoint.position );
//                  console.log( distance );
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
            console.log( 'setting best to ', otherBestPoint.position.x, otherBestPoint.position.x, 'bestDistance', bestDistance );
            myBestPoint.snapTarget = otherBestPoint;

            //Set the opposite point to be unsnapped, you can only snap one at a time
            (myBestPoint === myPoints[0] ? myPoints[1] : myPoints[0]).snapTarget = null;
          }
          else {
            myPoints[0].snapTarget = null;
            myPoints[1].snapTarget = null;
          }
        },

        //TODO: When dropping the track in the toolbox, make nonphysical and reset coordinates
        //TODO: Connect tracks when released
        end: function() {
          var myPoints = [track.controlPoints[0], track.controlPoints[track.controlPoints.length - 1]];
          if ( myPoints[0].snapTarget || myPoints[1].snapTarget ) {
            model.joinTracks( track );
          }
        }
      }
    );

    if ( track.interactive ) {
      road.addInputListener( dragHandler );
    }

    //Reuse arrays to save allocations and prevent garbage collections
    var x = [];
    var y = [];

    //Store for performance
    var lastPt = (track.controlPoints.length - 1) / track.controlPoints.length;

    //Sample space, which is recomputed if the track gets longer, to keep it looking smooth no matter how many control points
    var linSpace = numeric.linspace( 0, lastPt, 20 * (track.controlPoints.length - 1) );
    var lengthForLinSpace = track.controlPoints.length;

    var updateTrackShape = function() {

      var i = 0;
      //Update the sample range when the number of control points has changed
      if ( lengthForLinSpace !== track.controlPoints.length ) {
        lastPt = (track.controlPoints.length - 1) / track.controlPoints.length;
        linSpace = numeric.linspace( 0, lastPt, 20 * (track.controlPoints.length - 1) );
        lengthForLinSpace = track.controlPoints.length;
      }

      //clear arrays, reusing them to save on garbage
      x.length = 0;
      y.length = 0;

      for ( i = 0; i < track.controlPoints.length; i++ ) {
        x.push( track.controlPoints[i].position.x );
        y.push( track.controlPoints[i].position.y );
      }

      //Compute points for lineTo
      var xPoints = track.xSpline.at( linSpace );
      var yPoints = track.ySpline.at( linSpace );

      var tx = trackNode.getTranslation();
      var shape = new Shape().moveTo( modelViewTransform.modelToViewX( xPoints[0] ) - tx.x, modelViewTransform.modelToViewY( yPoints[0] ) - tx.y );
      for ( i = 1; i < xPoints.length; i++ ) {
        shape.lineTo( modelViewTransform.modelToViewX( xPoints[i] ) - tx.x, modelViewTransform.modelToViewY( yPoints[i] ) - tx.y );
      }

      var strokeStyles = new LineStyles( {
        lineWidth: 10,
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10
      } );
      road.shape = shape.getStrokedShape( strokeStyles );
    };

    if ( track.interactive ) {
      for ( var i = 0; i < track.controlPoints.length; i++ ) {
        (function() {
          var controlPoint = track.controlPoints[i];
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
              start: function( event ) {
              },
              drag: function( event ) {

                var globalPoint = controlPointNode.globalToParentPoint( event.pointer.point );

                //trigger reconstruction of the track shape based on the control points
                controlPoint.position = modelViewTransform.viewToModelPosition( globalPoint );

                //If the user moved it out of the toolbox, then make it physically interactive
                track.physical = true;
              },
              translate: function() {

              },
              end: function( event ) {
              }
            } ) );
          trackNode.addChild( controlPointNode );
        })();
      }
    }
    //If any control point dragged, update the track
    for ( var index = 0; index < track.controlPoints.length; index++ ) {
      track.controlPoints[index].positionProperty.link( updateTrackShape );
    }

    track.addTranslationListener( function( dx, dy ) {
      trackNode.translate( modelViewTransform.modelToViewDelta( {x: dx, y: dy} ) );
    } );
  }

  return inherit( Node, TrackNode );
} );