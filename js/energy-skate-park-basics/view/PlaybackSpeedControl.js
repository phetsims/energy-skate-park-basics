// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node for the speed controls, with "normal" and "slow motion" radio buttons.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // phet-io modules
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // strings
  var normalString = require( 'string!ENERGY_SKATE_PARK_BASICS/normal' );
  var slowMotionString = require( 'string!ENERGY_SKATE_PARK_BASICS/slow.motion' );

  // constants
  var X_DILATION = 5;
  var Y_DILATION = 2;
  var RADIO_BUTTON_RADIUS = 7.1;

  /**
   * @param {Property<Number>} speedProperty the instantaneous speed of the skater (magnitude of the velocity vector)
   * @param {Tandem} tandem
   * @constructor
   */
  function PlaybackSpeedControl( speedProperty, tandem ) {

    var slowMotionRadioButton = new AquaRadioButton( speedProperty, 'slow', new TandemText( slowMotionString, {
      font: new PhetFont( 15 ),
      tandem: tandem.createTandem( 'slowMotionTextNode' )
    } ), {
      radius: RADIO_BUTTON_RADIUS,
      tandem: tandem.createTandem( 'slowMotionRadioButton' ),
      phetioValueType: TString
    } );
    var normalSpeedRadioButton = new AquaRadioButton( speedProperty, 'normal', new TandemText( normalString, {
      font: new PhetFont( 15 ),
      tandem: tandem.createTandem( 'normalSpeedTextNode' )
    } ), {
      radius: RADIO_BUTTON_RADIUS,
      x: 130,
      tandem: tandem.createTandem( 'normalSpeedButton' ),
      phetioValueType: TString
    } );
    slowMotionRadioButton.touchArea = slowMotionRadioButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );
    normalSpeedRadioButton.touchArea = normalSpeedRadioButton.localBounds.dilatedXY( X_DILATION, Y_DILATION );
    VBox.call( this, {
      align: 'left',
      spacing: 4,
      maxWidth: 142,
      children: [
        slowMotionRadioButton,
        normalSpeedRadioButton
      ]
    } );
  }

  energySkateParkBasics.register( 'PlaybackSpeedControl', PlaybackSpeedControl );

  return inherit( VBox, PlaybackSpeedControl );
} );