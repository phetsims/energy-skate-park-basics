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

  function AttachDetachToggleButtons( detachableProperty, enabledProperty ) {
    var scale = 0.32;
    var selectedStroke = '#3291b8';//Same color as slider knob
    var deselectedStroke = null;
    var panelOptions = {
      xMargin: 0,
      yMargin: 0,
      cornerRadius: 6
    };
    var lineWidth = 1.6;
    var selectedOptions = _.extend( {stroke: selectedStroke, lineWidth: lineWidth}, panelOptions );
    var deselectedOptions = _.extend( {stroke: deselectedStroke, lineWidth: lineWidth}, panelOptions );

    var attachPanel = new Panel( new Image( attachIcon, {scale: scale} ), selectedOptions );
    var attachButton = new RadioButton( detachableProperty, false, attachPanel, new Panel( new Image( attachIcon, {scale: scale} ), deselectedOptions ) );

    var detachPanel = new Panel( new Image( detachIcon, {scale: scale} ), selectedOptions );
    var detachButton = new RadioButton( detachableProperty, true, detachPanel, new Panel( new Image( detachIcon, {scale: scale} ), deselectedOptions ) );

    var hbox = new HBox( {spacing: 20, align: 'top', children: [attachButton, detachButton]} );
    Panel.call( this, hbox, {fill: '#dddddd', stroke: null} );

    enabledProperty.linkAttribute( this, 'pickable' );
    enabledProperty.mapValues( {true: 1, false: 0.3} ).linkAttribute( this, 'opacity' );
    var highlightColorProperty = enabledProperty.mapValues( {true: selectedStroke, false: 'gray'} );
    highlightColorProperty.linkAttribute( attachPanel, 'stroke' );
    highlightColorProperty.linkAttribute( detachPanel, 'stroke' );
  }

  return inherit( Panel, AttachDetachToggleButtons );
} );