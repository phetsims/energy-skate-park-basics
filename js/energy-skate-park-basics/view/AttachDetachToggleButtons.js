// Copyright 2014-2015, University of Colorado Boulder

/**
 * Scenery node for the Attach/Detach toggle buttons which determine whether the skater can fly off the track or not.
 * This was formerly called "roller coaster mode"
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );


  // images
  var attachIcon = require( 'image!ENERGY_SKATE_PARK_BASICS/attach.png' );
  var detachIcon = require( 'image!ENERGY_SKATE_PARK_BASICS/detach.png' );

  /**
   * Constructor for the AttachDetachToggleButtons
   * @param {Property<Boolean>} detachableProperty Axon property that is true if the model state allows the skater to detach
   * @param {Property<Boolean>} enabledProperty Axon property that is true if the control is enabled
   * @param {number} contentWidth Width for the control panel, to match the layout of the rest of the controls.
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function AttachDetachToggleButtons( detachableProperty, enabledProperty, contentWidth, tandem, options ) {

    // Match the style of the EnergySkateParkBasicsControlPanel
    options = _.extend( {
      fill: '#F0F0F0',
      stroke: null,
      xMargin: 15,
      yMargin: 5
    }, options );

    var scale = 0.32;

    // This is sort of hack to pass through the tandem of the radioButtonGroupMember to its child.
    var attachRadioButtonTandemName = 'attachRadioButton';
    var detachRadioButtonTandemName = 'detachRadioButton';
    var radioButtonGroupTandem = tandem.createTandem( 'radioButtonGroup' );
    var radioButtonsContent = [
      {
        value: false,
        node: new Image( attachIcon, {
          scale: scale,
          tandem: radioButtonGroupTandem.createTandem( attachRadioButtonTandemName ).createTandem( 'attachIcon' )
        } ),
        tandemName: attachRadioButtonTandemName
      },
      {
        value: true,
        node: new Image( detachIcon, {
          scale: scale,
          tandem: radioButtonGroupTandem.createTandem( detachRadioButtonTandemName ).createTandem( 'detachIcon' )
        } ),
        tandemName: detachRadioButtonTandemName
      }
    ];

    var radioButtons = new RadioButtonGroup( detachableProperty, radioButtonsContent,
      {
        buttonContentXMargin: 0,
        buttonContentYMargin: 0,
        baseColor: 'white',
        disabledBaseColor: 'rgba(255,255,255,0.5)',
        spacing: 20,
        cornerRadius: 6,
        selectedLineWidth: 2.3,
        selectedStroke: '#3291b8',
        deselectedStroke: 'gray',
        orientation: 'horizontal',
        tandem: radioButtonGroupTandem
      } );

    var panelOptions = _.extend( { tandem: tandem }, options );
    Panel.call( this, radioButtons, panelOptions );
  }

  energySkateParkBasics.register( 'AttachDetachToggleButtons', AttachDetachToggleButtons );

  return inherit( Panel, AttachDetachToggleButtons );
} );