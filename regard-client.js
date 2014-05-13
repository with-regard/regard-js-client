define(function (require, exports, module) {
  var moment = require("moment");
  var underscore = require("underscore");
  require("rsvp");
  
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
  var _regardURL = "";
  var _sessionId = _createGuid();
  var _userId = ""; 
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
    return new RSVP.Promise(function(resolve, reject){
      if(!event){
        reject(_createUndefinedError("_postEvent", "event"));
      }
      if(!_sessionId){
        reject(_createUndefinedError("_postEvent", "A session Id"));
      }
      if(!_userId){
        reject(_createUndefinedError("_postEvent", "A user Id"));
      }
          
      var postEventRequest = new XMLHttpRequest();
      postEventRequest.onreadystatechange = function(){
        if(postEventRequest.readyState === 4){
          if(postEventRequest.status === 200){
            _newSession = false;
            resolve(event);
          }
          else{
            reject(new Error(postEventRequest.statusText));
          }
        }
      };
      
      event["session-id"] = _sessionId;
      event["user-id"] = _userId;
      event["new-session"] = _newSession;
      
      postEventRequest.open("POST", _regardURL, true);
      postEventRequest.send(JSON.stringify(event));
    });
  };
   
  var _trackEvent = function(eventName, props){
    return new RSVP.Promise(function(resolve, reject){
      if(!eventName){
        reject(_createUndefinedError("_trackEvent", "eventName"));
      }
       
      var event = {
        name: eventName,
      };           
      _.extend(event, props);
      
      if(_submitEventsImmediately){
        _postEvent(event).then(resolve, reject);
      }
      else{
        _events.push(event);
        resolve(event);
      }
    });   
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