// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );

  var EnergySkateParkBasicsQueryParameters = QueryStringMachine.getAll( {

    //TODO document
    debugLog: { type: 'flag' },

    //TODO document
    debugAttachDetach: { type: 'flag' },

    //TODO document
    debugTrack: { type: 'flag' },

    //TODO document
    showSaveAndLoad: { type: 'flag' },

    //TODO document, name should start with lowercase, defaultValue is a hack, validValues needed?
    DebugTracks: {
      type: 'number',
      defaultValue: -1
    }
  });

  energySkateParkBasics.register( 'EnergySkateParkBasicsQueryParameters', EnergySkateParkBasicsQueryParameters );

  return EnergySkateParkBasicsQueryParameters;
} );
