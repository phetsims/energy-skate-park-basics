// Copyright 2014-2017, University of Colorado Boulder

/**
 * The scenery node that shows a control point on a track, and allows the user to drag it or click on it for more
 * options.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ControlPointUI = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/ControlPointUI' );
  var Emitter = require( 'AXON/Emitter' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkBasicsQueryParameters = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // phet-io modules
  var ControlPointNodeIO = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/ControlPointNodeIO' );

  /**
   * @param {TrackNode} trackNode
   * @param {TrackDragHandler} trackDragHandler
   * @param {number} i
   * @param {boolean} isEndPoint
   * @param {Tandem} tandem
   * @constructor
   */
  function ControlPointNode( trackNode, trackDragHandler, i, isEndPoint, tandem ) {
    var track = trackNode.track;
    var model = trackNode.model;
    var modelViewTransform = trackNode.modelViewTransform;
    var availableBoundsProperty = trackNode.availableBoundsProperty;
    var controlPointUIShownEmitter = new Emitter( {
      tandem: tandem.createTandem( 'controlPointUIShownEmitter' ),
      phetioArgumentTypes: []
    } );

    var self = this;
    var controlPoint = track.controlPoints[ i ];

    // Default colors for the control point fill and highlight
    var fill = 'red';
    var highlightedFill = '#c90606';

    // When mousing over the control point, highlight it like a button, to hint that it can be pressed to show the
    // cut/delete buttons, see #234
    var opacity = 0.7;
    var highlightedOpacity = 0.85;

    Circle.call( this, 14, {
      pickable: true,
      opacity: opacity,
      stroke: 'black',
      lineWidth: 2,
      fill: fill,
      cursor: 'pointer',
      translation: modelViewTransform.modelToViewPosition( controlPoint.positionProperty.value ),
      tandem: tandem,
      phetioType: ControlPointNodeIO
    } );

    // Show a dotted line for the exterior track points, which can be connected to other track
    if ( i === 0 || i === track.controlPoints.length - 1 ) {
      self.lineDash = [ 4, 5 ];
    }

    controlPoint.positionProperty.link( function( position ) {
      self.translation = modelViewTransform.modelToViewPosition( position );
    } );
    var dragEvents = 0;
    var lastControlPointUI = null;
    var inputListener = new SimpleDragHandler( {
      tandem: tandem.createTandem( 'inputListener' ),
      allowTouchSnag: true,
      start: function( event ) {

        // Move the track to the front when it starts dragging, see #296
        // The track is in a layer of tracks (without other nodes) so moving it to the front will work perfectly
        trackNode.moveToFront();

        // If control point dragged out of the control panel, translate the entire track, see #130
        if ( !track.physicalProperty.value || !track.droppedProperty.value ) {

          // Only start a track drag if nothing else was dragging the track (which caused a flicker), see #282
          if ( track.dragSource === null ) {
            track.dragSource = inputListener;
            trackDragHandler.trackDragStarted( event );
          }
          return;
        }
        track.draggingProperty.value = true;
        dragEvents = 0;
      },
      drag: function( event ) {

        // Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
        if ( !model.containsTrack( track ) ) { return; }

        // If control point dragged out of the control panel, translate the entire track, see #130
        if ( !track.physicalProperty.value || !track.droppedProperty.value ) {

          // Only drag a track if nothing else was dragging the track (which caused a flicker), see #282
          if ( track.dragSource === inputListener ) {
            trackDragHandler.trackDragged( event );
          }
          return;
        }
        dragEvents++;
        track.draggingProperty.value = true;
        var globalPoint = self.globalToParentPoint( event.pointer.point );

        // trigger reconstruction of the track shape based on the control points
        var pt = modelViewTransform.viewToModelPosition( globalPoint );

        // Constrain the control points to remain in y>0, see #71
        pt.y = Math.max( pt.y, 0 );

        if ( availableBoundsProperty.value ) {
          var availableBounds = availableBoundsProperty.value;

          // Constrain the control points to be onscreen, see #94
          pt.x = Math.max( pt.x, availableBounds.minX );
          pt.x = Math.min( pt.x, availableBounds.maxX );
          pt.y = Math.min( pt.y, availableBounds.maxY );
        }

        controlPoint.sourcePositionProperty.value = pt;

        if ( isEndPoint ) {
          // If one of the control points is close enough to link to another track, do so
          var tracks = model.getPhysicalTracks();

          var bestDistance = Number.POSITIVE_INFINITY;
          var bestMatch = null;

          for ( var i = 0; i < tracks.length; i++ ) {
            var t = tracks[ i ];
            if ( t !== track ) {

              // don't match inner points
              var otherPoints = [ t.controlPoints[ 0 ], t.controlPoints[ t.controlPoints.length - 1 ] ];

              for ( var k = 0; k < otherPoints.length; k++ ) {
                var otherPoint = otherPoints[ k ];
                var distance = controlPoint.sourcePositionProperty.value.distance( otherPoint.positionProperty.value );

                if ( distance < bestDistance ) {
                  bestDistance = distance;
                  bestMatch = otherPoint;
                }
              }
            }
          }

          controlPoint.snapTargetProperty.value = bestDistance !== null && bestDistance < 1 ? bestMatch : null;
        }

        // When one control point dragged, update the track and the node shape
        track.updateSplines();
        trackNode.updateTrackShape();
        model.trackModified( track );
      },
      end: function( event ) {

        // Check whether the model contains a track so that input listeners for detached elements can't create bugs, see #230
        if ( !model.containsTrack( track ) ) { return; }

        // If control point dragged out of the control panel, translate the entire track, see #130
        if ( !track.physicalProperty.value || !track.droppedProperty.value ) {

          // Only drop a track if nothing else was dragging the track (which caused a flicker), see #282
          if ( track.dragSource === inputListener ) {
            trackDragHandler.trackDragEnded( event );
          }
          return;
        }
        if ( isEndPoint && controlPoint.snapTargetProperty.value ) {
          model.joinTracks( track );
        }
        else {
          track.smoothPointOfHighestCurvature( [ i ] );
          model.trackModified( track );
        }

        // The above steps can dispose a track.  If so, do not try to modify the track further, see https://github.com/phetsims/energy-skate-park-basics/issues/396
        if ( track.trackDisposed ) { return; }

        track.bumpAboveGround();
        track.draggingProperty.value = false;

        // Show the 'control point editing' ui, but only if the user didn't drag the control point.
        // Threshold at a few drag events in case the user didn't mean to drag it but accidentally moved it a few pixels.
        // Make sure the track hasn't recently detached (was seen twice in ?fuzzMouse&fuzzRate=100 testing)
        if ( dragEvents <= 3 && trackNode.parents.length > 0 ) {

          controlPointUIShownEmitter.emit();

          lastControlPointUI && lastControlPointUI.dispose();

          lastControlPointUI = new ControlPointUI(
            model,
            track,
            i,
            modelViewTransform,
            trackNode.parents[ 0 ],
            tandem.createTandem( 'controlPointUI' )
          );

          // If the track was removed, get rid of the buttons
          var removalListener = function() {
            lastControlPointUI && lastControlPointUI.dispose();
            lastControlPointUI = null;
          };
          track.removeEmitter.addListener( removalListener );

          // If the track has translated, hide the buttons, see #272
          track.translatedEmitter.addListener( removalListener );

          trackNode.parents[ 0 ].addChild( lastControlPointUI );
        }

        if ( EnergySkateParkBasicsQueryParameters.debugTrack ) {
          console.log( track.getDebugString() );
        }
      }
    } );
    inputListener.over = function() {
      if ( track.physicalProperty.value && !track.draggingProperty.value ) {
        self.opacity = highlightedOpacity;
        self.fill = highlightedFill;
      }
    };
    inputListener.out = function() {
      self.opacity = opacity;
      self.fill = fill;
    };
    self.addInputListener( inputListener );
  }

  energySkateParkBasics.register( 'ControlPointNode', ControlPointNode );

  return inherit( Circle, ControlPointNode );
} );