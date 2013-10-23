// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var EnergySkateParkBasicsModel = require( 'ENERGY_SKATE_PARK_BASICS/model/EnergySkateParkBasicsModel' );
  var EnergySkateParkBasicsView = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkBasicsView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsScreen( name, icon, draggableTracks, friction ) {
    Screen.call( this, name, new Image( icon ),
      function() { return new EnergySkateParkBasicsModel( draggableTracks, friction ); },
      function( model ) { return new EnergySkateParkBasicsView( model ); }
    );
  }

  return inherit( Screen, EnergySkateParkBasicsScreen );
} );