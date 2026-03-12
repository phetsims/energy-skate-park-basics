// Copyright 2021-2026, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import energySkateParkBasics from './energySkateParkBasics.js';

type StringsType = {
  'energy-skate-park-basics': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'introductionStringProperty': LocalizedStringProperty;
    'frictionStringProperty': LocalizedStringProperty;
    'trackPlaygroundStringProperty': LocalizedStringProperty;
  };
  'a11y': {
    'screenButtons': {
      'friction': {
        'accessibleHelpTextStringProperty': LocalizedStringProperty;
      }
    }
  }
};

const EnergySkateParkBasicsStrings = getStringModule( 'ENERGY_SKATE_PARK_BASICS' ) as StringsType;

energySkateParkBasics.register( 'EnergySkateParkBasicsStrings', EnergySkateParkBasicsStrings );

export default EnergySkateParkBasicsStrings;
