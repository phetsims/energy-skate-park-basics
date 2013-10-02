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
  var frictionString = require( 'string!ENERGY_SKATE_PARK/controls.friction.title' );
  var noneString = require( 'string!ENERGY_SKATE_PARK/controls.gravity.none' );
  var lotsString = require( 'string!ENERGY_SKATE_PARK/controls.gravity.lots' );

  function FrictionControl( model, view ) {
    var frictionRange = {min: 0, max: 2};
    var slider = new HSlider( model.frictionProperty, frictionRange, {tickLabelSpacing: 0} );
    var tickFont = new PhetFont( 10 );
    slider.addMajorTick( frictionRange.min, new Text( noneString, { font: tickFont } ) );
    slider.addMajorTick( frictionRange.max, new Text( lotsString, { font: tickFont } ) );

    //Space the friction label above the tick labels so that it won't overlap for i18n
    VBox.call( this, {spacing: -4, children: [new Text( frictionString, new PhetFont( 14 ) ), slider]} );
  }

  return inherit( VBox, FrictionControl );
} );