// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );

  /**
   * Control point or null
   */
  var TControlPoint = phetioInherit( TObject, 'TControlPoint', function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.energySkateParkBaics.ControlPoint );
  }, {}, {

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