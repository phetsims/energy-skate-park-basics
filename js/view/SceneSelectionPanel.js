//Copyright 2002-2013, University of Colorado

/**
 * Panel with radio buttons for choosing one of three tracks, in the first 2 screens of Energy Skate Park: Basics
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var TrackNode = require( 'ENERGY_SKATE_PARK_BASICS/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BackgroundNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * Construct a SceneSelectionPanel.  Pass the entire model since it is used to create TrackNode
   * @param {EnergySkateParkBasicsModel} model the main model for the entire screen
   * @param {EnergySkateParkBasicsView} view the main view for the entire screen
   * @param {ModelViewTransform2} transform the model view transform
   * @constructor
   */
  function SceneSelectionPanel( model, view, transform ) {

    //Create a button with a scene like the track in the index
    var createNode = function( index ) {
      var track = model.tracks.get( index );
      var background = new BackgroundNode( view.layoutBounds );
      background.layout( 0, 0, view.layoutBounds.width, view.layoutBounds.height, 1 );
      var trackNode = new TrackNode( model, track, transform, new Property() );

      //Fixes: Cursor turns into a hand over the track in the track selection panel, see #204
      trackNode.pickable = false;

      var a = new Node( {children: [background, trackNode ]} );
      a.scale( 45 / a.height );
      return a;
    };

    var content = new RadioButtonGroup( model.sceneProperty, [
      {value: 0, node: createNode( 0 )},
      {value: 1, node: createNode( 1 )},
      {value: 2, node: createNode( 2 )}
    ], {
      alignVertically: true,
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

  return inherit( Panel, SceneSelectionPanel );
} );