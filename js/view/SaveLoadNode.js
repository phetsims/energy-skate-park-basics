// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the energy skate park basics view (includes everything you see)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var TextPushButton = require( 'SUN/TextPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );

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