'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var onChangeFileChooserElement = function () {
    var onLoadFile = function () {
      uploadImageElement.src = reader.result;
      [].forEach.call(effectsPreviewElements, function (element) {
        element.style.backgroundImage = 'url(' + reader.result + ')';
      });
    };

    var file = fileChooserElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      var uploadImageElement = document.querySelector('.img-upload__preview > img');
      var effectsPreviewElements = document.querySelectorAll('.effects__preview');

      reader.addEventListener('load', onLoadFile);
      reader.readAsDataURL(file);
    }
  };

  var fileChooserElement = document.querySelector('.img-upload__input');
  fileChooserElement.addEventListener('change', onChangeFileChooserElement);
})();
