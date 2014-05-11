requirejs.config({
  paths: {
    regardclient: '../regard-client'
  }
});


requirejs(["regardclient"], function(regard) {
  
  test( "initial time is set", function() {
    ok( regard.initialTime > 0 , "initial time set to " + regard.initialTime );
  });
  
  test( "timed event test", function() {
    regard.timeEvent("timed event", function(){
      for(var i =0; i < 1000; ++i){
        console.log(i);
      }
    });
    
    var duration = regard.timedEvents[0].duration;
    
    ok( duration > 0, "recorded " + duration + " ms");
  });
  
});

