// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TControlPointNode( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.energySkateParkBasics.ControlPointNode );
    NodeIO.call( this, instance, phetioID );
  }

  /**
   * Control point or null
   */
  phetioInherit( NodeIO, 'TControlPointNode', TControlPointNode, {},
    { documentation: 'The view element for a control point.' } );

  energySkateParkBasics.register( 'TControlPointNode', TControlPointNode );

  return TControlPointNode;
} );