'use strict';

(function () {
  var SUCCESS_OK = 200;
  var TIMEOUT = 10000;
  var Url = {
    LOAD: 'https://js.dump.academy/kekstagram/data',
    SAVE: 'https://js.dump.academy/kekstagram'
  };

  var Ajax = function () {
    this.xhr = new XMLHttpRequest();
    this.xhr.responseType = 'json';
  };

  Ajax.prototype = {
    loadHandler: function (onLoad, onError) {
      this.xhr.addEventListener('load', this.contentLoadHandler.bind(this.xhr, onLoad, onError));
    },

    contentLoadHandler: function (onLoad, onError) {
      if (this.status === SUCCESS_OK) {
        onLoad(this.response);
      } else {
        onError('Статус ответа: ' + this.status + ' ' + this.statusText);
      }
    },

    errorHandler: function (onError) {
      this.xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
    }
  };

  window.backend = {
    load: function (onLoad, onError) {
      var loadAjax = new Ajax();
      loadAjax.loadHandler(onLoad, onError);
      loadAjax.errorHandler(onError);
      loadAjax.xhr.open('GET', Url.LOAD);
      loadAjax.xhr.send();
    },

    save: function (data, onLoad, onError) {
      var saveAjax = new Ajax();
      saveAjax.loadHandler(onLoad, onError);
      saveAjax.errorHandler(onError);
      saveAjax.xhr.timeout = TIMEOUT;
      saveAjax.xhr.open('POST', Url.SAVE);
      saveAjax.xhr.send(data);
    }
  };
})();
