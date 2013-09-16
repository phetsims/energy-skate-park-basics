//Copyright 2002-2013, University of Colorado

/**
 * Panel with radio buttons for choosing one of three tracks, in the first 2 screens of Energy Skate Park: Basics
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Panel = require( 'SUN/Panel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PushButton = require( 'SUN/PushButton' );
  var imageLoader = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ToggleButton = require( 'SUN/ToggleButton' );
  var Property = require( 'AXON/Property' );

  function SceneRadioButtonPanel( model ) {

    var createNode = function( name, index ) {
      var selectedNode = new Text( name, {fill: 'black'} );
      var unselectedNode = new Text( name, {fill: 'gray'} );
      var property = new Property( model.scene === index );

      property.link( function( scene0Selected ) { if ( scene0Selected ) { model.scene = index; } } );
      model.sceneProperty.link( function( scene ) { property.value = scene === index; } );
      return new ToggleButton( selectedNode, unselectedNode, property, {radioButton: true} );
    };

    var content = new HBox( {
      spacing: 20,
      children: [
        createNode( 'Scene 1', 0 ),
        createNode( 'Scene 2', 1 ) ,
        createNode( 'Scene 3', 2 )
      ]} );
    Panel.call( this, content );
  }

  return inherit( Panel, SceneRadioButtonPanel );
} );