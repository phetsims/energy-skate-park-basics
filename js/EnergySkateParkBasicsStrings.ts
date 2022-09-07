// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import energySkateParkBasics from './energySkateParkBasics.js';

type StringsType = {
  'properties': {
    'speed': string;
    'speedStringProperty': TReadOnlyProperty<string>;
  };
  'small': string;
  'smallStringProperty': TReadOnlyProperty<string>;
  'screen': {
    'trackPlayground': string;
    'trackPlaygroundStringProperty': TReadOnlyProperty<string>;
    'friction': string;
    'frictionStringProperty': TReadOnlyProperty<string>;
    'introduction': string;
    'introductionStringProperty': TReadOnlyProperty<string>;
  };
  'controls': {
    'mass': string;
    'massStringProperty': TReadOnlyProperty<string>;
    'show-grid': string;
    'show-gridStringProperty': TReadOnlyProperty<string>;
    'gravity': {
      'lots': string;
      'lotsStringProperty': TReadOnlyProperty<string>;
      'none': string;
      'noneStringProperty': TReadOnlyProperty<string>;
    };
    'friction': {
      'title': string;
      'titleStringProperty': TReadOnlyProperty<string>;
    };
    'restart-skater': string;
    'restart-skaterStringProperty': TReadOnlyProperty<string>;
  };
  'energy-skate-park-basics': {
    'title': string;
    'titleStringProperty': TReadOnlyProperty<string>;
  };
  'slow': {
    'motion': string;
    'motionStringProperty': TReadOnlyProperty<string>;
  };
  'energy': {
    'thermal': string;
    'thermalStringProperty': TReadOnlyProperty<string>;
    'total': string;
    'totalStringProperty': TReadOnlyProperty<string>;
    'kinetic': string;
    'kineticStringProperty': TReadOnlyProperty<string>;
    'potential': string;
    'potentialStringProperty': TReadOnlyProperty<string>;
    'energy': string;
    'energyStringProperty': TReadOnlyProperty<string>;
  };
  'plots': {
    'bar-graph': string;
    'bar-graphStringProperty': TReadOnlyProperty<string>;
  };
  'pieChart': string;
  'pieChartStringProperty': TReadOnlyProperty<string>;
  'large': string;
  'largeStringProperty': TReadOnlyProperty<string>;
  'normal': string;
  'normalStringProperty': TReadOnlyProperty<string>;
  'zeroMeters': string;
  'zeroMetersStringProperty': TReadOnlyProperty<string>;
};

const EnergySkateParkBasicsStrings = getStringModule( 'ENERGY_SKATE_PARK_BASICS' ) as StringsType;

energySkateParkBasics.register( 'EnergySkateParkBasicsStrings', EnergySkateParkBasicsStrings );

export default EnergySkateParkBasicsStrings;
