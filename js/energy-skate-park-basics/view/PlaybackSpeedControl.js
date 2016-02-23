// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node for the speed controls, with "normal" and "slow motion" radio buttons.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var normalString = require( 'string!ENERGY_SKATE_PARK_BASICS/normal' );
  var slowMotionString = require( 'string!ENERGY_SKATE_PARK_BASICS/slow.motion' );

  // constants
  var X_DILATION = 5;
  var Y_DILATION = 2;
  var RADIO_BUTTON_RADIUS = 7.1;

  /**
   * @param {Property<Number>} speedProperty the instantaneous speed of the skater (magnitude of the velocity vector)
   * @constructor
   */
  function PlaybackSpeedControl( speedProperty, options ) {

    var slowMotionButton = new AquaRadioButton( speedProperty, 'slow', new Text( slowMotionString, { font: new PhetFont( 15 ) } ), {
      radius: RADIO_BUTTON_RADIUS,
      phetioID: options.slowSpeedRadioButtonPhETIOID
    } );
    var normalButton = new AquaRadioButton( speedProperty, 'normal', new Text( normalString, { font: new PhetFont( 15 ) } ), {
      radius: RADIO_BUTTON_RADIUS,
      x: 130,
      phetioID: options.normalSpeedRadioButtonPhETIOID
    } );
    slowMotionButton.touchArea = slowMotionButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );
    normalButton.touchArea = normalButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );
    VBox.call( this, {
      align: 'left',
      spacing: 4,
      maxWidth: 142,
      children: [
        slowMotionButton,
        normalButton
      ]
    } );
  }

  return inherit( VBox, PlaybackSpeedControl );
} );