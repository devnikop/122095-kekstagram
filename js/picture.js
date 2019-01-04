'use strict';

(function () {
  var generateNodeOfPicture = function (pictureElement, picture, bigPictureTemplate) {
    var onPictureClick = function (evt) {
      evt.preventDefault();
      window.preview(bigPictureTemplate, picture);
    };

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    pictureElement.querySelector('.picture').addEventListener('click', onPictureClick);
    return pictureElement;
  };

  var addPicturesInFragment = function (pictures) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pictures.length; i++) {
      var pictureElement = pictureTemplate.cloneNode(true);
      fragment.appendChild(generateNodeOfPicture(pictureElement, pictures[i], bigPictureTemplate));
    }
    return fragment;
  };

  var successHandler = function (pictures) {
    picturesContainerElement.appendChild(addPicturesInFragment(pictures));
    imgFilters.classList.remove('img-filters--inactive');
  };

  var errorHandler = function () {

  };

  var picturesContainerElement = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');
  var pictureTemplate = document.querySelector('#picture').content;
  var bigPictureTemplate = document.querySelector('.big-picture-template').content;

  window.backend.load(successHandler, errorHandler);
})();
