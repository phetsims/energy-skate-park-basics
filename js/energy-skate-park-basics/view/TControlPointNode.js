// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  var TControlPointNode = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.energySkateParkBasics.ControlPointNode );
    TObject.call( this, instance, phetioID );
  };

  /**
   * Control point or null
   */
  phetioInherit( TNode, 'TControlPointNode', TControlPointNode, {}, {} );

  energySkateParkBasics.register( 'TControlPointNode', TControlPointNode );

  return TControlPointNode;
} );