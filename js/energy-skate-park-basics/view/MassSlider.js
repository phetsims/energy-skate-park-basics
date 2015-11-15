// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery node for the mass slider, which changes the skater's mass (and correspondingly, the height)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HSlider = require( 'SUN/HSlider' );
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );

  // strings
  var controlsMassString = require( 'string!ENERGY_SKATE_PARK_BASICS/controls.mass' );
  var smallString = require( 'string!ENERGY_SKATE_PARK_BASICS/small' );
  var largeString = require( 'string!ENERGY_SKATE_PARK_BASICS/large' );

  /**
   * @param {Property<Number>} massProperty axon Property indicating the skater mass
   * @constructor
   */
  function MassSlider( massProperty, options ) {
    var range = { min: Constants.MIN_MASS, max: Constants.MAX_MASS };
    var slider = new HSlider( massProperty, range, _.extend( { togetherID: options.togetherID }, Constants.SLIDER_OPTIONS ) );
    var tickFont = new PhetFont( 10 );
    slider.addMajorTick( Constants.MIN_MASS, new Text( smallString, { font: tickFont } ) );
    slider.addMajorTick( Constants.MAX_MASS, new Text( largeString, { font: tickFont } ) );
    VBox.call( this, { children: [ new Text( controlsMassString, new PhetFont( 14 ) ), slider ] } );
  }

  return inherit( VBox, MassSlider );
} );