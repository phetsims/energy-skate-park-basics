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

  function PlaybackSpeedControl( speedProperty ) {
    VBox.call( this, {
      align: 'left',
      spacing: 2,
      children: [
        new AquaRadioButton( speedProperty, 'slow', new Text( slowMotionString, {font: new PhetFont( 15 )} ), {radius: 9.5} ),
        new AquaRadioButton( speedProperty, 'normal', new Text( normalString, {font: new PhetFont( 15 )} ), {radius: 9.5, x: 130} )
      ]} );
  }

  return inherit( VBox, PlaybackSpeedControl );
} );