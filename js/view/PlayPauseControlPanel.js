//Copyright 2002-2013, University of Colorado

/**
 * Play/Pause and step button
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  function PlayPauseControlPanel( model, options ) {

    var playProperty = model.property( 'paused' ).not();
    var playPauseButton = new PlayPauseButton( playProperty );
    this.playButton = playPauseButton;
    var stepButton = new StepButton( function() { model.manualStep(); }, playProperty );
    model.property( 'paused' ).linkAttribute( stepButton, 'enabled' );
    _.extend( options, {spacing: 5, children: [playPauseButton, stepButton]} );
    HBox.call( this, options );
  }

  return inherit( HBox, PlayPauseControlPanel );
} );