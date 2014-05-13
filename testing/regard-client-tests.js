requirejs.config({
  paths: {
    regardclient: '../regard-client',
    moment: '../moment.min',
    underscore: '../underscore-min',
    rsvp: '../rsvp'
  }
});


requirejs(["regardclient"], function(regard) {

  regard.setRegardURL("http://api.withregard.io/track/v1/WithRegard/Test/event");
  regard.setUserId("F16CB994-00FF-4326-B0DB-F316F7EC2942");
  
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
  
  asyncTest( "invalid URL test", function() {
    expect(1);
    
    regard.setRegardURL("http://www.google.com");
    
    regard.trackEvent("loaded", { errors: 0 }).then(function(e){ 
    }, function(err){
      ok(true);
       start();
    });
    
  });
    
});

