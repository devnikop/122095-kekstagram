'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = document.querySelector('.img-upload__input');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      var uploadImage = document.querySelector('.img-upload__preview > img');

      reader.addEventListener('load', function () {
        uploadImage.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
