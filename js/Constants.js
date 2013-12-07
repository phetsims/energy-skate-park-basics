// Copyright 2002-2013, University of Colorado Boulder

/**
 * Constants used throughout the simulation.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Dimension2 = require( 'DOT/Dimension2' );

  var minMass = 25;//kg
  var maxMass = 100;

  return {
    SLIDER_OPTIONS: {
      thumbSize: new Dimension2( 13, 30 ),
      tickLabelSpacing: 0,
      majorTickLength: 15
    },

    DEFAULT_MASS: (minMass + maxMass) / 2,
    MIN_MASS: minMass,
    MAX_MASS: maxMass
  };
} );