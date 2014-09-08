// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery node for the Attach/Detach toggle buttons which determine whether the skater can fly off the track or not.
 * This was formerly called "roller coaster mode"
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * Constructor for the AttachDetachToggleButtons
   * @param {Property<Boolean>} detachableProperty Axon property that is true if the model state allows the skater to detach
   * @param {Property<Boolean>} enabledProperty Axon property that is true if the control is enabled
   * @param {Number} contentWidth Width for the control panel, to match the layout of the rest of the controls.
   * @param {Object} options
   * @constructor
   */
  function AttachDetachToggleButtons( detachableProperty, enabledProperty, contentWidth, options ) {

    //Match the style of the EnergySkateParkBasicsControlPanel
    options = _.extend( {
      fill: '#F0F0F0',
      stroke: null,
      xMargin: 10,
      yMargin: 5
    }, options );

    var scale = 0.32;
    var selectedStroke = '#3291b8';//Same color as slider knob
    var deselectedStroke = null;
    var panelOptions = {
      xMargin: 0,
      yMargin: 0,
      cornerRadius: 6
    };
    var lineWidth = 2.3;
    var selectedOptions = _.extend( {stroke: selectedStroke, lineWidth: lineWidth, opacity: 1}, panelOptions );
    var deselectedOptions = _.extend( {stroke: deselectedStroke, lineWidth: lineWidth, opacity: 0.6}, panelOptions );

    var attachPanel = new Panel( new Image( attachIcon, {scale: scale} ), selectedOptions );
    var attachButton = new RadioButton( detachableProperty, false, attachPanel, new Panel( new Image( attachIcon, {scale: scale} ), deselectedOptions ) );

    var detachPanel = new Panel( new Image( detachIcon, {scale: scale} ), selectedOptions );
    var detachButton = new RadioButton( detachableProperty, true, detachPanel, new Panel( new Image( detachIcon, {scale: scale} ), deselectedOptions ) );

    var hbox = new HBox( {spacing: 20, align: 'top', children: [attachButton, detachButton], centerX: contentWidth / 2} );
    var content = new Rectangle( 0, 0, contentWidth, 0, {children: [hbox]} );
    Panel.call( this, content, options );

    enabledProperty.linkAttribute( this, 'pickable' );
    enabledProperty.mapValues( {true: 1, false: 0.5} ).linkAttribute( hbox, 'opacity' );
    var highlightColorProperty = enabledProperty.mapValues( {true: selectedStroke, false: 'gray'} );
    highlightColorProperty.linkAttribute( attachPanel, 'stroke' );
    highlightColorProperty.linkAttribute( detachPanel, 'stroke' );
  }

  return inherit( Panel, AttachDetachToggleButtons );
} );