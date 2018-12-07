// Copyright 2013-2018, University of Colorado Boulder

/**
 * Constants used throughout the simulation.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var Range = require( 'DOT/Range' );

  var minMass = 25;// kg
  var maxMass = 100;

  var Constants = {
    SLIDER_OPTIONS: {
      thumbSize: new Dimension2( 13, 30 ),
      tickLabelSpacing: 0,
      majorTickLength: 15
    },

    // threshold for allowing thermal energy to be cleared, generally used in a function with the graph height scale
    // factor to determine whether thermal energy can be cleared
    ALLOW_THERMAL_CLEAR_BASIS: 1E-6,

    DEFAULT_MASS: (minMass + maxMass) / 2,
    MIN_MASS: minMass,
    MAX_MASS: maxMass,
    MASS_RANGE: new Range( minMass, maxMass )
  };

  energySkateParkBasics.register( 'Constants', Constants );

  return Constants;
} );