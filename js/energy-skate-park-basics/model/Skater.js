// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  function Skater() {
    PropertySet.call( this, {position: new Vector2( 0, 0 )} );
  }

  return inherit( PropertySet, Skater, {step: function( dt ) {}} );
} );