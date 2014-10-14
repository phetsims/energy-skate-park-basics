// Copyright 2002-2013, University of Colorado Boulder

require.config( {
  deps: ['energy-skate-park-basics-main'],

  paths: {

    // Load dependencies from sibling directories
    ASSERT: '../../assert/js',
    AXON: '../../axon/js',
    BRAND: '../../brand/js',
    DOT: '../../dot/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    KITE: '../../kite/js',
    PHET_CORE: '../../phet-core/js',
    PHETCOMMON: '../../phetcommon/js',
    SUN: '../../sun/js',
    JOIST: '../../joist/js',
    ENERGY_SKATE_PARK_BASICS: '.',

    // Load plugins
    image: '../../chipper/requirejs-plugins/image',
    audio: '../../chipper/requirejs-plugins/audio',
    string: '../../chipper/requirejs-plugins/string',

    text: '../../sherpa/text'
  }

//  urlArgs: new Date().getTime() // add cache buster query string to make browser refresh actually reload everything
} );