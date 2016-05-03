// Copyright 2013-2015, University of Colorado Boulder

/**
 * Panel with radio buttons for choosing one of three tracks, in the first 2 screens of Energy Skate Park: Basics
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var TrackNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/BackgroundNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * Construct a SceneSelectionPanel.  Pass the entire model since it is used to create TrackNode
   * @param {EnergySkateParkBasicsModel} model the main model for the entire screen
   * @param {EnergySkateParkBasicsView} view the main view for the entire screen
   * @param {ModelViewTransform2} transform the model view transform
   * @constructor
   */
  function SceneSelectionPanel( model, view, transform, options ) {

    // Create a button with a scene like the track in the index
    var createNode = function( index ) {
      var track = model.tracks.get( index );
      var background = new BackgroundNode( view.layoutBounds );
      background.layout( 0, 0, view.layoutBounds.width, view.layoutBounds.height, 1 );
      var trackNode = new TrackNode( model, track, transform, new Property() );

      // Fixes: Cursor turns into a hand over the track in the track selection panel, see #204
      trackNode.pickable = false;

      var a = new Node( { children: [ background, trackNode ] } );
      a.scale( 45 / a.height );
      return a;
    };

    var content = new RadioButtonGroup( model.sceneProperty, [
      {
        value: 0,
        node: createNode( 0 ),
        phetioID: options.tandem.createTandem( 'scene1RadioButton' )
      },
      {
        value: 1,
        node: createNode( 1 ),
        phetioID: options.tandem.createTandem( 'scene2RadioButton' )
      },
      {
        value: 2,
        node: createNode( 2 ),
        phetioID: options.tandem.createTandem( 'scene3RadioButton' )
      }
    ], {
      orientation: 'vertical',
      buttonContentXMargin: 0,
      buttonContentYMargin: 0,
      cornerRadius: 0,
      selectedLineWidth: 3
    } );

    Panel.call( this, content, {
      fill: '#F0F0F0',
      xMargin: 10,
      stroke: null
    } );
  }

  energySkateParkBasics.register( 'SceneSelectionPanel', SceneSelectionPanel );
  
  return inherit( Panel, SceneSelectionPanel );
} );