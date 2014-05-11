requirejs.config({
  paths: {
    regardclient: '../regard-client'
  }
});


requirejs(["regardclient"], function(regard) {

  test( "initial time is set", function() {
    ok( regard.initialTime > 0 , "initial time set to " + regard.initialTime );
  });
  
});

