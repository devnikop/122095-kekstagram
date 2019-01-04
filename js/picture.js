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
    arrayOfPictures = pictures;
    picturesContainerElement.appendChild(addPicturesInFragment(arrayOfPictures));
    imgFilters.classList.remove('img-filters--inactive');
  };

  var errorHandler = function () {

  };

  var picturesDelete = function () {
    var pictureElements = picturesContainerElement.querySelectorAll('.picture');
    [].forEach.call(pictureElements, function (picture) {
      picture.remove();
    });
  };

  var onClickPopularButton = function () {
    picturesDelete();
    picturesContainerElement.appendChild(addPicturesInFragment(arrayOfPictures));
  };

  var onClickNewButton = function () {
    picturesDelete();
    var uniquePictures = [];
    while (uniquePictures.length < 10) {
      var result = arrayOfPictures[Math.floor(Math.random() * arrayOfPictures.length)];
      if (uniquePictures.indexOf(result) === -1) {
        uniquePictures.push(result);
      }
    }
    picturesContainerElement.appendChild(addPicturesInFragment(uniquePictures));
  };

  var onClickDiscussedButton = function () {
    picturesDelete();
    var discussedPictures = arrayOfPictures
      .slice()
      .sort(function (fisrtElement, secondElement) {
        var first = fisrtElement.comments.length;
        var second = secondElement.comments.length;
        if (first > second) {
          return -1;
        } else if (first < second) {
          return 1;
        } else {
          return 0;
        }
      });
    picturesContainerElement.appendChild(addPicturesInFragment(discussedPictures));
  };

  var arrayOfPictures = [];
  var picturesContainerElement = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');

  var pupularButton = imgFilters.querySelector('#filter-popular');
  pupularButton.addEventListener('click', onClickPopularButton);

  var newButton = imgFilters.querySelector('#filter-new');
  newButton.addEventListener('click', onClickNewButton);

  var discussedButton = imgFilters.querySelector('#filter-discussed');
  discussedButton.addEventListener('click', onClickDiscussedButton);

  var pictureTemplate = document.querySelector('#picture').content;
  var bigPictureTemplate = document.querySelector('.big-picture-template').content;

  window.backend.load(successHandler, errorHandler);
})();
