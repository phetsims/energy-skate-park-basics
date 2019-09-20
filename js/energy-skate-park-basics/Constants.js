// Copyright 2013-2019, University of Colorado Boulder

/**
 * Constants specific to Energy Skate Park: Basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  const Range = require( 'DOT/Range' );

  const minMass = 25; // kg
  const maxMass = 100;
  const defaultMass = ( minMass + maxMass ) / 2;
  const massRange = new Range( minMass, maxMass );

  const Constants = {
    SLIDER_OPTIONS: {
      thumbSize: new Dimension2( 13, 30 ),
      tickLabelSpacing: 0,
      majorTickLength: 15
    },

    // threshold for allowing thermal energy to be cleared, generally used in a function with the graph height scale
    // factor to determine whether thermal energy can be cleared
    ALLOW_THERMAL_CLEAR_BASIS: 1E-6,

    DEFAULT_MASS: ( minMass + maxMass ) / 2,
    MIN_MASS: minMass,
    MAX_MASS: maxMass,
    MASS_RANGE: new Range( minMass, maxMass ),

    // all options that are consistent for models in the basics simulation - this object should be used by
    // everything extending the main simulation
    BASICS_MODEL_OPTIONS: {
      skaterOptions: {
        defaultMass: defaultMass,
        massRange: massRange
      }
    }
  };

  energySkateParkBasics.register( 'Constants', Constants );

  return Constants;
} );