// Copyright 2002-2014, University of Colorado Boulder

/**
 * Pie chart, rendered in WebGL to improve iPad performance (when WebGL available)
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
  var WebGLLayer = require( 'SCENERY/layers/WebGLLayer' );
  var Color = require( 'SCENERY/util/Color' );

  /**
   * @param {SingleBulbModel} model
   * @param {Object} [options], must contain a canvasBounds attribute of type Bounds2
   * @constructor
   */
  function PieChartWebGLNode( model, options ) {

    WebGLNode.call( this, {canvasBounds: new Bounds2( 0, 0, 100, 100 )} );

    this.invalidatePaint();
  }

  return inherit( WebGLNode, PieChartWebGLNode, {

    initialize: function( gl ) {

      this.buffer = gl.createBuffer();
      gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );

      var centerX = 0.5;
      var centerY = 0.5;
      var radius = 0.5;

      //40 seemed a little aliased.  Anything 50+ seems pretty great.  Though even 1000 samples doesn't slow performance
      var numSamples = 50;

      var vertices = [centerX, centerY];
      for ( var i = 0; i <= numSamples; i++ ) {
        var angle = Math.PI * 2 / numSamples * i;
        var x = radius * Math.cos( angle ) + centerX;
        var y = radius * Math.sin( angle ) + centerY;
        vertices.push( x );
        vertices.push( y );
      }
      this.vertices = vertices;

      //TODO: Once we are lazily handling the full matrix, we may benefit from DYNAMIC draw here, and updating the vertices themselves
      gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

      this.updateRectangle();
    },

    //Nothing necessary since everything currently handled in the uMatrix below
    //However, we may switch to dynamic draw, and handle the matrix change only where necessary in the future?
    updateRectangle: function() {
    },

    testXValue: 0,
    render: function( gl, shaderProgram, viewMatrix ) {

      var rectangleX = this.testXValue++;
      var rectangleY = 0;
      var rectangleWidth = 100;
      var rectangleHeight = 100;

      var rectangleOffset = Matrix4.translation( rectangleX, rectangleY, 0 );
      var rectangleSize = Matrix4.scaling( rectangleWidth, rectangleHeight, 1 );
      var uMatrix = viewMatrix.timesMatrix( rectangleOffset.timesMatrix( rectangleSize ) );

      // combine image matrix (to scale aspect ratios), the trail's matrix, and the matrix to device coordinates
      gl.uniformMatrix4fv( shaderProgram.uniformLocations.uMatrix, false, uMatrix.entries );

      //Indicate the branch of logic to use in the ubershader.  In this case, a texture should be used for the image
      gl.uniform1i( shaderProgram.uniformLocations.uFragmentType, WebGLLayer.fragmentTypeFill );
      var color = Color.toColor( 'blue' );
      gl.uniform4f( shaderProgram.uniformLocations.uColor, color.r / 255, color.g / 255, color.b / 255, color.a );

      gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
      gl.vertexAttribPointer( shaderProgram.attributeLocations.aVertex, 2, gl.FLOAT, false, 0, 0 );

      //To cut out a piece from the pie, just select the appropriate start/end vertices, then the call is still static.
      gl.drawArrays( gl.TRIANGLE_FAN, 0, this.vertices.length / 2 );
    },

    //TODO: Is this necessary?
    step: function( dt ) {
      this.invalidatePaint();
    },
    dispose: function( gl ) {
      gl.deleteBuffer( this.buffer );
    }

  } );
} );