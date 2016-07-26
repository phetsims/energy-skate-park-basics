// Copyright 2014-2015, University of Colorado Boulder

/**
 * Pie chart, rendered in WebGL to improve performance (when WebGL available)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TandemNode = require( 'TANDEM/scenery/nodes/TandemNode' );
  var Property = require( 'AXON/Property' );
  var PieChartWebGLSliceNode = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/PieChartWebGLSliceNode' );
  var EnergySkateParkColorScheme = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/view/EnergySkateParkColorScheme' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );

  /**
   * @param {Skater} skater the skater model
   * @param {Property<Boolean>} pieChartVisibleProperty axon Property indicating whether the pie chart is shown
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function PieChartWebGLNode( skater, pieChartVisibleProperty, modelViewTransform, tandem ) {

    var pieChartNode = this;
    TandemNode.call( this, {
      tandem: tandem
    } );

    // Show the pie chart above the skater's head
    Property.multilink( [ skater.headPositionProperty, pieChartVisibleProperty ], function( skaterHeadPosition, pieChartVisible ) {

      // Only update it when visible, to improve performance
      if ( pieChartVisible ) {
        var view = modelViewTransform.modelToViewPosition( skaterHeadPosition );

        // Center pie chart over skater's head not his feet so it doesn't look awkward when skating in a parabola
        pieChartNode.setTranslation( view.x, view.y - 50 );
      }
    } );

    // Make the radius proportional to the square root of the energy so that the area will grow linearly with energy
    var pieChartRadiusProperty = new DerivedProperty( [ skater.totalEnergyProperty ], function( totalEnergy ) {
      return 0.4 * Math.sqrt( totalEnergy );
    } );

    var potentialEnergyProportion = skater.toDerivedProperty( [ 'potentialEnergy', 'totalEnergy' ], function( potentialEnergy, totalEnergy ) {
      var result = totalEnergy === 0 ? 0 : (potentialEnergy / totalEnergy);
      var clamped = result < 0 ? 0 :
                    result > 1 ? 1 :
                    result;
      assert && assert( !isNaN( clamped ), 'should be a number!' );
      return clamped * Math.PI * 2;
    } );

    var kineticEnergyProportion = skater.toDerivedProperty( [ 'kineticEnergy', 'totalEnergy' ], function( kineticEnergy, totalEnergy ) {
      var result = totalEnergy === 0 ? 0 : (kineticEnergy / totalEnergy);
      var clamped = result < 0 ? 0 :
                    result > 1 ? 1 :
                    result;
      assert && assert( !isNaN( clamped ), 'should be a number!' );
      return clamped * Math.PI * 2;
    } );

    var thermalEnergyProportion = skater.toDerivedProperty( [ 'thermalEnergy', 'totalEnergy' ], function( thermalEnergy, totalEnergy ) {
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

    pieChartVisibleProperty.linkAttribute( this, 'visible' );
  }

  energySkateParkBasics.register( 'PieChartWebGLNode', PieChartWebGLNode );

  return inherit( TandemNode, PieChartWebGLNode );
} );