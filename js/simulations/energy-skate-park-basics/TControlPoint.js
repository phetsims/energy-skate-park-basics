// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var phetio = require( 'PHET_IO/phetio' );

  var TControlPoint = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.energySkateParkBasics.ControlPoint );
    TObject.call( this, instance, phetioID );
  };
  /**
   * Control point or null
   */
  phetioInherit( TObject, 'TControlPoint', TControlPoint, {}, {

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

  phetioNamespace.register( 'TControlPoint', TControlPoint );

  return TControlPoint;
} );