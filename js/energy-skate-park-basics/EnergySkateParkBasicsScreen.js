// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var EnergySkateParkBasicsModel = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/EnergySkateParkBasicsModel' );
  var EnergySkateParkBasicsView = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/view/EnergySkateParkBasicsView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsScreen() {
    this.name = 'Energy Skate Park: Basics';
    this.icon = new Rectangle( 0, 0, 200, 100, {fill: 'blue'} );

    // No offset, scale 125x when going from model to view (1cm == 125 pixels)
//    var mvt = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 125 );

    this.createModel = function() {
      return new EnergySkateParkBasicsModel();
    };

    this.createView = function( model ) {
      return new EnergySkateParkBasicsView( model );
    };
  }

  return EnergySkateParkBasicsScreen;
} );