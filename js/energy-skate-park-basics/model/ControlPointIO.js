// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for ControlPoint
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {ControlPoint} controlPoint
   * @param {string} phetioID
   * @constructor
   */
  function ControlPointIO( controlPoint, phetioID ) {
    assert && assertInstanceOf( controlPoint, phet.energySkateParkBasics.ControlPoint );
    ObjectIO.call( this, controlPoint, phetioID );
  }

  phetioInherit( ObjectIO, 'ControlPointIO', ControlPointIO, {}, {
    documentation: 'A control point that can manipulate the track.',

    // Support null
    fromStateObject: function( stateObject ) {
      if ( stateObject === 'null' ) {
        return null;
      }
      else {
        return phetio.getWrapper( stateObject ).instance;
      }
    },

    toStateObject: function( controlPoint ) {
      assert && assertInstanceOf( controlPoint, phet.energySkateParkBasics.ControlPoint );
      return controlPoint ? controlPoint.phetioID : 'null';
    }
  } );

  energySkateParkBasics.register( 'ControlPointIO', ControlPointIO );

  return ControlPointIO;
} );