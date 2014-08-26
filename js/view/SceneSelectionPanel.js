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
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ToggleButtonDeprecated = require( 'SUN/ToggleButtonDeprecated' );
  var Property = require( 'AXON/Property' );
  var TrackNode = require( 'ENERGY_SKATE_PARK_BASICS/view/TrackNode' );
  var BackgroundNode = require( 'ENERGY_SKATE_PARK_BASICS/view/BackgroundNode' );

  //Construct a SceneSelectionPanel.  Pass the entire model since it is used to create TrackNode
  function SceneSelectionPanel( model, view, transform ) {

    //Create a button with a scene like the track in the index
    var createNode = function( index ) {
      var track = model.tracks.get( index );
      var background = new BackgroundNode( view.layoutBounds, {pickable: true} );
      background.layout( 0, 0, view.layoutBounds.width, view.layoutBounds.height, 1 );
      var trackNode = new TrackNode( model, track, transform, new Property() );

      //Fixes: Cursor turns into a hand over the track in the track selection panel, see #204
      trackNode.pickable = false;

      var a = new Node( {children: [background, trackNode ]} );
      a.scale( 45 / a.height );
      var selectedNode = new Panel( a, {stroke: 'black', lineWidth: 3, xMargin: 0, yMargin: 0, cornerRadius: 0} );

      var unselectedNode = new Panel( a, {stroke: 'gray', lineWidth: 0, xMargin: 0, yMargin: 0, cornerRadius: 0, opacity: 0.6} );
      var property = new Property( model.scene === index );

      property.link( function( scene0Selected ) { if ( scene0Selected ) { model.scene = index; } } );
      model.sceneProperty.link( function( scene ) { property.value = scene === index; } );
      return new ToggleButtonDeprecated( selectedNode, unselectedNode, property, {radioButton: true} );
    };

    var content = new VBox( {
      spacing: 10,
      children: [
        createNode( 0 ),
        createNode( 1 ) ,
        createNode( 2 )
      ]} );
    Panel.call( this, content, {fill: '#F0F0F0', xMargin: 10, stroke: null} );
  }

  return inherit( Panel, SceneSelectionPanel );
} );