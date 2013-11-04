/**
 * Copyright 2002-2013, University of Colorado
 * Control Play/Pause and Step buttons view
 *
 * @author Anton Ulyanov (Mlearner)
 * Copied from wave-on-a-string\js\view\control\PlayPauseButton.js on 9/13/2013
 * TODO: Factor out the copied code
 * TODO: render these buttons programmatically
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PushButton = require( 'SUN/PushButton' );
  var playButtonImage = require( 'image!ENERGY_SKATE_PARK_BASICS/button_sim_play.png' );
  var pauseButtonImage = require( 'image!ENERGY_SKATE_PARK_BASICS/button_sim_pause.png' );
  var stepButtonUnpressedImage = require( 'image!ENERGY_SKATE_PARK_BASICS/button_step_unpressed.png' );
  var stepButtonHoverImage = require( 'image!ENERGY_SKATE_PARK_BASICS/button_step_hover.png' );
  var stepButtonPressedImage = require( 'image!ENERGY_SKATE_PARK_BASICS/button_step_pressed.png' );
  var stepButtonDeactivatedImage = require( 'image!ENERGY_SKATE_PARK_BASICS/button_step_deactivated.png' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ToggleButton = require( 'SUN/ToggleButton' );

  function PlayPauseControlPanel( model, options ) {
    Node.call( this, {x: options.x, y: options.y, scale: 1} );
    var stepButton, playPauseButton;

    var step = function() {
      model.manualStep();
    };

    this.addChild( playPauseButton = new ToggleButton(
      new Image( playButtonImage ),
      new Image( pauseButtonImage ),
      model.pausedProperty,
      {scale: 0.7} ) );
    this.playButton = playPauseButton;

    this.addChild( stepButton = new PushButton(
      new Image( stepButtonUnpressedImage ),
      new Image( stepButtonHoverImage ),
      new Image( stepButtonPressedImage ),
      new Image( stepButtonDeactivatedImage ),
      {scale: 0.7, x: 50, y: 7, listener: step} ) );
    stepButton.enabled = false;

    model.pausedProperty.link( function updatePlayPauseButton( value ) {
      stepButton.enabled = value;
    } );
  }

  return inherit( Node, PlayPauseControlPanel );
} );