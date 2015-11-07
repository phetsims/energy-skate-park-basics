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

  /**
   * @param {Property<Number>} speedProperty the instantaneous speed of the skater (magnitude of the velocity vector)
   * @constructor
   */
  function PlaybackSpeedControl( speedProperty, options ) {
    var dilateX = 5;
    var dilateY = 2;
    var radioButtonRadius = 7.1;
    var slowMotionButton = new AquaRadioButton( speedProperty, 'slow', new Text( slowMotionString, { font: new PhetFont( 15 ) } ), {
      radius: radioButtonRadius,
      togetherID: options.slowSpeedRadioButtonTogetherID
    } );
    var normalButton = new AquaRadioButton( speedProperty, 'normal', new Text( normalString, { font: new PhetFont( 15 ) } ), {
      radius: radioButtonRadius,
      x: 130,
      togetherID: options.normalSpeedRadioButtonTogetherID
    } );
    slowMotionButton.touchArea = slowMotionButton.localBounds.dilatedXY( dilateX, dilateY );
    normalButton.touchArea = normalButton.localBounds.dilatedXY( dilateX, dilateY );
    VBox.call( this, {
      align: 'left',
      spacing: 4,
      children: [
        slowMotionButton,
        normalButton
      ]
    } );
  }

  return inherit( VBox, PlaybackSpeedControl );
} );