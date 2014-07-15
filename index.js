var moment = require('moment');
var rsvp = require('rsvp');
var _ = require('underscore');
var uuid = require('node-uuid');

var _createGuid = function () {
  return uuid.v4();
};

var _createUndefinedError = function (functionName, identifier) {
  return new Error(functionName + '(): ' + identifier + ' must be defined');
};

var _initId = function (idName, storage, onNewId) {
  var id = storage.getItem(idName);

  if (!id) {
    id = _createGuid();
    storage.setItem(idName, id);
    if(onNewId){
      onNewId(id);
    }
  }

  return id;
};

var _sessionId = '';
var _userId = '';
var _product = '';
var _organization = '';
var _defaultProps = {};

var _reportNewUser = function(userId){
  if(!userId){
    _createUndefinedError('_reportNewUser', 'userId');
  }
  console.log('reporting new user');
  _trackEvent(userId, _sessionId, 'user.new');
}

var _setupIds = function(){
   _sessionId = _initId('sessionId', sessionStorage);
   _userId = _initId('userId', localStorage, _reportNewUser);
};


var _getRegardUrl = function () {
  if (!_organization) {
    _createUndefinedError('_getRegardUrl', '_organization');
  };
  if (!_product) {
    _createUndefinedError('_getRegardUrl', '_product');
  };

  return 'https://api.withregard.io/track/v1/' + _organization + '/' + _product + '/event';
};

var _postEvent = function (event) {
  return new rsvp.Promise(function (resolve, reject) {
    if (!event) {
      reject(_createUndefinedError('_postEvent', 'event'));
      return;
    }
    var postEventRequest = new XMLHttpRequest();
    postEventRequest.onreadystatechange = function () {
      if (postEventRequest.readyState === 4) {
        if (postEventRequest.status === 200) {
          resolve(event);
        } else {
          reject(new Error(postEventRequest.statusText));
        }
      }
    };
    postEventRequest.open('POST', _getRegardUrl(), true);
    postEventRequest.send(JSON.stringify(event));
  });
};

var _trackEvent = function (userId, sessionId, eventType, props) {
  return new rsvp.Promise(function (resolve, reject) {
    if (!eventType) {
      reject(_createUndefinedError('_trackEvent', 'eventType'));
      return;
    }
    if (!userId) {
      reject(_createUndefinedError('_trackEvent', 'userId'));
      return;
    }
    if (!sessionId) {
      reject(_createUndefinedError('_trackEvent', 'sessionId'));
      return;
    }

    var event = {
      'event-type': eventType,
      'session-id': sessionId,
      'user-id': userId,
      'time': moment().valueOf()
    };
    if (props) {
      event['data'] = props;
    }
    _.extend(event['data'], _defaultProps);

    _postEvent(event).then(resolve, reject);
  });
};

module.exports.trackEvent = function(eventType, props){
  if(!_sessionId || !_userId){
    _setupIds();
  }
  return _trackEvent( _userId, _sessionId, eventType, props);
} ;
module.exports.getUserId = function () {
  return _userId;
};
module.exports.getUserDataUrl = function() {
  return 'https://www.withregard.io/dashboard/userevents/' + _organization + '/' + _product + '/' + _userId;
}
module.exports.setOrganization = function (org) {
  _organization = org;
};
module.exports.setProduct = function (prod) {
  _product = prod;
};
module.exports.setDefaultProperties = function(props){
  _defaultProps = props;
};
