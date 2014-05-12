define(function (require, exports, module) {
  var moment = require("moment");
  var underscore = require("underscore");
  
  var _timedEvents = [];
  var _events = [];
  var _submitEventsImmediately = true;
  var _regardURL = "http://api.withregard.io/track/v1/WithRegard/Test/event";
  var _sessionId = "cdaa91fc-9c94-4826-9f2a-177be440f1ff";
  var _userId = "F16CB994-00FF-4326-B0DB-F316F7EC2942";
  
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
  
  var _postEvent = function(event){
    
    event["session-id"] = _sessionId;
    event["user-id"] = _userId;
    
    var postEventRequest = new XMLHttpRequest();
    postEventRequest.open("POST", _regardURL, true);
    postEventRequest.send(JSON.stringify(event));
  };
   
  var _trackEvent = function(eventName, props){
    var event = { 
      name: eventName,
    };           
    
    _.extend(event, props);
    
    if(_submitEventsImmediately){
      _postEvent(event);
    }
    else{
      _events.push(event);
    }
  }
    
  exports.initialTime = _initialTime;
  exports.trackTimedEvent = _timedEvent;
  exports.timedEvents = _timedEvents;
  exports.events = _events;
  exports.trackEvent = _trackEvent;
});