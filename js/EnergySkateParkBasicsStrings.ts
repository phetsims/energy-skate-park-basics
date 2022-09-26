// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import energySkateParkBasics from './energySkateParkBasics.js';

type StringsType = {
  'properties': {
    'speed': string;
    'speedStringProperty': LinkableProperty<string>;
  };
  'small': string;
  'smallStringProperty': LinkableProperty<string>;
  'screen': {
    'trackPlayground': string;
    'trackPlaygroundStringProperty': LinkableProperty<string>;
    'friction': string;
    'frictionStringProperty': LinkableProperty<string>;
    'introduction': string;
    'introductionStringProperty': LinkableProperty<string>;
  };
  'controls': {
    'mass': string;
    'massStringProperty': LinkableProperty<string>;
    'show-grid': string;
    'show-gridStringProperty': LinkableProperty<string>;
    'gravity': {
      'lots': string;
      'lotsStringProperty': LinkableProperty<string>;
      'none': string;
      'noneStringProperty': LinkableProperty<string>;
    };
    'friction': {
      'title': string;
      'titleStringProperty': LinkableProperty<string>;
    };
    'restart-skater': string;
    'restart-skaterStringProperty': LinkableProperty<string>;
  };
  'energy-skate-park-basics': {
    'title': string;
    'titleStringProperty': LinkableProperty<string>;
  };
  'slow': {
    'motion': string;
    'motionStringProperty': LinkableProperty<string>;
  };
  'energy': {
    'thermal': string;
    'thermalStringProperty': LinkableProperty<string>;
    'total': string;
    'totalStringProperty': LinkableProperty<string>;
    'kinetic': string;
    'kineticStringProperty': LinkableProperty<string>;
    'potential': string;
    'potentialStringProperty': LinkableProperty<string>;
    'energy': string;
    'energyStringProperty': LinkableProperty<string>;
  };
  'plots': {
    'bar-graph': string;
    'bar-graphStringProperty': LinkableProperty<string>;
  };
  'pieChart': string;
  'pieChartStringProperty': LinkableProperty<string>;
  'large': string;
  'largeStringProperty': LinkableProperty<string>;
  'normal': string;
  'normalStringProperty': LinkableProperty<string>;
  'zeroMeters': string;
  'zeroMetersStringProperty': LinkableProperty<string>;
};

const EnergySkateParkBasicsStrings = getStringModule( 'ENERGY_SKATE_PARK_BASICS' ) as StringsType;

energySkateParkBasics.register( 'EnergySkateParkBasicsStrings', EnergySkateParkBasicsStrings );

export default EnergySkateParkBasicsStrings;
