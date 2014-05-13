define(function (require, exports, module) {
  var moment = require("moment");
  var underscore = require("underscore");
  
  var _createGuid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  };
  
  var _createUndefinedError = function(functionName, identifier){
    return new Error(functionName + "(): " + identifier + " must be defined");
  }
  
  var _timedEvents = [];
  var _events = [];
  var _submitEventsImmediately = true;
  var _regardURL = "http://api.withregard.io/track/v1/WithRegard/Test/event";
  var _sessionId = _createGuid();
  var _userId = "F16CB994-00FF-4326-B0DB-F316F7EC2942"; 
  var _initialTime = moment();
  var _newSession = true;

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
    if(event === undefined){
      throw _createUndefinedError("_postEvent", "event");
    }
    if(_sessionId === undefined){
      throw new Error("_postEvent(): A session id must be defined");
    }
    if(_userId === undefined){
      throw new Error("_postEvent(): A user id must be defined");
    }
    
    
    event["session-id"] = _sessionId;
    event["user-id"] = _userId;
    event["new-session"] = _newSession;
    
    var postEventRequest = new XMLHttpRequest();
    postEventRequest.open("POST", _regardURL, true);
    postEventRequest.send(JSON.stringify(event));
    
    _newSession = false;
  };
   
  var _trackEvent = function(eventName, props, callback){
    if(eventName){
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
      
      if(callback){
        callback(event);
      }
    }
    else{
      throw _createUndefinedError("_trackEvent", "eventName");
    }
  }
    
  exports.initialTime = _initialTime;
  exports.trackTimedEvent = _timedEvent;
  exports.timedEvents = _timedEvents;
  exports.events = _events;
  exports.trackEvent = _trackEvent;
  exports.startNewSession = function() { 
    _sessionId = _createGuid();
    _newSession = true;
    return _sessionId;
  };
  exports.setRegardURL = function(url){ _regardURL = url; };
  exports.setUserId = function(userId) { _userId = userId; };
});