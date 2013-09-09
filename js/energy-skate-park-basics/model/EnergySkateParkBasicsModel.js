// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Skater = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics/model/Skater' );

  function EnergySkateParkBasicsModel() {
    this.skater = new Skater();
  }

  return inherit( PropertySet, EnergySkateParkBasicsModel, {step: function( dt ) {}} );
} );