// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from energy-skate-park-basics-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import energySkateParkBasics from './energySkateParkBasics.js';
import EnergySkateParkBasicsStrings from './EnergySkateParkBasicsStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( EnergySkateParkBasicsStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'energy_skate_park_basics_title', 'energy-skate-park-basics.titleStringProperty' );
addToMapIfDefined( 'screen_introduction', 'screen.introductionStringProperty' );
addToMapIfDefined( 'screen_friction', 'screen.frictionStringProperty' );
addToMapIfDefined( 'screen_trackPlayground', 'screen.trackPlaygroundStringProperty' );
addToMapIfDefined( 'a11y_screenButtons_friction_accessibleHelpText', 'a11y.screenButtons.friction.accessibleHelpTextStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${FluentLibrary.formatMultilineForFtl( stringProperty.value )}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const EnergySkateParkBasicsFluent = {
  "energy-skate-park-basics": {
    titleStringProperty: _.get( EnergySkateParkBasicsStrings, 'energy-skate-park-basics.titleStringProperty' )
  },
  screen: {
    introductionStringProperty: _.get( EnergySkateParkBasicsStrings, 'screen.introductionStringProperty' ),
    frictionStringProperty: _.get( EnergySkateParkBasicsStrings, 'screen.frictionStringProperty' ),
    trackPlaygroundStringProperty: _.get( EnergySkateParkBasicsStrings, 'screen.trackPlaygroundStringProperty' )
  },
  a11y: {
    screenButtons: {
      friction: {
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screenButtons_friction_accessibleHelpText', _.get( EnergySkateParkBasicsStrings, 'a11y.screenButtons.friction.accessibleHelpTextStringProperty' ) )
      }
    }
  }
};

export default EnergySkateParkBasicsFluent;

energySkateParkBasics.register('EnergySkateParkBasicsFluent', EnergySkateParkBasicsFluent);
