var moment = require('moment');
var rsvp = require('rsvp');

var _createGuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

var _initId = function (idName, storage) {
  var id = storage.getItem(idName);

  if (!id) {
    id = _createGuid();
    storage.setItem(idName, id);
  }

  return id;
};

var _sessionId = _initId('sessionId', sessionStorage);
var _userId = _initId('userId', localStorage);
var _product = '';
var _organization = '';

var _createUndefinedError = function (functionName, identifier) {
  return new Error(functionName + '(): ' + identifier + ' must be defined');
};

var _getRegardUrl = function () {
  if (!_organization) {
    _createUndefinedError('_getRegardUrl', '_organization');
  };
  if (!_product) {
    _createUndefinedError('_getRegardUrl', '_product');
  };

  return 'http://api.withregard.io/track/v1/' + _organization + '/' + _product + '/event';
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

var _trackEvent = function (eventType, props) {
  return new rsvp.Promise(function (resolve, reject) {
    if (!eventType) {
      reject(_createUndefinedError('_trackEvent', 'eventType'));
      return;
    }
    if (!_sessionId) {
      reject(_createUndefinedError('_postEvent', 'A session Id'));
      return;
    }
    if (!_userId) {
      reject(_createUndefinedError('_postEvent', 'A user Id'));
      return;
    }

    var event = {
      'event-type': eventType,
      'session-id': _sessionId,
      'user-id': _userId,
      'time': moment().valueOf()
    };
    if (props) {
      event['data'] = props;
    }

    _postEvent(event).then(resolve, reject);
  });
};

module.exports.trackEvent = _trackEvent;
module.exports.getUserId = function () {
  return _userId;
};
module.exports.setOrganization = function (org) {
  _organization = org;
};
module.exports.setProduct = function (prod) {
  _product = prod;
};