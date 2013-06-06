require( ['util/WebsocketRefresh',
           '../common/phetcommon/js/analytics/Analytics',
           'i18n!../nls/energy-skate-park-strings',
           'view/Tab',
           'easel',
           'tpl!../tab.html',
           'phetcommon/model/property/Property'
         ], function ( WebsocketRefresh, Analytics, Strings, Tab, Easel, tabTemplate, Property) {

  WebsocketRefresh.listenForRefresh();
  var analytics = new Analytics();

//    var tabs = ["introductionTab", "frictionTab", "trackPlaygroundTab"];
  var tabs = ["introductionTab"];

  var tab0 = tabs[0];
  var activeTab = new Property( tab0 );
  var $container = $( '#container' );

  var tabInstances = [];
  for ( var i = 0; i < tabs.length; i++ ) {
    var tab = tabs[i];
    var filledTemplate = tabTemplate( {id: tab,
                                        barGraph: Strings["plots.bar-graph"],
                                        pieChart: Strings["pieChart"],
                                        grid: Strings["controls.show-grid"],
                                        speed: Strings["properties.speed"]} );
    console.log( filledTemplate );
    $container.append( filledTemplate ).trigger( "create" );
    var $tab = $( "#" + tab );
    const tabInstance = new Tab( $tab, Easel, Strings, analytics, tab, activeTab );
    tabInstance.render();
    tabInstances.push( tabInstance );
    if ( i > 0 ) {
      $tab.hide();
    }
    $container.trigger( "create" );
  }

  activeTab.addObserver( function ( newTab ) {
    for ( var j = 0; j < tabs.length; j++ ) {
      $( "#" + tabs[j] ).hide();
    }
    $( "#" + newTab ).show();
  } );

  //TODO: add touchmove too
  window.onmousemove = function () {
    var event = event || window.event;
    tabInstances[0].model.update( "mouseMove", event.x, event.y );
  };

  document.addEventListener( 'touchmove', preventDefault, false );
  function preventDefault( e ) {
    tabInstances[0].model.update( "mouseMove", e.touches[0].pageX, e.touches[0].pageY );
  };

} );
