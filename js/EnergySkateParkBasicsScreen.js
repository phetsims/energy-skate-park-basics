// Copyright 2002-2013, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var EnergySkateParkBasicsModel = require( 'ENERGY_SKATE_PARK_BASICS/model/EnergySkateParkBasicsModel' );
  var EnergySkateParkBasicsView = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkBasicsView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  function EnergySkateParkBasicsScreen( name, icon, draggableTracks, friction ) {
    Screen.call( this, name, new Image( icon ),
      function() { return new EnergySkateParkBasicsModel( draggableTracks, friction ); },
      function( model ) { return new EnergySkateParkBasicsView( model ); }
    );
  }

  return inherit( Screen, EnergySkateParkBasicsScreen );
} );