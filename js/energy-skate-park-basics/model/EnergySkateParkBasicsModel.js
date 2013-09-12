// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Skater = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/Skater' );
  var Track = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/Track' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsModel() {
    this.skater = new Skater();
    this.track = new Track( [ new Vector2( -2, 2 ), new Vector2( 0, 0 ), new Vector2( 2, 2 ) ] );
  }

  return inherit( PropertySet, EnergySkateParkBasicsModel, {step: function( dt ) {
    this.skater.step( dt );
  }} );
} );