'use strict';

(function () {
  var addCommentsInBigPicture = function (pictureComments, commentTemplate) {
    var commentsCount = pictureComments.length;
    var comentsContainerElement = document.querySelector('.social__comments');
    var quantityDifference = commentsCount - comentsContainerElement.childElementCount;
    var drawCount = quantityDifference > 5 ? 5 : quantityDifference;

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < drawCount; i++) {
      var commentElement = commentTemplate.cloneNode(true);
      commentElement.querySelector('.social__picture').src = pictureComments[i].avatar;
      commentElement.querySelector('.social__text').textContent = pictureComments[i].message;
      fragment.appendChild(commentElement);
    }
    comentsContainerElement.appendChild(fragment);

    if ((commentsCount === comentsContainerElement.childElementCount)) {
      document.querySelector('.comments-loader').remove();
    }
  };

  var addBigPicture = function (bigPictureElement, picture) {
    bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
    bigPictureElement.querySelector('.social__caption').textContent = picture.description;
    bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
    bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
  };

  window.preview = function (picture) {
    var closeBigPicture = function () {
      bigPictureElement.remove();
      document.removeEventListener('keydown', onBigPictureEscPress);
      document.body.classList.remove('modal-open');
    };

    var onBigPictureEscPress = function (evt) {
      if (evt.keyCode === 27) {
        closeBigPicture();
      }
    };

    var onClickCommentsLoaderButton = function () {
      addCommentsInBigPicture(picture.comments, commentTemplate);
    };

    var bigPictureTemplate = document.querySelector('.big-picture-template').content;
    var bigPictureElement = bigPictureTemplate.cloneNode(true).querySelector('.big-picture');
    document.querySelector('main').appendChild(bigPictureElement);
    document.body.classList.add('modal-open');

    var commentTemplate = document.querySelector('#comment').content;

    var commentsLoaderButton = bigPictureElement.querySelector('.comments-loader');
    commentsLoaderButton.addEventListener('click', onClickCommentsLoaderButton);

    addBigPicture(bigPictureElement, picture);
    addCommentsInBigPicture(picture.comments, commentTemplate);

    var bigPictureCancelElement = bigPictureElement.querySelector('.big-picture__cancel');
    bigPictureCancelElement.addEventListener('click', closeBigPicture);
    document.addEventListener('keydown', onBigPictureEscPress);

    // document.querySelector('.social__comment-count').classList.add('visually-hidden');
  };
})();
