'use strict';

(function () {
  var addCommentsInBigPicture = function (pictureComments, commentTemplate, bigPictureElement) {
    var commentsCount = pictureComments.length;
    var comentsContainerElement = document.querySelector('.social__comments');
    var countOfDrawnComments = comentsContainerElement.childElementCount;
    var quantityDifference = commentsCount - countOfDrawnComments;
    var countToDraw = quantityDifference > 5 ? 5 : quantityDifference;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < countToDraw; i++) {
      var j = countOfDrawnComments + i;
      var commentElement = commentTemplate.cloneNode(true);
      commentElement.querySelector('.social__picture').src = pictureComments[j].avatar;
      commentElement.querySelector('.social__text').textContent = pictureComments[j].message;
      fragment.appendChild(commentElement);
    }
    comentsContainerElement.appendChild(fragment);

    if (commentsCount === comentsContainerElement.childElementCount) {
      document.querySelector('.comments-loader').classList.add('hidden');
    }

    bigPictureElement.querySelector('.comments-shown').textContent = comentsContainerElement.childElementCount;
  };

  var addBigPicture = function (bigPictureElement, picture) {
    bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
    bigPictureElement.querySelector('.social__caption').textContent = picture.description;
    bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
    bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
  };

  window.preview = function (picture) {
    var bigPictureCancelClickHandler = function () {
      bigPictureElement.remove();
      document.removeEventListener('keydown', bigPictureEscPressHandler);
      document.body.classList.remove('modal-open');
    };

    var bigPictureEscPressHandler = function (evt) {
      window.keyboard.isEscPressed(evt, bigPictureCancelClickHandler);
    };

    var commentsLoaderClickHandler = function () {
      addCommentsInBigPicture(picture.comments, commentTemplate, bigPictureElement);
    };

    var bigPictureTemplate = document.querySelector('.big-picture-template').content;
    var bigPictureElement = bigPictureTemplate.cloneNode(true).querySelector('.big-picture');
    document.querySelector('main').appendChild(bigPictureElement);
    document.body.classList.add('modal-open');

    var commentTemplate = document.querySelector('#comment').content;

    var commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
    commentsLoaderElement.addEventListener('click', commentsLoaderClickHandler);

    addBigPicture(bigPictureElement, picture);
    addCommentsInBigPicture(picture.comments, commentTemplate, bigPictureElement);

    var bigPictureCancelElement = bigPictureElement.querySelector('.big-picture__cancel');
    bigPictureCancelElement.addEventListener('click', bigPictureCancelClickHandler);
    document.addEventListener('keydown', bigPictureEscPressHandler);
  };
})();
