 requirejs.config({
    paths: {
        'regard': '../dist/regard'
    }
  });
    
  require(['regard'], function(regard) {
          
    regard.setRegardURL("http://api.withregard.io/track/v1/WithRegard/Test/event");
    regard.setUserId("F16CB994-00FF-4326-B0DB-F316F7EC2942");
    
    test( "times events", function() {
      regard.trackTimedEvent("timed event", function(){
        for(var i =0; i < 1000; ++i){
          console.log(" ");
        }
      });
      
      var duration = regard.timedEvents[0].duration;
      
      ok( duration > 0, "recorded " + duration + " ms");
    });
    
    test("creates a new session when imported", function() {
      var newRegard = require('regard');
      ok(newRegard.getSessionId(), regard.getSessionId());
    });
    
    test("creates a new user when imported", function() {
      var newRegard = require('regard');
      ok(newRegard.getUserId(), regard.getUserId());
    });
    
    asyncTest( "tracks events", function() {
      expect(1);
      
      regard.trackEvent("loaded", { errors: 0 }).then(function(e){ 
        ok( e["event-type"] === "loaded", "loaded event tracked");
        start();
      }, function(err){
        ok(false, err);
        start();
      });
      
    });
    
    asyncTest("requires an eventName", function() {
      expect(1);
      
      regard.trackEvent(null, { errors: 0 }).then(function(e){
        ok(false, e);
        start();
      }, function(err){
        ok(err.message, err.message);
        start();
      }); 
    });
    
    asyncTest("errors when the URL is wrong", function() {
      expect(1);
      
      regard.setRegardURL("http://www.zurpsop.com/");
      
      regard.trackEvent("loaded", { errors: 0 }).then(function(e){ 
      }, function(err){
        ok(true, err.message);
        start();
      });
      
    });
    });