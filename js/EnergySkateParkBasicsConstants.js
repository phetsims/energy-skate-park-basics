// Copyright 2013-2020, University of Colorado Boulder

/**
 * EnergySkateParkBasicsConstants specific to Energy Skate Park: Basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import EnergySkateParkConstants from '../../energy-skate-park/js/common/EnergySkateParkConstants.js';
import energySkateParkBasics from './energySkateParkBasics.js';

const minMass = 25; // kg
const maxMass = 100;
const defaultMass = ( minMass + maxMass ) / 2;
const massRange = new Range( minMass, maxMass );

// REVIEW: This should be prefixed with teh simulation name: EnergySkateParkBasicsConstants
const EnergySkateParkBasicsConstants = {
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
    },
    defaultSpeedValueVisible: false,

    // by default, most basics screens have half value of friction on startup
    defaultFriction: ( EnergySkateParkConstants.MAX_FRICTION - EnergySkateParkConstants.MIN_FRICTION ) / 2
  }
};

energySkateParkBasics.register( 'EnergySkateParkBasicsConstants', EnergySkateParkBasicsConstants );

export default EnergySkateParkBasicsConstants;