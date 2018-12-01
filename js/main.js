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

var createComment = function (arrayOfCommentText, arrayOfFirstNames) {
  var commentObject = {
    avatar: 'img/avatar-' + pickRandomValue(1, 6) + '.svg',
    message: '',
    name: pickRandomValue(arrayOfFirstNames),

    messagesCreate: function () {
      if (pickRandomValue(1, 2) === 1) {
        this.message = pickRandomValue(arrayOfCommentText);
      } else {
        this.message = pickRandomValue(arrayOfCommentText) + ' ' + pickRandomValue(arrayOfCommentText);
      }
    }
  };
  commentObject.messagesCreate();
  return commentObject;
};

var generateArrayOfPictures = function (arrayOfCommentText, arrayOfFirstNames) {
  var arrayOfPictures = [];
  var countOfObjects = 25;
  for (var i = 0; i < countOfObjects; i++) {
    var pictureObject = {
      url: 'photos/' + [i + 1] + '.jpg',
      description: 'Описание фотографии',
      countOfLikes: pickRandomValue(15, 200),
      countOfMessages: pickRandomValue(2, 5),
      comments: [],

      commentsCreate: function () {
        for (var j = 0; j < this.countOfMessages; j++) {
          this.comments[j] = createComment(arrayOfCommentText, arrayOfFirstNames);
        }
      },
    };
    pictureObject.commentsCreate();
    arrayOfPictures[i] = pictureObject;
  }
  return arrayOfPictures;
};

var arrayOfPictures = generateArrayOfPictures(COMMENTS, FIRST_NAMES);


var generateNodeOfPicture = function (template, substitutionalObject) {
  var element = template.cloneNode(true);

  element.querySelector('.picture__img').src = substitutionalObject.url;
  element.querySelector('.picture__likes').textContent = substitutionalObject.countOfLikes;
  element.querySelector('.picture__comments').textContent = substitutionalObject.countOfMessages;
  return element;
};

var addFragment = function (methodForNodeGenerate, substitutionalObjects, template) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < substitutionalObjects.length; i++) {
    fragment.appendChild(methodForNodeGenerate(template, substitutionalObjects[i]));
  }
  return fragment;
};

var drawPictures = function (pictures, ContainerForPictures) {
  ContainerForPictures.appendChild(pictures);
};

var pictureTemplate = document.querySelector('#picture').content;
var ContainerForPictures = document.querySelector('.pictures');

drawPictures(addFragment(generateNodeOfPicture, arrayOfPictures, pictureTemplate), ContainerForPictures);


var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

var generateNodeOfComments = function (template, substitutionalObject) {
  var element = template.cloneNode(true);

  element.querySelector('.social__picture').src = substitutionalObject.avatar;
  element.querySelector('.social__text').textContent = substitutionalObject.message;
  return element;
};

var addBigPicture = function (picture, container) {
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.social__caption').textContent = picture.description;
  bigPicture.querySelector('.likes-count').textContent = picture.countOfLikes;
  bigPicture.querySelector('.comments-count').textContent = picture.countOfMessages;

  container.appendChild(addFragment(generateNodeOfComments, picture.comments, commentTemplate));
};

var commentTemplate = document.querySelector('#comment').content;
var comentsContainer = document.querySelector('.social__comments');

addBigPicture(arrayOfPictures[0], comentsContainer);


document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
