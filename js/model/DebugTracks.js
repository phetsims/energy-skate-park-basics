// Copyright 2002-2014, University of Colorado Boulder

/**
 * Debug tracks, which can be enabled using the query parameter 'debugTrack' with the index of the track to debug.
 * There is no automated testing, you have to launch the track and see if the behavior looks correct.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Track = require( 'ENERGY_SKATE_PARK_BASICS/model/Track' );
  var ControlPoint = require( 'ENERGY_SKATE_PARK_BASICS/model/ControlPoint' );
  var Vector2 = require( 'DOT/Vector2' );

  function DebugTrack() {
  }

  return inherit( Object, DebugTrack, {}, {
      init: function( model ) {
        // Tracks to help demonstrate issues

        var controlPoints = null;
        var track = null;
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '1' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( -5, 8 ) );
          model.skater.released( 0, 0 );

          controlPoints = [new ControlPoint( 3.9238282647584946, 3.1917866726296955 ), new ControlPoint( 2.043971377459748, 4.847851073345259 ), new ControlPoint( -1.116994633273702, 3.686296958855098 ), new ControlPoint( -3.5806797853309487, 1.8639512522361352 ), new ControlPoint( -5.982719141323793, 6.235364490161 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        // Skater stutters and slows going over the hump
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '2' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( -5, 7.7 ) );
          model.skater.released( 0, 0 );

          controlPoints = [new ControlPoint( 3.9238282647584946, 3.1917866726296955 ), new ControlPoint( 2.043971377459748, 4.847851073345259 ), new ControlPoint( -1.116994633273702, 3.686296958855098 ), new ControlPoint( -3.5806797853309487, 1.8639512522361352 ), new ControlPoint( -5.982719141323793, 6.235364490161 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        // Tricky one--handled OK
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '3' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( -5, 7.7 ) );
          model.skater.released( 0, 0 );

          controlPoints = [new ControlPoint( -1.8031842576028616, 3.53633273703041 ), new ControlPoint( 1.7306618962432907, 2.8187991949910547 ), new ControlPoint( 1.9246153846153842, 4.3405881037567084 ), new ControlPoint( 3.834311270125223, 4.907529069767442 ), new ControlPoint( 3.491162790697672, 1.0732177996422188 ), new ControlPoint( -2.760107334525939, 1.461124776386404 ), new ControlPoint( -5.162146690518783, 5.832538014311269 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        // Wide loop, OK
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '4' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( -5, 7.7 ) );
          model.skater.released( 0, 0 );

          controlPoints = [new ControlPoint( 4.639964221824686, 6.68294946332737 ), new ControlPoint( 1.4173524150268335, 0.938942307692308 ), new ControlPoint( -3.207692307692308, 3.997439624329159 ), new ControlPoint( 3.2524508050089445, 3.9079226296958858 ), new ControlPoint( 3.491162790697672, 1.0732177996422188 ), new ControlPoint( -2.760107334525939, 1.461124776386404 ), new ControlPoint( -5.162146690518783, 5.832538014311269 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        // Flickering return skater button, PROBLEM
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '5' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( -5, 7.7 ) );
          model.skater.released( 0, 0 );

          controlPoints = [new ControlPoint( 4.431091234347049, 7.9252447313977665 ), new ControlPoint( 2.4169588550983896, 7.975935759156005 ), new ControlPoint( -1.9874106197862114, 4.75700797278857 ), new ControlPoint( 0.13992761930286512, 6.207060140642635 ), new ControlPoint( 1.447191413237924, 1.0090653610430707 ), new ControlPoint( -1.7008228980322002, 1.0717102008522177 ), new ControlPoint( -5.37101967799642, 7.0748332823816655 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        // Passes through track, PROBLEM
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '6' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );

          controlPoints = [new ControlPoint( 5.147227191413236, 6.57851296958855 ), new ControlPoint( 0.05887058823529401, 1.0476264705882334 ), new ControlPoint( -1.9427294117647067, 2.637132352941175 ), new ControlPoint( -3.1201411764705886, 6.404849999999999 ), new ControlPoint( 0.5690823529411766, 6.071249999999999 ), new ControlPoint( -2.3940705882352944, 1.3419794117647044 ), new ControlPoint( -5.474964705882353, 6.5029676470588225 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        // Falls through bottom, PROBLEM
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '7' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );

          controlPoints = [new ControlPoint( 5.147227191413236, 6.57851296958855 ), new ControlPoint( -0.43896196231781204, 1.7569427657305372 ), new ControlPoint( -1.1787355229664587, 2.807585005572261 ), new ControlPoint( -3.1201411764705886, 6.404849999999999 ), new ControlPoint( 0.5690823529411766, 6.071249999999999 ), new ControlPoint( -2.3940705882352944, 1.3419794117647044 ), new ControlPoint( -5.474964705882353, 6.5029676470588225 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        // Falls through loop, PROBLEM
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '8' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );

          controlPoints = [new ControlPoint( 5.07086859688196, 6.925682071269487 ), new ControlPoint( 2.061781737193762, 0.7625271732714408 ), new ControlPoint( 0.09287305122494338, 0.7625271732714408 ), new ControlPoint( -3.287706013363029, 3.0472042334050697 ), new ControlPoint( -2.2289532293986642, 4.399535077951003 ), new ControlPoint( -0.6129621380846331, 4.306662026726059 ), new ControlPoint( 0.7429844097995542, 3.3629726075698803 ), new ControlPoint( 0.14859688195991083, 2.3227944338505053 ), new ControlPoint( -1.4302449888641426, 1.4159674088426304 ), new ControlPoint( -4.532204899777283, 0.580109947818132 ), new ControlPoint( -6.1185746102449885, 7.75698912376468 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        // Pops upside down in loop, PROBLEM
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '9' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.friction = 0;

          controlPoints = [new ControlPoint( 5.516659242761692, 5.458287861915368 ), new ControlPoint( 2.061781737193762, 0.7625271732714408 ), new ControlPoint( 0.09287305122494338, 0.7625271732714408 ), new ControlPoint( -3.287706013363029, 3.0472042334050697 ), new ControlPoint( -2.2289532293986642, 4.399535077951003 ), new ControlPoint( -0.6129621380846331, 4.306662026726059 ), new ControlPoint( 0.7429844097995542, 3.3629726075698803 ), new ControlPoint( 0.14859688195991083, 2.3227944338505053 ), new ControlPoint( -1.4302449888641426, 1.4159674088426304 ), new ControlPoint( -4.532204899777283, 0.580109947818132 ), new ControlPoint( -6.1185746102449885, 7.75698912376468 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '10' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.friction = 0.0363651226158039;

          controlPoints = [new ControlPoint( 5.07086859688196, 6.925682071269487 ), new ControlPoint( 2.061781737193762, 0.7625271732714408 ), new ControlPoint( 0.09287305122494338, 0.7625271732714408 ), new ControlPoint( -3.287706013363029, 3.0472042334050697 ), new ControlPoint( -2.2289532293986642, 4.399535077951003 ), new ControlPoint( -0.6129621380846331, 4.306662026726059 ), new ControlPoint( 0.7429844097995542, 3.3629726075698803 ), new ControlPoint( 0.14859688195991083, 2.3227944338505053 ), new ControlPoint( -1.4302449888641426, 1.4159674088426304 ), new ControlPoint( -4.532204899777283, 0.580109947818132 ), new ControlPoint( -6.1185746102449885, 7.75698912376468 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '11' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.friction = 0.0363651226158039;

          controlPoints = [new ControlPoint( 7.049477756286265, 5.232410541586074 ), new ControlPoint( 1.8198088164974369, 1.7349575399795614 ), new ControlPoint( -0.14909986947138165, 1.7349575399795614 ), new ControlPoint( 0.5162088974854928, 1.8286581237911035 ), new ControlPoint( -0.4516827852998073, 11.657297387984716 ), new ControlPoint( 2.0970986460348158, 5.6886320108087025 ), new ControlPoint( -1.8000003436635232, 4.708138438138744 ), new ControlPoint( -0.43555125725338684, 5.914473403458605 ), new ControlPoint( -2.500386847195358, 4.849792552394775 ), new ControlPoint( -4.774177820473608, 1.5525403145262526 ), new ControlPoint( -6.339690522243714, 8.797478239845262 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }

        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '12' ) {

          model.detachable = true;
          // The skater falls through model track
          model.skater.position.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.friction = 0.0363651226158039;

          controlPoints = [new ControlPoint( 0.8301088646967347, 3.5809234059097967 ), new ControlPoint( 3.411228615863142, 2.4784350699844477 ), new ControlPoint( 5.29194401244168, 5.928575038880248 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '13' ) {

          model.detachable = false;
          // The skater falls through model track
          model.skater.position.set( new Vector2( 5, 7.9 ) );
          model.skater.released( 0, 0 );
          model.friction = 0.0363651226158039;

          controlPoints = [new ControlPoint( 0.8301088646967347, 3.5809234059097967 ), new ControlPoint( 3.411228615863142, 2.4784350699844477 ), new ControlPoint( 5.29194401244168, 5.928575038880248 )];
          track = new Track( model, model.tracks, controlPoints, true, null, model.availableModelBoundsProperty );
          track.physical = true;
          model.tracks.add( track );
        }
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '14' ) {
          model.detachable = true;
          model.skater.position.set( new Vector2( -6.698445595854922, 6.5278756476683935 ) );
          model.skater.released( 0, 0 );
          model.friction = 0.05;

          var controlPoints1 = [
            new ControlPoint( -6.23, -0.85 ),
            new ControlPoint( -5.23, -0.85 ),
            new ControlPoint( -4.23, -0.85 )
          ];
          var track1 = new Track( model, model.tracks, controlPoints1, true, null, model.availableModelBoundsProperty );
          track1.physical = false;
          model.tracks.add( track1 );

          var controlPoints2 = [
            new ControlPoint( -6.23, -0.85 ),
            new ControlPoint( -5.23, -0.85 ),
            new ControlPoint( -4.23, -0.85 )
          ];
          var track2 = new Track( model, model.tracks, controlPoints2, true, null, model.availableModelBoundsProperty );
          track2.physical = false;
          model.tracks.add( track2 );

          var controlPoints3 = [
            new ControlPoint( -0.720977917981072, 1.6368312846731214 ),
            new ControlPoint( 0.279022082018928, 1.6368312846731214 ),
            new ControlPoint( 3.8511345589035137, 7.315696725769607 ),
            new ControlPoint( -1.1916066572392037, 2.911932992494288 ),
            new ControlPoint( -9.170190362232134, 6.469483302512781 )
          ];
          var track3 = new Track( model, model.tracks, controlPoints3, true, null, model.availableModelBoundsProperty );
          track3.physical = true;
          model.tracks.add( track3 );
        }

        //Test decrease in thermal energy, see https://github.com/phetsims/energy-skate-park-basics/issues/141#issuecomment-59395426
        if ( window.phetcommon.getQueryParameter( 'debugTrack' ) === '15' ) {
          model.detachable = true;
          model.skater.position.set( new Vector2( -6.698445595854922, 6.5278756476683935 ) );
          model.skater.released( 0, 0 );
          model.friction = 0;
          var track15 = new Track( model, model.tracks, [
            new ControlPoint( 0.9873551637279601, 7.856892317380353 ),
            new ControlPoint( -0.4621662468513845, 5.9031895465994975 ),
            new ControlPoint( -3.0250881612090676, 5.735129093198994 ),
            new ControlPoint( -4.705692695214106, 0.9454061712846356 ),
            new ControlPoint( -7.310629722921914, 7.457748740554157 )
          ], true, null, model.availableModelBoundsProperty );
          track15.physical = true;
          model.tracks.add( track15 );
        }
      }}
  );
} );