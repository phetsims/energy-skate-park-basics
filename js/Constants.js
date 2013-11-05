// Copyright 2002-2013, University of Colorado Boulder

/**
 * Constants used throughout the simulation.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Dimension2 = require( 'DOT/Dimension2' );

  return {
    SLIDER_OPTIONS: {
      thumbSize: new Dimension2( 22, 35 ),
      tickLabelSpacing: 0,
      majorTickLength: 20
    }
  };
} );