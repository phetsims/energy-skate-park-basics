// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the control panel, with view settings and controls.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Panel = require( 'SUN/Panel' );
  var detachIcon = require( 'image!ENERGY_SKATE_PARK_BASICS/detach.png' );
  var attachIcon = require( 'image!ENERGY_SKATE_PARK_BASICS/attach.png' );
  var RadioButton = require( 'SUN/RadioButton' );

  function AttachDetachToggleButtons( detachableProperty ) {
    var scale = 0.32;
    var selectedStroke = '#3291b8';//Same color as slider knob
    var deselectedStroke = null;
    var panelOptions = {
      xMargin: 0,
      yMargin: 0,
      cornerRadius: 6
    };
    var lineWidth = 1.6;
    var selectedOptions = _.extend( {stroke: selectedStroke, lineWidth: lineWidth, opacity: 1}, panelOptions );
    var deselectedOptions = _.extend( {stroke: deselectedStroke, lineWidth: lineWidth, opacity: 0.5}, panelOptions );
    var attachButton = new RadioButton( detachableProperty, false, new Panel( new Image( attachIcon, {scale: scale} ), selectedOptions ), new Panel( new Image( attachIcon, {scale: scale} ), deselectedOptions ) );
    var detachButton = new RadioButton( detachableProperty, true, new Panel( new Image( detachIcon, {scale: scale} ), selectedOptions ), new Panel( new Image( detachIcon, {scale: scale} ), deselectedOptions ) );
    var hbox = new HBox( {spacing: 20, align: 'top', children: [attachButton, detachButton]} );
    Panel.call( this, hbox, {fill: '#dddddd', stroke: null} );
  }

  return inherit( Panel, AttachDetachToggleButtons, {
  } );
} );