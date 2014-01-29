// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the energy skate park basics view (includes everything you see)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectanglePushButton = require( 'SUN/RectanglePushButton' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Rect = require( 'DOT/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Panel = require( 'SUN/Panel' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SkaterNode = require( 'ENERGY_SKATE_PARK_BASICS/view/SkaterNode' );
  var TrackNode = require( 'ENERGY_SKATE_PARK_BASICS/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BackgroundNode' );
  var EnergySkateParkBasicsControlPanel = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkBasicsControlPanel' );
  var PlaybackSpeedControl = require( 'ENERGY_SKATE_PARK_BASICS/view/PlaybackSpeedControl' );
  var BarGraphNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BarGraphNode' );
  var PieChartNode = require( 'ENERGY_SKATE_PARK_BASICS/view/PieChartNode' );
  var PieChartLegend = require( 'ENERGY_SKATE_PARK_BASICS/view/PieChartLegend' );
  var GridNode = require( 'ENERGY_SKATE_PARK_BASICS/view/GridNode' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var SceneSelectionPanel = require( 'ENERGY_SKATE_PARK_BASICS/view/SceneSelectionPanel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Vector2 = require( 'DOT/Vector2' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var TextPushButton = require( 'SUN/TextPushButton' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Path = require( 'SCENERY/nodes/Path' );
  var returnSkaterString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.reset-character' );
  var speedString = require( 'string!ENERGY_SKATE_PARK_BASICS/properties.speed' );
  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var eraser = require( 'image!ENERGY_SKATE_PARK_BASICS/eraser.png' );
  var TrackEditingNode = require( 'ENERGY_SKATE_PARK_BASICS/view/TrackEditingNode' );

  function SaveLoadNode( model ) {

    //TODO: Could drag off to save like chrome: http://www.thecssninja.com/demo/gmail_dragout/
    var saveButton = new TextPushButton( 'Save', {} );
    saveButton.addListener( function() {
      var state = model.get();
      console.log( 'saving\n', state );

      //Save to local file, see http://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
      location.href = "data:application/octet-stream," + encodeURIComponent( JSON.stringify( state ) );
    } );

//DND directly, or use file load button
    var loadButton = new TextPushButton( 'Load', {} );
    loadButton.addListener( function() {

    } );

    var handleFileSelect = function( evt ) {
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.dataTransfer.files; // FileList object.
      var f = null;
      // files is a FileList of File objects. List some properties.
      var output = [];
      for ( var i = 0; f = files[i]; i++ ) {
        output.push( '<li><strong>', escape( f.name ), '</strong> (', f.type || 'n/a', ') - ',
          f.size, ' bytes, last modified: ',
          f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
          '</li>' );
      }
      console.log( output.join( '' ) );
//        document.getElementById( 'list' ).innerHTML = '<ul>' + output.join( '' ) + '</ul>';

      var reader = new FileReader();

      f = files[0];
      console.log( 'f=' + f );
      // Closure to capture the file information.
      reader.onload = (function( theFile ) {
        return function( e ) {
          console.log( 'read file' );
          console.log( theFile );
          console.log( 'result', reader.result );

          var parsed = JSON.parse( reader.result );
          console.log( parsed );

          model.set( parsed );
        };
      })( f );

      // Read in the image file as a data URL.
      reader.readAsText( f );
    };

    var handleDragOver = function( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
      console.log( 'dragover!' );
    };

// Setup the dnd listeners.
    var dropZone = document.getElementById( 'sim' );
    dropZone.addEventListener( 'dragover', handleDragOver, false );
    dropZone.addEventListener( 'drop', handleFileSelect, false );

    VBox.call( this, {children: [saveButton, loadButton]} );
  }

  return inherit( VBox, SaveLoadNode );
} );