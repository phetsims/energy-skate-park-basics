// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the friction control, including on/off radio buttons and a slider. Only shown in screens 2-3.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );

  function StickToTrackControl( model, view ) {
    VBox.call( this, {children: [
      new Text( "Stick to Track", new PhetFont( 14 ) ),
      new HBox( {spacing: 15, children: [
        new AquaRadioButton( model.stickToTrackProperty, false, new Text( 'Off' ), {radius: 10} ),
        new AquaRadioButton( model.stickToTrackProperty, true, new Text( 'On' ), {radius: 10} )
      ]} )]} );
  }

  return inherit( VBox, StickToTrackControl );
} );