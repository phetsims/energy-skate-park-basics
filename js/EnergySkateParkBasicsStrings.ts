// Copyright 2021-2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
import energySkateParkBasics from './energySkateParkBasics.js';

type StringsType = {
  'properties': {
    'speed': string;
    'speedStringProperty': LocalizedStringProperty;
  };
  'small': string;
  'smallStringProperty': LocalizedStringProperty;
  'screen': {
    'trackPlayground': string;
    'trackPlaygroundStringProperty': LocalizedStringProperty;
    'friction': string;
    'frictionStringProperty': LocalizedStringProperty;
    'introduction': string;
    'introductionStringProperty': LocalizedStringProperty;
  };
  'controls': {
    'mass': string;
    'massStringProperty': LocalizedStringProperty;
    'show-grid': string;
    'show-gridStringProperty': LocalizedStringProperty;
    'gravity': {
      'lots': string;
      'lotsStringProperty': LocalizedStringProperty;
      'none': string;
      'noneStringProperty': LocalizedStringProperty;
    };
    'friction': {
      'title': string;
      'titleStringProperty': LocalizedStringProperty;
    };
    'restart-skater': string;
    'restart-skaterStringProperty': LocalizedStringProperty;
  };
  'energy-skate-park-basics': {
    'title': string;
    'titleStringProperty': LocalizedStringProperty;
  };
  'slow': {
    'motion': string;
    'motionStringProperty': LocalizedStringProperty;
  };
  'energy': {
    'thermal': string;
    'thermalStringProperty': LocalizedStringProperty;
    'total': string;
    'totalStringProperty': LocalizedStringProperty;
    'kinetic': string;
    'kineticStringProperty': LocalizedStringProperty;
    'potential': string;
    'potentialStringProperty': LocalizedStringProperty;
    'energy': string;
    'energyStringProperty': LocalizedStringProperty;
  };
  'plots': {
    'bar-graph': string;
    'bar-graphStringProperty': LocalizedStringProperty;
  };
  'pieChart': string;
  'pieChartStringProperty': LocalizedStringProperty;
  'large': string;
  'largeStringProperty': LocalizedStringProperty;
  'normal': string;
  'normalStringProperty': LocalizedStringProperty;
  'zeroMeters': string;
  'zeroMetersStringProperty': LocalizedStringProperty;
};

const EnergySkateParkBasicsStrings = getStringModule( 'ENERGY_SKATE_PARK_BASICS' ) as StringsType;

energySkateParkBasics.register( 'EnergySkateParkBasicsStrings', EnergySkateParkBasicsStrings );

export default EnergySkateParkBasicsStrings;
