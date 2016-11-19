// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );

  var EnergySkateParkBasicsQueryParameters = QueryStringMachine.getAll( {

    // Print out console messages related to the physics
    debugLog: { type: 'flag' },

    // Print out console messages related to attaching and detaching from the tracks
    debugAttachDetach: { type: 'flag' },

    // Show experimental save & load button
    showSaveAndLoad: { type: 'flag' },

    // Print out console messages related to attaching and detaching from the tracks
    debugTrack: { type: 'flag' },

    // If debugTrack is true, this indicates the index (1-based) of the track to show
    testTrackIndex: {
      type: 'number',
      defaultValue: 1
    }
  } );

  energySkateParkBasics.register( 'EnergySkateParkBasicsQueryParameters', EnergySkateParkBasicsQueryParameters );

  return EnergySkateParkBasicsQueryParameters;
} );
