// Copyright 2002-2013, University of Colorado Boulder

//TODO this should extend sun.Button
//TODO this should handle wiring up the callback that goes to the home screen, currently done in NavigationBar
/**
 * The Home button that appears in the navigation bar.
 */
define( function( require ) {
  'use strict';

  // imports
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var RectangleButton = require( 'SUN/RectangleButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var Color = require( 'SCENERY/util/Color' );

  function UndoButton( callback, skater, options ) {

    options = _.extend( { cursor: 'pointer' }, options );
    var icon = new FontAwesomeNode( 'undo', { fill: 'white', scale: 0.4 } );
    skater.toDerivedProperty( ['thermalEnergy'],function( thermalEnergy ) {return thermalEnergy > 0;} ).link( function( hasThermalEnergy ) {
      icon.fill = hasThermalEnergy ? 'white' : 'lightGray';
    } );

    RectangleButton.call( this, icon, callback, {rectangleFillUp: new Color( 255, 85, 0 )} );
    this.mouseArea = this.touchArea = Shape.rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height );
    this.addChild( icon );
    this.mutate( options );
  }

  return inherit( RectangleButton, UndoButton );
} );