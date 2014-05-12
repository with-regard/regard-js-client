define(function (require, exports, module) {

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
  

  exports.initialTime = _initialTime;
  exports.timeEvent = _timeEvent;
  exports.timedEvents = _timedEvents;
});