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
  var HSlider = require( 'SUN/HSlider' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );

  function FrictionControl( model, view ) {
    var frictionRange = {min: 0, max: 2};
    var slider = new HSlider( model.frictionProperty, frictionRange, {enabledProperty: model.frictionEnabledProperty} );
    var tickFont = new PhetFont( 10 );
    slider.addMajorTick( frictionRange.min, new Text( 'None', { font: tickFont } ) );
    slider.addMajorTick( frictionRange.max, new Text( 'Lots', { font: tickFont } ) );
    var radioButtons = new HBox( {spacing: 15, children: [
      new AquaRadioButton( model.frictionEnabledProperty, false, new Text( 'Off' ), {radius: 10} ),
      new AquaRadioButton( model.frictionEnabledProperty, true, new Text( 'On' ), {radius: 10} )
    ]} );
    VBox.call( this, {children: [new Text( "Friction", new PhetFont( 14 ) ), radioButtons, slider]} );
  }

  return inherit( VBox, FrictionControl );
} );