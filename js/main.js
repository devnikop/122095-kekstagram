'use strict';

var COUNT_OF_PICTURES = 25;

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var FIRST_NAMES = [
  'Иван',
  'Хуан',
  'Хуанита',
  'Мария',
  'Кристоф',
  'Кристовина',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон'
];

var chooseRandomFromTheRange = function (value1, value2) {
  return Math.floor(Math.random() * (value2 - value1 + 1) + value1);
};

var chooseRandomArrayValue = function (value1) {
  return value1[Math.floor(Math.random() * value1.length)];
};

var createComment = function () {
  var message;
  if (chooseRandomFromTheRange(1, 2) === 1) {
    message = chooseRandomArrayValue(COMMENTS);
  } else {
    message = chooseRandomArrayValue(COMMENTS) + ' ' + chooseRandomArrayValue(COMMENTS);
  }

  var commentObject = {
    avatar: 'img/avatar-' + chooseRandomFromTheRange(1, 6) + '.svg',
    message: message,
    name: chooseRandomArrayValue(FIRST_NAMES)
  };
  return commentObject;
};

var generateArrayOfPictures = function () {
  var arrayOfPictures = [];

  for (var i = 0; i < COUNT_OF_PICTURES; i++) {
    var countOfComments = chooseRandomFromTheRange(2, 5);
    var comments = [];

    for (var j = 0; j < countOfComments; j++) {
      comments[j] = createComment();
    }

    var pictureObject = {
      url: 'photos/' + [i + 1] + '.jpg',
      description: 'Описание фотографии',
      countOfLikes: chooseRandomFromTheRange(15, 200),
      countOfComments: comments.length,
      comments: comments
    };
    arrayOfPictures[i] = pictureObject;
  }
  return arrayOfPictures;
};

var generateNodeOfPicture = function (pictureElement, picture, bigPictureTemplate) {
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.countOfLikes;
  pictureElement.querySelector('.picture__comments').textContent = picture.countOfComments;

  pictureElement.querySelector('.picture').addEventListener('click', function (evt) {
    evt.preventDefault();
    var bigPictureElement = bigPictureTemplate.cloneNode(true).querySelector('.big-picture');
    openBigPicture(bigPictureElement);
    addBigPicture(bigPictureElement, picture);
  });
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

var addCommentsInBigPicture = function (pictureComments) {
  var fragment = document.createDocumentFragment();
  var commentTemplate = document.querySelector('#comment').content;

  for (var i = 0; i < pictureComments.length; i++) {
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector('.social__picture').src = pictureComments[i].avatar;
    commentElement.querySelector('.social__text').textContent = pictureComments[i].message;
    fragment.appendChild(commentElement);
  }
  return fragment;
};

var addBigPicture = function (bigPictureElement, picture) {
  bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
  bigPictureElement.querySelector('.social__caption').textContent = picture.description;
  bigPictureElement.querySelector('.likes-count').textContent = picture.countOfLikes;
  bigPictureElement.querySelector('.comments-count').textContent = picture.countOfComments;

  var comentsContainer = bigPictureElement.querySelector('.social__comments');
  while (comentsContainer.firstChild) {
    comentsContainer.firstChild.remove();
  }
  comentsContainer.appendChild(addCommentsInBigPicture(picture.comments));
};

var openBigPicture = function (bigPictureElement) {
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

  document.querySelector('main').appendChild(bigPictureElement);
  document.body.classList.add('modal-open');

  var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');
  bigPictureCancel.addEventListener('click', closeBigPicture);
  document.addEventListener('keydown', onBigPictureEscPress);

  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.comments-loader').classList.add('visually-hidden');
};

var openUploadImg = function () {
  var imgUploadOverlayTemplate = document.querySelector('.img-upload__overlay-template').content.cloneNode(true);
  var imgUploadForm = containerForPicturesElement.querySelector('.img-upload__form');
  imgUploadForm.appendChild(imgUploadOverlayTemplate);
  var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');

  var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview > img');
  var effectLevelPin = imgUploadOverlay.querySelector('.effect-level__pin');
  var effectLevelDepth = imgUploadOverlay.querySelector('.effect-level__depth');
  var effectLevelLineWidth = imgUploadOverlay.querySelector('.effect-level__line').offsetWidth;

  var effectsRadio = imgUploadOverlay.querySelectorAll('.effects__radio');
  for (var j = 0; j < effectsRadio.length; j++) {
    onChangeEffect(effectsRadio[j], imgUploadOverlay, imgUploadPreview, effectLevelPin, effectLevelDepth);
  }

  effectLevelPin.addEventListener('mouseup', function () {
    var pinCoord = Math.round(effectLevelPin.offsetLeft / (effectLevelLineWidth / 100));

    if (imgUploadPreview.classList.contains('effects__preview--chrome')) {
      imgUploadPreview.style.filter = 'grayscale(' + pinCoord / 100 + ')';
    } else if (imgUploadPreview.classList.contains('effects__preview--sepia')) {
      imgUploadPreview.style.filter = 'sepia(' + pinCoord / 100 + ')';
    } else if (imgUploadPreview.classList.contains('effects__preview--marvin')) {
      imgUploadPreview.style.filter = 'invert(' + pinCoord + '%)';
    } else if (imgUploadPreview.classList.contains('effects__preview--phobos')) {
      var pinCoordBlur = Math.round(effectLevelPin.offsetLeft / (effectLevelLineWidth / 300));
      imgUploadPreview.style.filter = 'blur(' + pinCoordBlur / 100 + 'px)';
    } else if (imgUploadPreview.classList.contains('effects__preview--heat')) {
      var pinCoordBrightness = Math.round(effectLevelPin.offsetLeft / (effectLevelLineWidth / 200));
      imgUploadPreview.style.filter = 'brightness(' + ((pinCoordBrightness / 100) + 1) + ')';
    }
  });

  var closeUploadImg = function () {
    imgUploadOverlay.remove();
    uploadFile.value = '';
    document.removeEventListener('keydown', onUploadImgEscPress);
  };

  var onUploadImgEscPress = function (evt) {
    if (evt.keyCode === 27) {
      closeUploadImg();
    }
  };

  var imgUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
  imgUploadCancel.addEventListener('click', closeUploadImg);
  document.addEventListener('keydown', onUploadImgEscPress);
};

var moveSlider = function (effectLevelPin, effectLevelDepth, pinCoord, depthCoord) {
  effectLevelPin.style.left = pinCoord + '%';
  effectLevelDepth.style.width = depthCoord + '%';
};

var onChangeEffect = function (effectsRadio, imgUploadOverlay, imgUploadPreview, effectLevelPin, effectLevelDepth) {
  var effectsPreview = effectsRadio.parentElement.querySelector('.effects__preview');
  effectsRadio.addEventListener('change', function () {
    imgUploadPreview.className = '';
    imgUploadPreview.style.filter = '';
    imgUploadPreview.classList.add(effectsPreview.classList[1]);
    moveSlider(effectLevelPin, effectLevelDepth, 100, 100);

    var effectLevel = imgUploadOverlay.querySelector('.effect-level');
    if (imgUploadPreview.classList.contains('effects__preview--none')) {
      effectLevel.classList.add('hidden');
    } else {
      effectLevel.classList.remove('hidden');
    }
  });
};


var arrayOfPictures = generateArrayOfPictures();
var containerForPicturesElement = document.querySelector('.pictures');
containerForPicturesElement.appendChild(addPicturesInFragment(arrayOfPictures));

var uploadFile = containerForPicturesElement.querySelector('#upload-file');
uploadFile.addEventListener('change', openUploadImg);
