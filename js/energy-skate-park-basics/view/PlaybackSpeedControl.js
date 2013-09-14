define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var PushButton = require( 'SUN/PushButton' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var imageLoader = require( 'ENERGY_SKATE_PARK/energy-skate-park-basics-images' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ToggleButton = require( 'SUN/ToggleButton' );
  var Text = require( 'SCENERY/nodes/Text' );

  function PlayPauseControlPanel( model, options ) {
    VBox.call( this, {align: 'left', spacing: 4, children: [
      new AquaRadioButton( model.speedProperty, 'normal', new Text( 'Normal', {fontSize: 15} ), {radius: 12, x: 130} ),
      new AquaRadioButton( model.speedProperty, 'slow', new Text( 'Slow Motion', {fontSize: 15} ), {radius: 12} )
    ]} );
  }

  return inherit( VBox, PlayPauseControlPanel );
} );