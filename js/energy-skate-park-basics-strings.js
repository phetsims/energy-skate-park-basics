// Copyright 2002-2013, University of Colorado Boulder

//The string plugin loader has problems if you try to load the strings from different relative paths
//So just load them once and make them easily available
define( function( require ) {
  'use strict';
//  var Strings = require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/energy-skate-park-basics-strings' );
//
//  //Only the strings specified in the config file get loaded unless you explicitly require them,
//  // see https://github.com/phetsims/ohms-law/issues/16
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/ca/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/da/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/de/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/el/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/es/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/es-es/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/es-pe/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/eu/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/fa/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/fr/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/gl/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/hu/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/it/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/iw/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/mk/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/nl/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/pl/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/pt-br/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/sk/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/sr/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/sv/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/ta/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/tr/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/vi/energy-skate-park-basics-strings' );
//  require( 'i18n!ENERGY_SKATE_PARK_BASICS/../nls/zh-tw/energy-skate-park-basics-strings' );

  //For testing the i18n coverage
//  for ( var key in Strings ) {
//    console.log( key );
//    Strings[key] = Strings[key] + Strings[key];
//  }

  return {};
} );