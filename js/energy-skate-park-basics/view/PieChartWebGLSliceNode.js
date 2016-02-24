// Copyright 2014-2015, University of Colorado Boulder

/**
 * A single slice of a pie chart, as contained in PieChartWebGLNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var WebGLNode = require( 'SCENERY/nodes/WebGLNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Matrix4 = require( 'DOT/Matrix4' );
  var Color = require( 'SCENERY/util/Color' );
  var ShaderProgram = require( 'SCENERY/util/ShaderProgram' );
  var Shape = require( 'KITE/Shape' );

  // Hack workaround to satisfy lint until WebGL support is restored
  var WebGLLayer = null;

  /**
   * @param {Color} color
   * @param {Property<Number>} radiusProperty
   * @param {Property<Number>} startAngleProperty
   * @param {Property<Number>} extentProperty
   * @param {Property<Boolean>} pieChartVisibleProperty
   * @constructor
   */
  // TODO: unused params?
  function PieChartWebGLSliceNode( color, radiusProperty, startAngleProperty, extentProperty ) {

    this.color = color;
    this.radiusProperty = radiusProperty;
    this.startAngleProperty = startAngleProperty;
    this.extentProperty = extentProperty;
    WebGLNode.call( this, { canvasBounds: new Bounds2( 0, 0, 100, 100 ) } );

    this.invalidatePaint();

    this.shape = Shape.regularPolygon( 3, 100 * Math.sqrt( 2 ) );
  }

  return inherit( WebGLNode, PieChartWebGLSliceNode, {

    initializeWebGLDrawable: function( drawable ) {
      var gl = drawable.gl;

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

      drawable.shaderProgram = new ShaderProgram( gl, vertexShaderSource, fragmentShaderSource, {
        attributes: [ 'aPosition' ],
        uniforms: [ 'uModelViewMatrix', 'uProjectionMatrix', 'uColor' ]
      } );

      drawable.vertexBuffer = gl.createBuffer();

      var centerX = 0;
      var centerY = 0;
      var radius = 100;

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
      gl.bindBuffer( gl.ARRAY_BUFFER, drawable.vertexBuffer );
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
    },
    paintWebGLDrawable: function( drawable, matrix ) {
      var gl = drawable.gl;
      var shaderProgram = drawable.shaderProgram;

      shaderProgram.use();

      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uModelViewMatrix, false, matrix.entries );
      gl.uniformMatrix3fv( shaderProgram.uniformLocations.uProjectionMatrix, false, drawable.webGLBlock.projectionMatrixArray );

      gl.bindBuffer( gl.ARRAY_BUFFER, drawable.vertexBuffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aPosition, 2, gl.FLOAT, false, 0, 0 );

      var color = Color.toColor( this.color );
      gl.uniform4f( shaderProgram.uniformLocations.uColor, color.r / 255, color.g / 255, color.b / 255, color.a );
      //console.log( color.r / 255, color.g / 255, color.b / 255, color.a );

      var angleBetweenSlices = Math.PI * 2 / this.numSamples;
      // var radius = this.radiusProperty.value;

      //Round to the nearest angle to prevent seams, see #263
      var startAngle = Math.round( this.startAngleProperty.value / angleBetweenSlices ) * angleBetweenSlices;
      var unroundedEndAngle = this.startAngleProperty.value + this.extentProperty.value;
      var endAngle = Math.round( unroundedEndAngle / angleBetweenSlices ) * angleBetweenSlices;

      var extent = endAngle - startAngle;

      // To cut out a piece from the pie, just select the appropriate start/end vertices, then the call is still static.
      var numToDraw = Math.round( 2 + ( this.vertices.length / 2 - 2 ) * extent / ( 2 * Math.PI ) ); // linear between 2 and the maximum

      // Make sure to show non-zero energy if the value is above the threshold, see #307
      if ( numToDraw === 2 && this.extentProperty.get() > 1E-6 ) {
        numToDraw = 3;
      }

      gl.drawArrays( gl.TRIANGLE_FAN, 0, numToDraw );

      shaderProgram.unuse();
    },

    /*
     DEPRECATED
     */
    initialize: function( gl ) {

      this.buffer = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );

      var centerX = 0;
      var centerY = 0;
      var radius = 0.5;

      // 40 makes a smooth circle, but we need enough samples to eliminate seams between the pie slices
      // Win8/Chrome starts to slow down around 1000000 samples
      // But need it to be high enough that we don't see discrete jumps when the energy changes, see #303
      var numSamples = 1000;
      this.numSamples = numSamples;

      var vertices = [ centerX, centerY ];

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

      // Complete the circle
      this.vertices = vertices;

      // TODO: Once we are lazily handling the full matrix, we may benefit from DYNAMIC draw here, and updating the vertices themselves
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
    },

    /*
     DEPRECATED
     */
    render: function( gl, shaderProgram, viewMatrix ) {

      var angleBetweenSlices = Math.PI * 2 / this.numSamples;
      var radius = this.radiusProperty.value;

      //Round to the nearest angle to prevent seams, see #263
      var startAngle = Math.round( this.startAngleProperty.value / angleBetweenSlices ) * angleBetweenSlices;
      var unroundedEndAngle = this.startAngleProperty.value + this.extentProperty.value;
      var endAngle = Math.round( unroundedEndAngle / angleBetweenSlices ) * angleBetweenSlices;

      var extent = endAngle - startAngle;

      var scalingMatrix = Matrix4.scaling( radius * 2, radius * 2, 1 );
      var rotationMatrix = Matrix4.rotationZ( -startAngle );
      var uMatrix = viewMatrix.timesMatrix( scalingMatrix.timesMatrix( rotationMatrix ) );

      // combine image matrix (to scale aspect ratios), the trail's matrix, and the matrix to device coordinates
      gl.uniformMatrix4fv( shaderProgram.uniformLocations.uModelViewMatrix, false, uMatrix.entries );

      // Indicate the branch of logic to use in the ubershader.  In this case, a texture should be used for the image
      gl.uniform1i( shaderProgram.uniformLocations.uFragmentType, WebGLLayer.fragmentTypeFill );
      var color = Color.toColor( this.color );
      gl.uniform4f( shaderProgram.uniformLocations.uColor, color.r / 255, color.g / 255, color.b / 255, color.a );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aVertex, 2, gl.FLOAT, false, 0, 0 );

      // To cut out a piece from the pie, just select the appropriate start/end vertices, then the call is still static.
      var numToDraw = Math.round( 2 + ( this.vertices.length / 2 - 2 ) * extent / ( 2 * Math.PI ) ); // linear between 2 and the maximum

      // Make sure to show non-zero energy if the value is above the threshold, see #307
      if ( numToDraw === 2 && this.extentProperty.get() > 1E-6 ) {
        numToDraw = 3;
      }
      gl.drawArrays( gl.TRIANGLE_FAN, 0, numToDraw );
    },

    step: function( dt ) {

      // Mark the WebGL dirty flag as dirty, to ensure it will render.
      this.invalidatePaint();
    },

    /*
     DEPRECATED
     */
    dispose: function( gl ) {
      gl.deleteBuffer( this.buffer );
    }
  } );
} );