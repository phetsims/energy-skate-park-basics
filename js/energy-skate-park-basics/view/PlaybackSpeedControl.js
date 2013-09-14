define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );

  function PlayPauseControlPanel( model, options ) {
    VBox.call( this, {align: 'left', spacing: 4, children: [
      new AquaRadioButton( model.speedProperty, 'normal', new Text( 'Normal', {fontSize: 15} ), {radius: 12, x: 130} ),
      new AquaRadioButton( model.speedProperty, 'slow', new Text( 'Slow Motion', {fontSize: 15} ), {radius: 12} )
    ]} );
  }

  return inherit( VBox, PlayPauseControlPanel );
} );