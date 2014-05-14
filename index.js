  var moment = require("moment");
  var _ = require("underscore");
  var rsvp = require("rsvp");
  
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
    return new rsvp.Promise(function(resolve, reject){
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
      event["time"] = moment().valueOf();
      
      postEventRequest.open("POST", _regardURL, true);
      postEventRequest.send(JSON.stringify(event));
    });
  };
   
  var _trackEvent = function(eventType, props){
    return new rsvp.Promise(function(resolve, reject){
      if(!eventType){
        reject(_createUndefinedError("_trackEvent", "eventType"));
      }
       
      var event = {
        "event-type": eventType,
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
    
  module.exports.initialTime = _initialTime;
  module.exports.trackTimedEvent = _timedEvent;
  module.exports.timedEvents = _timedEvents;
  module.exports.events = _events;
  module.exports.trackEvent = _trackEvent;
  module.exports.startNewSession = function() { 
    _sessionId = _createGuid();
    _newSession = true;
    return _sessionId;
  };
  module.exports.setRegardURL = function(url){ _regardURL = url; };
  module.exports.setUserId = function(userId) { _userId = userId; };