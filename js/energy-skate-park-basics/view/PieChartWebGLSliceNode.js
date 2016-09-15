// Copyright 2014-2015, University of Colorado Boulder

/**
 * A single slice of a pie chart, as contained in PieChartWebGLNode.  The slices each start at angle=0 and overlap each other, so the
 * z-ordering is critical.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var WebGLNode = require( 'SCENERY/nodes/WebGLNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var ShaderProgram = require( 'SCENERY/util/ShaderProgram' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Color} color
   * @param {Property<Number>} radiusProperty
   * @param {Property<Number>} extentProperty
   * @constructor
   */
  function PieChartWebGLSliceNode( color, radiusProperty, extentProperty ) {
    var self = this;
    this.color = Color.toColor( color );
    this.radiusProperty = radiusProperty;
    this.extentProperty = extentProperty;
    WebGLNode.call( this, PieChartSlicePainter, { canvasBounds: new Bounds2( 0, 0, 100, 100 ) } );

    this.invalidatePaint();

    this.shape = Shape.regularPolygon( 3, 100 * Math.sqrt( 2 ) );
    this.radiusProperty.link( function( radius ) {
      if ( radius > 0 ) {
        self.setScaleMagnitude( radius * 2, radius * 2 );
      }
      else {
        self.setScaleMagnitude( Math.sqrt( 2 ) / 2, Math.sqrt( 2 ) / 2 );
      }
      self.invalidatePaint();
    } );
    this.extentProperty.link( function() {
      self.invalidatePaint();
    } );
  }

  energySkateParkBasics.register( 'PieChartWebGLSliceNode', PieChartWebGLSliceNode );

  inherit( WebGLNode, PieChartWebGLSliceNode, {
    step: function( dt ) {
      // Mark the WebGL dirty flag as dirty, to ensure it will render.
      this.invalidatePaint();
    }
  } );

  /**
   * @constructor
   *
   * @param {WebGLRenderingContext} gl
   * @param {WaveWebGLNode} node
   */
  function PieChartSlicePainter( gl, node ) {
    assert && assert( typeof gl !== 'string', 'gl should not be a string' );
    this.gl = gl;
    this.node = node;

    // Simple example for custom shader
    var vertexShaderSource = [
      // Position
      'attribute vec2 aPosition;',
      'uniform vec4 uColor;',
      'varying vec4 vColor;',
      'uniform mat3 uModelViewMatrix;',
      'uniform mat3 uProjectionMatrix;',

      'void main( void ) {',
      '  vColor = uColor;',
      // homogeneous model-view transformation
      '  vec3 view = uModelViewMatrix * vec3( aPosition.xy, 1 );',
      // homogeneous map to to normalized device coordinates
      '  vec3 ndc = uProjectionMatrix * vec3( view.xy, 1 );',
      // combine with the z coordinate specified
      '  gl_Position = vec4( ndc.xy, 0.2, 1.0 );',
      '}'
    ].join( '\n' );

    // Simple demo for custom shader
    var fragmentShaderSource = [
      'precision mediump float;',
      'varying vec4 vColor;',

      // Returns the color from the vertex shader
      'void main( void ) {',
      '  gl_FragColor = vColor;',
      '}'
    ].join( '\n' );

    this.shaderProgram = new ShaderProgram( gl, vertexShaderSource, fragmentShaderSource, {
      attributes: [ 'aPosition' ],
      uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix', 'uColor' ]
    } );

    this.vertexBuffer = gl.createBuffer();

    var centerX = 0;
    var centerY = 0;
    var radius = 0.5;

    // 40 makes a smooth circle, but we need enough samples to eliminate seams between the pie slices
    // Win8/Chrome starts to slow down around 1000000 samples
    // But need it to be high enough that we don't see discrete jumps when the energy changes, see #303
    var numSamples = 1000;
    this.numSamples = numSamples;

    var vertices = [ centerX, centerY ];
    this.vertices = vertices;

    var indexToVertex = function( i ) {
      var angle = -Math.PI * 2 / numSamples * i;
      var x = radius * Math.cos( angle ) + centerX;
      var y = radius * Math.sin( angle ) + centerY;
      vertices.push( x );
      vertices.push( y );
    };

    //Go back to the first vertex, to make sure it is a closed circle
    for ( var i = 0; i <= numSamples; i++ ) {
      indexToVertex( i );
    }

    // var points = this.shape.subpaths[ 0 ].points;
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
  }

  energySkateParkBasics.register( 'PieChartSlicePainter', PieChartSlicePainter );

  inherit( Object, PieChartSlicePainter, {
    paint: function( modelViewMatrix, projectionMatrix ) {
      var gl = this.gl;
      var shaderProgram = this.shaderProgram;

      shaderProgram.use();

      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uModelViewMatrix, false, modelViewMatrix.entries );
      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uProjectionMatrix, false, projectionMatrix.entries );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0 );

      var color = this.node.color;
      gl.uniform4f( shaderProgram.uniformLocations.uColor, color.r / 255, color.g / 255, color.b / 255, color.a );

      var angleBetweenSlices = Math.PI * 2 / this.numSamples;

      //Round to the nearest angle to prevent seams, see #263
      var startAngle = 0;
      var unroundedEndAngle = this.node.extentProperty.value;
      var endAngle = Math.round( unroundedEndAngle / angleBetweenSlices ) * angleBetweenSlices;

      var extent = endAngle - startAngle;

      // To cut out a piece from the pie, just select the appropriate start/end vertices, then the call is still static.
      var numToDraw = Math.round( 2 + ( this.vertices.length / 2 - 2 ) * extent / ( 2 * Math.PI ) ); // linear between 2 and the maximum

      // Make sure to show non-zero energy if the value is above the threshold, see #307
      if ( numToDraw === 2 && this.node.extentProperty.get() > 1E-6 ) {
        numToDraw = 3;
      }

      gl.drawArrays( gl.TRIANGLE_FAN, 0, numToDraw );
      shaderProgram.unuse();

      return WebGLNode.PAINTED_SOMETHING;
    },

    dispose: function() {
      // clears all of our resources
      this.shaderProgram.dispose();
      this.gl.deleteBuffer( this.vertexBuffer );
      this.shaderProgram = null;
    }
  } );

  return PieChartWebGLSliceNode;
} );