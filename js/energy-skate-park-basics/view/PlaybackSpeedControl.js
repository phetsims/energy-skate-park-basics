// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the speed controls, with "normal" and "slow motion" radio buttons.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function PlayPauseControlPanel( model, options ) {
    VBox.call( this, {align: 'left', spacing: 4, children: [
      new AquaRadioButton( model.speedProperty, 'normal', new Text( 'Normal', {font: new PhetFont( 15 )} ), {radius: 12, x: 130} ),
      new AquaRadioButton( model.speedProperty, 'slow', new Text( 'Slow Motion', {font: new PhetFont( 15 )} ), {radius: 12} )
    ]} );
  }

  return inherit( VBox, PlayPauseControlPanel );
} );