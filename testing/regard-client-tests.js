requirejs.config({
  paths: {
    regardclient: '../regard-client',
    moment: '../moment.min',
    underscore: '../underscore-min',
    rsvp: '../rsvp'
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
  
  asyncTest( "regular event test", function() {
    expect(1);
     
    regard.trackEvent("loaded", { errors: 0 }).then(function(e){ 
       ok( e.name === "loaded", "loaded event tracked");
       start();
    }, function(err){});
    
  });
  
  asyncTest( "undefined eventName errors test", function() {
    expect(1);

    regard.trackEvent(null, { errors: 0 }).then(function(e){}, function(err){
      ok(err.message, err.message);
      start();
    }); 
  });
  
});

