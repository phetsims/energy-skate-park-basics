// Copyright 2014-2017, University of Colorado Boulder

/**
 * Debug tracks, which can be enabled using the query parameter 'DebugTracks' with the index of the track to debug.
 * There is no automated testing, you have to launch the track and see if the behavior looks correct.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var ControlPoint = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/ControlPoint' );
  var energySkateParkBasics = require( 'ENERGY_SKATE_PARK_BASICS/energySkateParkBasics' );
  var EnergySkateParkBasicsQueryParameters = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/EnergySkateParkBasicsQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Track = require( 'ENERGY_SKATE_PARK_BASICS/energy-skate-park-basics/model/Track' );
  var Vector2 = require( 'DOT/Vector2' );

  function DebugTracks() {
  }

  energySkateParkBasics.register( 'DebugTracks', DebugTracks );

  return inherit( Object, DebugTracks, {}, {
    init: function( model, controlPointGroupTandem, trackGroupTandem ) {
        // Tracks to help demonstrate issues

      var createControlPoint = function( x, y ) {
        return new ControlPoint( x, y, { tandem: controlPointGroupTandem.createNextTandem() } );
      };

        var controlPoints = null;
        var track = null;
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 1 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( -5, 8 ) );
          model.skater.released( 0, 0 );

          controlPoints = [ createControlPoint( 3.9238282647584946, 3.1917866726296955 ), createControlPoint( 2.043971377459748, 4.847851073345259 ), createControlPoint( -1.116994633273702, 3.686296958855098 ), createControlPoint( -3.5806797853309487, 1.8639512522361352 ), createControlPoint( -5.982719141323793, 6.235364490161 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        // Skater stutters and slows going over the hump
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 2 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( -5, 7.7 ) );
          model.skater.released( 0, 0 );

          controlPoints = [ createControlPoint( 3.9238282647584946, 3.1917866726296955 ), createControlPoint( 2.043971377459748, 4.847851073345259 ), createControlPoint( -1.116994633273702, 3.686296958855098 ), createControlPoint( -3.5806797853309487, 1.8639512522361352 ), createControlPoint( -5.982719141323793, 6.235364490161 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        // Tricky one--handled OK
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 3 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( -5, 7.7 ) );
          model.skater.released( 0, 0 );

          controlPoints = [ createControlPoint( -1.8031842576028616, 3.53633273703041 ), createControlPoint( 1.7306618962432907, 2.8187991949910547 ), createControlPoint( 1.9246153846153842, 4.3405881037567084 ), createControlPoint( 3.834311270125223, 4.907529069767442 ), createControlPoint( 3.491162790697672, 1.0732177996422188 ), createControlPoint( -2.760107334525939, 1.461124776386404 ), createControlPoint( -5.162146690518783, 5.832538014311269 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        // Wide loop, OK
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 4 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( -5, 7.7 ) );
          model.skater.released( 0, 0 );

          controlPoints = [ createControlPoint( 4.639964221824686, 6.68294946332737 ), createControlPoint( 1.4173524150268335, 0.938942307692308 ), createControlPoint( -3.207692307692308, 3.997439624329159 ), createControlPoint( 3.2524508050089445, 3.9079226296958858 ), createControlPoint( 3.491162790697672, 1.0732177996422188 ), createControlPoint( -2.760107334525939, 1.461124776386404 ), createControlPoint( -5.162146690518783, 5.832538014311269 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        // Flickering return skater button, PROBLEM
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 5 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( -5, 7.7 ) );
          model.skater.released( 0, 0 );

          controlPoints = [ createControlPoint( 4.431091234347049, 7.9252447313977665 ), createControlPoint( 2.4169588550983896, 7.975935759156005 ), createControlPoint( -1.9874106197862114, 4.75700797278857 ), createControlPoint( 0.13992761930286512, 6.207060140642635 ), createControlPoint( 1.447191413237924, 1.0090653610430707 ), createControlPoint( -1.7008228980322002, 1.0717102008522177 ), createControlPoint( -5.37101967799642, 7.0748332823816655 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        // Passes through track, PROBLEM
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 6 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );

          controlPoints = [ createControlPoint( 5.147227191413236, 6.57851296958855 ), createControlPoint( 0.05887058823529401, 1.0476264705882334 ), createControlPoint( -1.9427294117647067, 2.637132352941175 ), createControlPoint( -3.1201411764705886, 6.404849999999999 ), createControlPoint( 0.5690823529411766, 6.071249999999999 ), createControlPoint( -2.3940705882352944, 1.3419794117647044 ), createControlPoint( -5.474964705882353, 6.5029676470588225 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        // Falls through bottom, PROBLEM
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 7 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );

          controlPoints = [ createControlPoint( 5.147227191413236, 6.57851296958855 ), createControlPoint( -0.43896196231781204, 1.7569427657305372 ), createControlPoint( -1.1787355229664587, 2.807585005572261 ), createControlPoint( -3.1201411764705886, 6.404849999999999 ), createControlPoint( 0.5690823529411766, 6.071249999999999 ), createControlPoint( -2.3940705882352944, 1.3419794117647044 ), createControlPoint( -5.474964705882353, 6.5029676470588225 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        // Falls through loop, PROBLEM
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 8 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );

          controlPoints = [ createControlPoint( 5.07086859688196, 6.925682071269487 ), createControlPoint( 2.061781737193762, 0.7625271732714408 ), createControlPoint( 0.09287305122494338, 0.7625271732714408 ), createControlPoint( -3.287706013363029, 3.0472042334050697 ), createControlPoint( -2.2289532293986642, 4.399535077951003 ), createControlPoint( -0.6129621380846331, 4.306662026726059 ), createControlPoint( 0.7429844097995542, 3.3629726075698803 ), createControlPoint( 0.14859688195991083, 2.3227944338505053 ), createControlPoint( -1.4302449888641426, 1.4159674088426304 ), createControlPoint( -4.532204899777283, 0.580109947818132 ), createControlPoint( -6.1185746102449885, 7.75698912376468 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        // Pops upside down in loop, PROBLEM
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 9 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.frictionProperty.value = 0;

          controlPoints = [ createControlPoint( 5.516659242761692, 5.458287861915368 ), createControlPoint( 2.061781737193762, 0.7625271732714408 ), createControlPoint( 0.09287305122494338, 0.7625271732714408 ), createControlPoint( -3.287706013363029, 3.0472042334050697 ), createControlPoint( -2.2289532293986642, 4.399535077951003 ), createControlPoint( -0.6129621380846331, 4.306662026726059 ), createControlPoint( 0.7429844097995542, 3.3629726075698803 ), createControlPoint( 0.14859688195991083, 2.3227944338505053 ), createControlPoint( -1.4302449888641426, 1.4159674088426304 ), createControlPoint( -4.532204899777283, 0.580109947818132 ), createControlPoint( -6.1185746102449885, 7.75698912376468 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 10 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.frictionProperty.value = 0.0363651226158039;

          controlPoints = [ createControlPoint( 5.07086859688196, 6.925682071269487 ), createControlPoint( 2.061781737193762, 0.7625271732714408 ), createControlPoint( 0.09287305122494338, 0.7625271732714408 ), createControlPoint( -3.287706013363029, 3.0472042334050697 ), createControlPoint( -2.2289532293986642, 4.399535077951003 ), createControlPoint( -0.6129621380846331, 4.306662026726059 ), createControlPoint( 0.7429844097995542, 3.3629726075698803 ), createControlPoint( 0.14859688195991083, 2.3227944338505053 ), createControlPoint( -1.4302449888641426, 1.4159674088426304 ), createControlPoint( -4.532204899777283, 0.580109947818132 ), createControlPoint( -6.1185746102449885, 7.75698912376468 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 11 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.frictionProperty.value = 0.0363651226158039;

          controlPoints = [ createControlPoint( 7.049477756286265, 5.232410541586074 ), createControlPoint( 1.8198088164974369, 1.7349575399795614 ), createControlPoint( -0.14909986947138165, 1.7349575399795614 ), createControlPoint( 0.5162088974854928, 1.8286581237911035 ), createControlPoint( -0.4516827852998073, 11.657297387984716 ), createControlPoint( 2.0970986460348158, 5.6886320108087025 ), createControlPoint( -1.8000003436635232, 4.708138438138744 ), createControlPoint( -0.43555125725338684, 5.914473403458605 ), createControlPoint( -2.500386847195358, 4.849792552394775 ), createControlPoint( -4.774177820473608, 1.5525403145262526 ), createControlPoint( -6.339690522243714, 8.797478239845262 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 12 ) {

          model.detachableProperty.value = true;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.frictionProperty.value = 0.0363651226158039;

          controlPoints = [ createControlPoint( 0.8301088646967347, 3.5809234059097967 ), createControlPoint( 3.411228615863142, 2.4784350699844477 ), createControlPoint( 5.29194401244168, 5.928575038880248 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 13 ) {

          model.detachableProperty.value = false;
          // The skater falls through model track
          model.skater.positionProperty.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.frictionProperty.value = 0.0363651226158039;

          controlPoints = [ createControlPoint( 0.8301088646967347, 3.5809234059097967 ), createControlPoint( 3.411228615863142, 2.4784350699844477 ), createControlPoint( 5.29194401244168, 5.928575038880248 ) ];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track.physicalProperty.value = true;
          model.tracks.add( track );
        }

        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 14 ) {
          model.detachableProperty.value = true;
          model.skater.positionProperty.set( new Vector2( -6.698445595854922, 6.5278756476683935 ) );
          model.skater.released( 0, 0 );
          model.frictionProperty.value = 0.05;

          var controlPoints1 = [
            createControlPoint( -6.23, -0.85 ),
            createControlPoint( -5.23, -0.85 ),
            createControlPoint( -4.23, -0.85 )
          ];
          var track1 = new Track( model, model.tracks, controlPoints1, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track1.physicalProperty.value = false;
          model.tracks.add( track1 );

          var controlPoints2 = [
            createControlPoint( -6.23, -0.85 ),
            createControlPoint( -5.23, -0.85 ),
            createControlPoint( -4.23, -0.85 )
          ];
          var track2 = new Track( model, model.tracks, controlPoints2, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track2.physicalProperty.value = false;
          model.tracks.add( track2 );

          var controlPoints3 = [
            createControlPoint( -0.720977917981072, 1.6368312846731214 ),
            createControlPoint( 0.279022082018928, 1.6368312846731214 ),
            createControlPoint( 3.8511345589035137, 7.315696725769607 ),
            createControlPoint( -1.1916066572392037, 2.911932992494288 ),
            createControlPoint( -9.170190362232134, 6.469483302512781 )
          ];
          var track3 = new Track( model, model.tracks, controlPoints3, true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track3.physicalProperty.value = true;
          model.tracks.add( track3 );
        }

        //Test decrease in thermal energy, see https://github.com/phetsims/energy-skate-park-basics/issues/141#issuecomment-59395426
        if ( EnergySkateParkBasicsQueryParameters.testTrackIndex === 15 ) {
          model.detachableProperty.value = true;
          model.skater.positionProperty.set( new Vector2( -6.698445595854922, 6.5278756476683935 ) );
          model.skater.released( 0, 0 );
          model.frictionProperty.value = 0;
          var track15 = new Track( model, model.tracks, [
            createControlPoint( 0.9873551637279601, 7.856892317380353 ),
            createControlPoint( -0.4621662468513845, 5.9031895465994975 ),
            createControlPoint( -3.0250881612090676, 5.735129093198994 ),
            createControlPoint( -4.705692695214106, 0.9454061712846356 ),
            createControlPoint( -7.310629722921914, 7.457748740554157 )
          ], true, null, model.availableModelBoundsProperty, { tandem: trackGroupTandem.createNextTandem() } );
          track15.physicalProperty.value = true;
          model.tracks.add( track15 );
        }
      }
    }
  );
} );