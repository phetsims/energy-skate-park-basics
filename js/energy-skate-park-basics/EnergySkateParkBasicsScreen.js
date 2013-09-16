// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var EnergySkateParkBasicsModel = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/EnergySkateParkBasicsModel' );
  var EnergySkateParkBasicsView = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkBasicsView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsScreen( name, draggableTracks, friction ) {
    this.name = name;
    this.icon = new Rectangle( 0, 0, 200, 100, {fill: 'blue'} );

    this.createModel = function() { return new EnergySkateParkBasicsModel( draggableTracks, friction ); };

    this.createView = function( model ) { return new EnergySkateParkBasicsView( model ); };
  }

  return EnergySkateParkBasicsScreen;
} );