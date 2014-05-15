  var moment = require("moment");
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
          
      var postEventRequest = new XMLHttpRequest();
      postEventRequest.onreadystatechange = function(){
        if(postEventRequest.readyState === 4){
          if(postEventRequest.status === 200){
            resolve(event);
          }
          else{
            reject(new Error(postEventRequest.statusText));
          }
        }
      };
      
      postEventRequest.open("POST", _regardURL, true);
      postEventRequest.send(JSON.stringify(event));
    });
  };
   
  var _trackEvent = function(eventType, props){
    return new rsvp.Promise(function(resolve, reject){
      if(!eventType){
        reject(_createUndefinedError("_trackEvent", "eventType"));
      }
      if(!_sessionId){
        reject(_createUndefinedError("_postEvent", "A session Id"));
      }
      if(!_userId){
        reject(_createUndefinedError("_postEvent", "A user Id"));
      }
       
       var event = {
        "event-type" : eventType,
        "session-id" : _sessionId,
        "user-id" : _userId,
        "time" : moment().valueOf()
      };           
      
      if(props){
        event["data"] = props;
      } 
      
      if(_submitEventsImmediately){
        _postEvent(event).then(resolve, reject);
      }
      else{
        _events.push(event);
        resolve(event);
      }
    });   
  }
    
  module.exports.trackTimedEvent = _timedEvent;
  module.exports.timedEvents = _timedEvents;
  module.exports.events = _events;
  module.exports.trackEvent = _trackEvent;
  module.exports.startNewSession = function() { 
    _sessionId = _createGuid();
    return _sessionId;
  };
  module.exports.setRegardURL = function(url){ _regardURL = url; };
  module.exports.setUserId = function(userId) { _userId = userId; };