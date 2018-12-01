'use strict';

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

var pickRandomValue = function (value1, value2) {
  var result;
  if (Array.isArray(arguments[0])) {
    result = value1[Math.floor(Math.random() * value1.length)];
  } else if (arguments[1]) {
    result = Math.floor(Math.random() * (value2 - value1 + 1) + value1);
  }

  return result;
};

var createComment = function (arrayOfComments, arrayOfFirstNames) {
  var commentObject = {
    avatar: 'img/avatar-' + pickRandomValue(1, 6) + '.svg',
    message: '',
    name: pickRandomValue(arrayOfFirstNames),

    messagesCreate: function () {
      if (pickRandomValue(1, 2) === 1) {
        this.message = pickRandomValue(arrayOfComments);
      } else {
        this.message = pickRandomValue(arrayOfComments) + ' ' + pickRandomValue(arrayOfComments);
      }
    }
  };
  commentObject.messagesCreate();
  return commentObject;
};

var generatePictureArray = function (arrayOfComments, arrayOfFirstNames) {
  var arrayOfPictures = [];
  var countOfObjects = 25;
  for (var i = 0; i < countOfObjects; i++) {
    var pictureObject = {
      url: 'photos/' + [i + 1] + '.jpg',
      countOfLikes: pickRandomValue(15, 200),
      countOfMessages: pickRandomValue(1, 3),
      comments: [],

      commentsCreate: function () {
        for (var j = 0; j < this.countOfMessages; j++) {
          this.comments[j] = createComment(arrayOfComments, arrayOfFirstNames);
        }
      },
    };
    pictureObject.commentsCreate();
    arrayOfPictures[i] = pictureObject;
  }
  return arrayOfPictures;
};

var arrayOfPictures = generatePictureArray(COMMENTS, FIRST_NAMES);

//  Finished first task  //

var generateElement = function (template, substitutionalObject) {
  var element = template.cloneNode(true);

  element.querySelector('.picture__img').src = substitutionalObject.url;
  element.querySelector('.picture__likes').textContent = substitutionalObject.countOfLikes;
  element.querySelector('.picture__comments').textContent = substitutionalObject.countOfMessages;
  return element;
};

var addPicturesInFragment = function (objects, template) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < objects.length; i++) {
    fragment.appendChild(generateElement(template, objects[i]));
  }
  return fragment;
};

var drawPictures = function (pictures, picturesContainer) {
  picturesContainer.appendChild(pictures);
};

var pictureTemplate = document.querySelector('#picture').content;
var picturesContainer = document.querySelector('.pictures');

drawPictures(addPicturesInFragment(arrayOfPictures, pictureTemplate), picturesContainer);

//  Finished second & third tasks  //

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

var generateComment = function (template, substitutionalObject) {
  var commentElement = template.cloneNode(true);

  commentElement.querySelector('.social__picture').src = substitutionalObject.avatar;
  commentElement.querySelector('.social__text').textContent = substitutionalObject.message;
  return commentElement;
};

var addInFragmentComment = function (template, picture) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < picture.comments.length; i++) {
    fragment.appendChild(generateComment(template, picture.comments[i]));
  }
  return fragment;
};

var addBigPicture = function (picture, container) {
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.countOfLikes;
  bigPicture.querySelector('.comments-count').textContent = picture.countOfMessages;

  container.appendChild(addInFragmentComment(commentTemplate, picture));
};

var commentTemplate = document.querySelector('#comment').content;
var comentsContainer = document.querySelector('.social__comments');

addBigPicture(arrayOfPictures[0], comentsContainer);

//  Finished fourth task  //

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
