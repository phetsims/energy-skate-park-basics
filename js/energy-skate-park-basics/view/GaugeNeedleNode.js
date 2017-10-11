// Copyright 2014-2017, University of Colorado Boulder

/**
 * The gauge node is a scenery node that represents a circular gauge that
 * depicts some dynamic value.  This was originally ported from the
 * speedometer node in forces-and-motion-basics.
 *
 * @author Sam Reid
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Util = require( 'DOT/Util' );

  // constants
  var linear = Util.linear;

  /**
   * Constructor
   * @param {Property} valueProperty Property.<number> which is portrayed
   * @param {Object} range - contains min and max values that define the range
   * @param {Object} [options] typical Node layout and display options
   * @constructor
   */
  function GaugeNeedleNode( valueProperty, range, options ) {

    options = _.extend( {
      // Defaults
      radius: 67,
      backgroundFill: 'white',
      backgroundStroke: 'rgb( 85, 85, 85 )',
      backgroundLineWidth: 2,
      anglePerTick: Math.PI * 2 / 4 / 8,

      // 8 ticks goes to 9 o'clock (on the left side), and two more ticks appear below that mark.
      // The ticks are duplicated for the right side, and one tick appears in the middle at the top
      numTicks: ( 8 + 2 ) * 2 + 1,

      // Determines whether the gauge will be updated when the value changes.
      // Use this to (for example) disable updates while a gauge is not visible.
      updateEnabledProperty: new Property( true )
    }, options );
    var lineWidth = 3;
    var needle = new Rectangle( 0, -lineWidth / 2, options.radius, lineWidth, { fill: 'red' } );
    if ( options && options.renderer && options.renderer === 'webgl' ) {
      needle = needle.toCanvasNodeSynchronous();
    }
    Node.call( this, {
      children: [ needle ]
    } );

    var totalAngle = (options.numTicks - 1) * options.anglePerTick;
    var startAngle = -1 / 2 * Math.PI - totalAngle / 2;
    var endAngle = startAngle + totalAngle;

    var updateNeedle = function() {
      if ( options.updateEnabledProperty.get() ) {
        if ( typeof( valueProperty.get() ) === 'number' ) {
          needle.visible = true;
          var needleAngle = linear( range.min, range.max, startAngle, endAngle, Math.abs( valueProperty.get() ) );
          needle.setMatrix( Matrix3.rotation2( needleAngle ) );
        }
        else {
          // Hide the needle if there is no value number value to portray.
          needle.visible = false;
        }
      }
    };
    valueProperty.link( updateNeedle );

    options.updateEnabledProperty.link( function( updateEnabled ) {
      updateNeedle();
    } );

    this.mutate( options );
  }

  energySkateParkBasics.register( 'GaugeNeedleNode', GaugeNeedleNode );

  return inherit( Node, GaugeNeedleNode );
} );