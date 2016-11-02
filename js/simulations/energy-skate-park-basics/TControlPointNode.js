// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var TNode = require( 'PHET_IO/types/scenery/nodes/TNode' );

  var TControlPointNode = function( instance, phetioID ) {
    TObject.call( this, instance, phetioID );
    assertInstanceOf( instance, phet.energySkateParkBasics.ControlPointNode );
  };

  /**
   * Control point or null
   */
  phetioInherit( TNode, 'TControlPointNode', TControlPointNode, {}, {} );

  phetioNamespace.register( 'TControlPointNode', TControlPointNode );

  return TControlPointNode;
} );