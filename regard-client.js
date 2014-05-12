define(function (require, exports, module) {
  var moment = require("moment");
  
  var _timedEvents = [];
  var _events = [];
  
  var _initialTime = moment();
  
  var _timedEvent = function(eventName, funcToTime){
    var begin = moment();
    funcToTime();
    var end = moment();
    
    _timedEvents.push({
      name : eventName,
      startTime : begin.valueOf(),
      endTime : end.valueOf(),
      duration: end.diff(begin)
    });
  };
  
  var _trackEvent = function(eventName, props){
    _events.push({
      name : eventName,
      properties: props
    });
  }
    
  exports.initialTime = _initialTime;
  exports.trackTimedEvent = _timedEvent;
  exports.timedEvents = _timedEvents;
  exports.events = _events;
  exports.trackEvent = _trackEvent;
});