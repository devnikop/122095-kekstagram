'use strict';

(function () {
  var SUCCESS_OK = 200;
  var TIMEOUT = 10000;
  var Url = {
    LOAD: 'https://js.dump.academy/kekstagram/data',
    SAVE: 'https://js.dump.academy/kekstagram'
  };

  window.backend = {
    load: function (onLoad, onError) {
      var contentLoadHandler = function () {
        if (xhr.status === SUCCESS_OK) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      };
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', contentLoadHandler);

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.open('GET', Url.LOAD);
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var dataLoadHandler = function () {
        if (xhr.status === SUCCESS_OK) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      };
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', dataLoadHandler);

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIMEOUT;

      xhr.open('POST', Url.SAVE);
      xhr.send(data);
    }
  };
})();
