// Copyright 2002-2013, University of Colorado Boulder

/**
 * Colors used in Energy Skate Park: Basics, based on the original Java sim colors.
 *
 * @author Sam Reid
 */
define( function() {
  'use strict';

  var Color = require( 'SCENERY/util/Color' );

  return {

    //Use color instances here to prevent parsing these values multiple times
    kineticEnergy: new Color( '#00cc1a' ),
    potentialEnergy: new Color( '#3282D7' ),
    thermalEnergy: new Color( '#FF5500' ),//red colorblind
    totalEnergy: new Color( '#B4B400' )//dirty yellow
  };
} );