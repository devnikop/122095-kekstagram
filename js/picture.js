'use strict';

var generateNodeOfPicture = function (pictureElement, picture, bigPictureTemplate) {
  var onBigPictureClick = function (evt) {
    evt.preventDefault();
    window.preview(bigPictureTemplate, picture);
  };

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.countOfLikes;
  pictureElement.querySelector('.picture__comments').textContent = picture.countOfComments;

  pictureElement.querySelector('.picture').addEventListener('click', onBigPictureClick);
  return pictureElement;
};

var addPicturesInFragment = function (pictures) {
  var fragment = document.createDocumentFragment();
  var pictureTemplate = document.querySelector('#picture').content;
  var bigPictureTemplate = document.querySelector('.big-picture-template').content;

  for (var i = 0; i < pictures.length; i++) {
    var pictureElement = pictureTemplate.cloneNode(true);
    fragment.appendChild(generateNodeOfPicture(pictureElement, pictures[i], bigPictureTemplate));
  }
  return fragment;
};


var arrayOfPictures = window.data();
var containerForPicturesElement = document.querySelector('.pictures');
containerForPicturesElement.appendChild(addPicturesInFragment(arrayOfPictures));
