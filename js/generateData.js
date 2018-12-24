'use strict';

(function () {

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

  window.generateData = function () {
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
})();
