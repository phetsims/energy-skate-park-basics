// Copyright 2014-2018, University of Colorado Boulder

/**
 * Pie chart, rendered in WebGL to improve performance (when WebGL available)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Constants = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/Constants' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PieChartWebGLSliceNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PieChartWebGLSliceNode' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Skater} skater the skater model
   * @param {Property<Boolean>} pieChartVisibleProperty axon Property indicating whether the pie chart is shown
   * @param {NumberProperty} graphScaleProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function PieChartWebGLNode( skater, pieChartVisibleProperty, graphScaleProperty, modelViewTransform, tandem ) {

    var self = this;
    Node.call( this, {
      tandem: tandem
    } );

    // Show the pie chart above the skater's head
    Property.multilink( [ skater.headPositionProperty, pieChartVisibleProperty ], function( skaterHeadPosition, pieChartVisible ) {

      // Only update it when visible, to improve performance
      if ( pieChartVisible ) {
        var view = modelViewTransform.modelToViewPosition( skaterHeadPosition );

        // Center pie chart over skater's head not his feet so it doesn't look awkward when skating in a parabola
        self.setTranslation( view.x, view.y - 50 );
      }
    } );

    // Make the radius proportional to the square root of the energy so that the area will grow linearly with energy
    var pieChartRadiusProperty = new DerivedProperty( [ skater.totalEnergyProperty ], function( totalEnergy ) {
      return 0.4 * Math.sqrt( totalEnergy );
    } );

    var potentialEnergyProportion = new DerivedProperty( [ skater.potentialEnergyProperty, skater.totalEnergyProperty ], function( potentialEnergy, totalEnergy ) {
      var result = totalEnergy === 0 ? 0 : (potentialEnergy / totalEnergy);
      var clamped = result < 0 ? 0 :
                    result > 1 ? 1 :
                    result;
      assert && assert( !isNaN( clamped ), 'should be a number!' );
      return clamped * Math.PI * 2;
    } );

    var kineticEnergyProportion = new DerivedProperty( [ skater.kineticEnergyProperty, skater.totalEnergyProperty ], function( kineticEnergy, totalEnergy ) {
      var result = totalEnergy === 0 ? 0 : (kineticEnergy / totalEnergy);
      var clamped = result < 0 ? 0 :
                    result > 1 ? 1 :
                    result;
      assert && assert( !isNaN( clamped ), 'should be a number!' );
      return clamped * Math.PI * 2;
    } );

    var thermalEnergyProportion = new DerivedProperty( [ skater.thermalEnergyProperty, skater.totalEnergyProperty ], function( thermalEnergy, totalEnergy ) {
      var result = totalEnergy === 0 ? 0 : (thermalEnergy / totalEnergy);
      var clamped = result < 0 ? 0 :
                    result > 1 ? 1 :
                    result;
      var number = clamped * Math.PI * 2;
      assert && assert( !isNaN( number ), 'should be a number!' );
      return number;
    } );

    var plus = function( a, b ) {
      return new DerivedProperty( [ a, b ], function( a, b ) {
        return a + b;
      } );
    };

    var pieStroke = 1;

    // TODO: why did Property.multilink not work here?
    var outlineRadiusProperty = new DerivedProperty( [ pieChartRadiusProperty ], function( pieChartRadius ) {

      // If any slice is too small, then don't show it.  Use the same rules as the non-webgl pie chart, see #136
      if ( pieChartRadius <= 0.05 ) {
        return 0;
      }
      else {
        return pieChartRadius + pieStroke;
      }
    } );

    // Render the stroke as a larger black circle behind the pie chart
    var outline = new PieChartWebGLSliceNode(
      'black',
      outlineRadiusProperty,
      new Property( Math.PI * 2 )
    );

    var thermalEnergyPiece = new PieChartWebGLSliceNode(
      EnergySkateParkColorScheme.thermalEnergy,
      pieChartRadiusProperty,
      thermalEnergyProportion
    );

    var kineticEnergyPiece = new PieChartWebGLSliceNode(
      EnergySkateParkColorScheme.kineticEnergy,
      pieChartRadiusProperty,
      plus( thermalEnergyProportion, kineticEnergyProportion )
    );

    var potentialEnergyPiece = new PieChartWebGLSliceNode(
      EnergySkateParkColorScheme.potentialEnergy,
      pieChartRadiusProperty,
      plus( plus( kineticEnergyProportion, thermalEnergyProportion ), potentialEnergyProportion )
    );

    this.addChild( outline );
    this.addChild( potentialEnergyPiece );
    this.addChild( kineticEnergyPiece );
    this.addChild( thermalEnergyPiece );

    // if too small or set to be invisible, hide the pie chart
    Property.multilink( [ pieChartVisibleProperty, skater.totalEnergyProperty, graphScaleProperty ], function( visible, totalEnergy, graphScale ) {
      var largeEnough = totalEnergy > Constants.ALLOW_THERMAL_CLEAR_BASIS / graphScale;
      self.visible = visible && largeEnough;
    } );
  }

  energySkateParkBasics.register( 'PieChartWebGLNode', PieChartWebGLNode );

  return inherit( Node, PieChartWebGLNode );
} );