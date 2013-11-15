// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the speed controls, with "normal" and "slow motion" radio buttons.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var normalString = require( 'string!ENERGY_SKATE_PARK_BASICS/normal' );
  var slowMotionString = require( 'string!ENERGY_SKATE_PARK_BASICS/slow.motion' );

  function PlayPauseControlPanel( model ) {
    VBox.call( this, {align: 'left', spacing: 4, children: [
      new AquaRadioButton( model.speedProperty, 'normal', new Text( normalString, {font: new PhetFont( 15 )} ), {radius: 12, x: 130} ),
      new AquaRadioButton( model.speedProperty, 'slow', new Text( slowMotionString, {font: new PhetFont( 15 )} ), {radius: 12} )
    ]} );
  }

  return inherit( VBox, PlayPauseControlPanel );
} );