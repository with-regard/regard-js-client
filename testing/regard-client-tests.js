require.config({
  paths: {
    regardclient: '../regard-client'
  }
});


requirejs(["regardclient"], function(regard) {

  test( "hello test", function() {
    ok( 1 == "1", "Passed!" );
  });
  
});

