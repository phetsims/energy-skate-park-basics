// Copyright 2014-2015, University of Colorado Boulder

/**
 * Pie chart, rendered in WebGL to improve performance (when WebGL available)
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
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
  function PieChartWebGLNode( skater, pieChartVisibleProperty, modelViewTransform ) {

    var pieChartNode = this;
    Node.call( this );

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
      var result = (potentialEnergy / totalEnergy);
      var clamped = result < 0 ? 0 :
                    result > 1 ? 1 :
                    result;
      return clamped * Math.PI * 2;
    } );

    var kineticEnergyProportion = skater.toDerivedProperty( [ 'kineticEnergy', 'totalEnergy' ], function( kineticEnergy, totalEnergy ) {
      var result = (kineticEnergy / totalEnergy);
      var clamped = result < 0 ? 0 :
                    result > 1 ? 1 :
                    result;
      return clamped * Math.PI * 2;
    } );

    var thermalEnergyProportion = skater.toDerivedProperty( [ 'thermalEnergy', 'totalEnergy' ], function( thermalEnergy, totalEnergy ) {
      var result = (thermalEnergy / totalEnergy);
      var clamped = result < 0 ? 0 :
                    result > 1 ? 1 :
                    result;
      return clamped * Math.PI * 2;
    } );

    var plus = function( a, b ) {
      return Property.multilink( [ a, b ], function( a, b ) {
        return a + b;
      } );
    };

    var pieStroke = 1;

    // TODO: why did Property.multilink not work here?
    var outlineRadiusProperty = Property.multilink( [ pieChartRadiusProperty ], function( pieChartRadius ) {

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
      new Property( 0 ),
      new Property( Math.PI * 2 )
    );
    this.addChild( outline );

    var thermalEnergyPiece = new PieChartWebGLSliceNode(
      EnergySkateParkColorScheme.thermalEnergy,
      pieChartRadiusProperty,
      new Property( 0 ),
      thermalEnergyProportion
    );

    this.addChild( thermalEnergyPiece );

    var kineticEnergyPiece = new PieChartWebGLSliceNode(
      EnergySkateParkColorScheme.kineticEnergy,
      pieChartRadiusProperty,
      thermalEnergyProportion,
      kineticEnergyProportion
    );
    this.addChild( kineticEnergyPiece );

    var potentialEnergyPiece = new PieChartWebGLSliceNode(
      EnergySkateParkColorScheme.potentialEnergy,
      pieChartRadiusProperty,
      plus( kineticEnergyProportion, thermalEnergyProportion ),
      potentialEnergyProportion
    );
    this.addChild( potentialEnergyPiece );

    pieChartVisibleProperty.linkAttribute( this, 'visible' );
  }

  return inherit( Node, PieChartWebGLNode );
} );