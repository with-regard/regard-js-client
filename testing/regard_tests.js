 requirejs.config({
   paths: {
     'regard': '../dist/regard'
   }
 });

 require(['regard'], function (regard) {

   regard.setOrganization('WithRegard');
   regard.setProduct('Test');

   asyncTest("tracks events", function () {
     expect(1);

     regard.trackEvent("loaded", {
       errors: 0
     }).then(function (e) {
       ok(e["event-type"] === "loaded", "loaded event tracked");
       start();
     }, function (err) {
       ok(false, err);
       start();
     });

   });

   asyncTest("requires an eventName", function () {
     expect(1);

     regard.trackEvent(null, {
       errors: 0
     }).then(function (e) {
       ok(false, e);
       start();
     }, function (err) {
       ok(err.message, err.message);
       start();
     });
   });

   asyncTest("errors when the URL is wrong", function () {
     expect(1);

     regard.setRegardURL("http://www.zurpsop.com/");

     regard.trackEvent("loaded", {
       errors: 0
     }).then(function (e) {}, function (err) {
       ok(true, err.message);
       start();
     });

   });
 });