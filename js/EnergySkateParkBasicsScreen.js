// Copyright 2002-2013, University of Colorado Boulder

/**
 * A single screen for the Energy Skate Park: Basics sim.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var EnergySkateParkBasicsModel = require( 'ENERGY_SKATE_PARK_BASICS/model/EnergySkateParkBasicsModel' );
  var EnergySkateParkBasicsView = require( 'ENERGY_SKATE_PARK_BASICS/view/EnergySkateParkBasicsView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var Vector2 = require( 'DOT/Vector2' );

  function EnergySkateParkBasicsScreen( name, icon, draggableTracks, friction ) {

    this.monkeyPatchNumeric();

    Screen.call( this, name, new Image( icon ),
      function() { return new EnergySkateParkBasicsModel( draggableTracks, friction ); },
      function( model ) { return new EnergySkateParkBasicsView( model ); }
    );
  }

  return inherit( Screen, EnergySkateParkBasicsScreen, {monkeyPatchNumeric: function() {

    //The most important function in numeric.js is just too slow because it uses tensor versions of all functions.
    //This version inlines everything.

    //TODO: Replace monkey patch with our own utility functions, see https://github.com/phetsims/energy-skate-park-basics/issues/34
    numeric.Spline.prototype._at = function _at( x1, p ) {
      var x = this.x;
      var yl = this.yl;
      var yr = this.yr;
      var kl = this.kl;
      var kr = this.kr;
      var a, b, t;
      a = (kl[p] * (x[p + 1] - x[p])) - (yr[p + 1] - yl[p]);
      b = kr[p + 1] * (x[p] - x[p + 1]) + yr[p + 1] - yl[p];
      t = (x1 - x[p]) / (x[p + 1] - x[p]);
      var s = t * (1 - t);
      return ((1 - t) * yl[p] + t * yr[p + 1] +
              a * s * (1 - t) ) +
             b * s * t;
    };
  }} );
} );