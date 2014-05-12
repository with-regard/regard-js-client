requirejs.config({
  paths: {
    regardclient: '../regard-client',
    moment: '../moment.min',
  }
});


requirejs(["regardclient"], function(regard) {
  
  test( "initial time is set", function() {
    ok( regard.initialTime > 0 , "initial time set to " + regard.initialTime );
  });
  
  test( "timed event test", function() {
    regard.trackTimedEvent("timed event", function(){
      for(var i =0; i < 1000; ++i){
        console.log(" ");
      }
    });
    
    var duration = regard.timedEvents[0].duration;
    
    ok( duration > 0, "recorded " + duration + " ms");
  });
  
  test( "regular event test", function() {
    regard.trackEvent("loaded", { errors: 0 });
    
    ok( regard.events[0].name === "loaded", "loaded event tracked");
  });
  
  
});

