// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var phetio = require( 'ifphetio!PHET_IO/phetio' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TControlPoint( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.energySkateParkBasics.ControlPoint );
    ObjectIO.call( this, instance, phetioID );
  }

  /**
   * Control point or null
   */
  phetioInherit( ObjectIO, 'TControlPoint', TControlPoint, {}, {
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

    toStateObject: function( instance ) {
      return instance ? instance.phetioID : 'null';
    }
  } );

  energySkateParkBasics.register( 'TControlPoint', TControlPoint );

  return TControlPoint;
} );