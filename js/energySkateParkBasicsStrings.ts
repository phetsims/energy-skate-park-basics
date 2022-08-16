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
    'speedProperty': TReadOnlyProperty<string>;
  };
  'small': string;
  'smallProperty': TReadOnlyProperty<string>;
  'screen': {
    'trackPlayground': string;
    'trackPlaygroundProperty': TReadOnlyProperty<string>;
    'friction': string;
    'frictionProperty': TReadOnlyProperty<string>;
    'introduction': string;
    'introductionProperty': TReadOnlyProperty<string>;
  };
  'controls': {
    'mass': string;
    'massProperty': TReadOnlyProperty<string>;
    'show-grid': string;
    'show-gridProperty': TReadOnlyProperty<string>;
    'gravity': {
      'lots': string;
      'lotsProperty': TReadOnlyProperty<string>;
      'none': string;
      'noneProperty': TReadOnlyProperty<string>;
    };
    'friction': {
      'title': string;
      'titleProperty': TReadOnlyProperty<string>;
    };
    'restart-skater': string;
    'restart-skaterProperty': TReadOnlyProperty<string>;
  };
  'energy-skate-park-basics': {
    'title': string;
    'titleProperty': TReadOnlyProperty<string>;
  };
  'slow': {
    'motion': string;
    'motionProperty': TReadOnlyProperty<string>;
  };
  'energy': {
    'thermal': string;
    'thermalProperty': TReadOnlyProperty<string>;
    'total': string;
    'totalProperty': TReadOnlyProperty<string>;
    'kinetic': string;
    'kineticProperty': TReadOnlyProperty<string>;
    'potential': string;
    'potentialProperty': TReadOnlyProperty<string>;
    'energy': string;
    'energyProperty': TReadOnlyProperty<string>;
  };
  'plots': {
    'bar-graph': string;
    'bar-graphProperty': TReadOnlyProperty<string>;
  };
  'pieChart': string;
  'pieChartProperty': TReadOnlyProperty<string>;
  'large': string;
  'largeProperty': TReadOnlyProperty<string>;
  'normal': string;
  'normalProperty': TReadOnlyProperty<string>;
  'zeroMeters': string;
  'zeroMetersProperty': TReadOnlyProperty<string>;
};

const energySkateParkBasicsStrings = getStringModule( 'ENERGY_SKATE_PARK_BASICS' ) as StringsType;

energySkateParkBasics.register( 'energySkateParkBasicsStrings', energySkateParkBasicsStrings );

export default energySkateParkBasicsStrings;
