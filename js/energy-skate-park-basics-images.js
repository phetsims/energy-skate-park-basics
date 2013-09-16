// Copyright 2002-2013, University of Colorado Boulder

/**
 * Module that defines the image names and gets a getImage method once they are loaded.  See SimLauncher.
 * Makes it possible to load through the module system rather than passed as parameter everywhere or used as global.
 *
 * @author Sam Reid
 */
define( function() {
  'use strict';

  return {
    imageNames: [
      'close-button.png',
      'mountains.png',
      'Mouse_pointer_or_cursor.png',
      'skater.png',
      'button_sim_pause.png',
      'button_sim_play.png',
      'button_step_deactivated.png',
      'button_step_hover.png',
      'button_step_pressed.png',
      'button_step_unpressed.png',
      'mountains.png',
      'reset_button_disabled.png',
      'reset_button_down.png',
      'reset_button_over.png',
      'reset_button_up.png'
    ]
  };
} );