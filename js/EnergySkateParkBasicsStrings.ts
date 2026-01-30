// Copyright 2021-2024, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import energySkateParkBasics from './energySkateParkBasics.js';

type StringsType = {
  'properties': {
    'speedStringProperty': LocalizedStringProperty;
  };
  'smallStringProperty': LocalizedStringProperty;
  'screen': {
    'trackPlaygroundStringProperty': LocalizedStringProperty;
    'frictionStringProperty': LocalizedStringProperty;
    'introductionStringProperty': LocalizedStringProperty;
  };
  'controls': {
    'massStringProperty': LocalizedStringProperty;
    'show-gridStringProperty': LocalizedStringProperty;
    'gravity': {
      'lotsStringProperty': LocalizedStringProperty;
      'noneStringProperty': LocalizedStringProperty;
    };
    'friction': {
      'titleStringProperty': LocalizedStringProperty;
    };
    'restart-skaterStringProperty': LocalizedStringProperty;
  };
  'energy-skate-park-basics': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'slow': {
    'motionStringProperty': LocalizedStringProperty;
  };
  'energy': {
    'thermalStringProperty': LocalizedStringProperty;
    'totalStringProperty': LocalizedStringProperty;
    'kineticStringProperty': LocalizedStringProperty;
    'potentialStringProperty': LocalizedStringProperty;
    'energyStringProperty': LocalizedStringProperty;
  };
  'plots': {
    'bar-graphStringProperty': LocalizedStringProperty;
  };
  'pieChartStringProperty': LocalizedStringProperty;
  'largeStringProperty': LocalizedStringProperty;
  'normalStringProperty': LocalizedStringProperty;
  'zeroMetersStringProperty': LocalizedStringProperty;
};

const EnergySkateParkBasicsStrings = getStringModule( 'ENERGY_SKATE_PARK_BASICS' ) as StringsType;

energySkateParkBasics.register( 'EnergySkateParkBasicsStrings', EnergySkateParkBasicsStrings );

export default EnergySkateParkBasicsStrings;
