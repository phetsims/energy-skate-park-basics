// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node UI for save and load.
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

    VBox.call( this, {children: [saveButton, loadButton]} );
  }

  return inherit( VBox, SaveLoadNode );
} );