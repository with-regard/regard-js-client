define(function () {

  var _timedEvents = [];
  
  var _initialTime = Date.now();
  var _timeEvent = function(eventName, funcToTime){
    var begin = Date.now();
    funcToTime();
    var end = Date.now();
    
    _timedEvents.push({
      name : eventName,
      startTime : begin,
      endTime : end,
      duration: end - begin
    });
  };
  

  return {
    initialTime : _initialTime,
    timeEvent : _timeEvent,
    timedEvents : _timedEvents
  }
});