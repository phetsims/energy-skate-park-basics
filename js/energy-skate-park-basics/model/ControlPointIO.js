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
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
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

    /**
     * Encodes a ControlPoint instance to a state.
     * @param {ControlPoint} controlPoint
     * @returns {Object}
     * @override
     */
    toStateObject: function( controlPoint ) {
      assert && assertInstanceOf( controlPoint, phet.energySkateParkBasics.ControlPoint );
      return controlPoint ? controlPoint.tandem.phetioID : 'null';
    },

    /**
     * Decodes a ControlPoint from a state object. Supports null.
     *
     * @param {Object} stateObject
     * @return {ControlPoint}
     * @override
     */
    fromStateObject: function( stateObject ) {
      if ( stateObject === 'null' ) {
        return null;
      }
      else {
        return phetio.getInstance( stateObject );
      }
    }
  } );

  energySkateParkBasics.register( 'ControlPointIO', ControlPointIO );

  return ControlPointIO;
} );