'use strict';

(function () {
  var generateNodeOfPicture = function (pictureElement, picture) {
    var pictureClickHandler = function (evt) {
      evt.preventDefault();
      window.preview(picture);
    };

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    pictureElement.querySelector('.picture').addEventListener('click', pictureClickHandler);
    return pictureElement;
  };

  var addPicturesInFragment = function (picturesArray) {
    var fragment = document.createDocumentFragment();

    picturesArray.forEach(function (picture) {
      var pictureElement = pictureTemplate.cloneNode(true);
      fragment.appendChild(generateNodeOfPicture(pictureElement, picture));
    });
    return fragment;
  };

  var successHandler = function (pictures) {
    picturesArray = pictures;
    picturesContainerElement.appendChild(addPicturesInFragment(picturesArray));
    imgFilterElement.classList.remove('img-filters--inactive');
  };

  var errorHandler = function () {

  };

  var picturesDelete = function () {
    var pictureElements = picturesContainerElement.querySelectorAll('.picture');
    [].forEach.call(pictureElements, function (picture) {
      picture.remove();
    });
  };

  var picturesArray = [];
  var picturesContainerElement = document.querySelector('.pictures');
  var imgFilterElement = document.querySelector('.img-filters');

  var filterButton = {
    popular: imgFilterElement.querySelector('#filter-popular'),
    new: imgFilterElement.querySelector('#filter-new'),
    discussed: imgFilterElement.querySelector('#filter-discussed'),

    changeClass: function (currentButton) {
      var filterButtons = imgFilterElement.querySelectorAll('.img-filters__button');
      [].forEach.call(filterButtons, function (button) {
        button.classList.remove('img-filters__button--active');
      });
      currentButton.classList.add('img-filters__button--active');
    },

    popularClickHandler: function () {
      picturesDelete();
      picturesContainerElement.appendChild(addPicturesInFragment(picturesArray));
      this.changeClass(this.popular);
    },

    newClickHandler: function () {
      picturesDelete();
      var uniquePictures = [];
      while (uniquePictures.length < 10) {
        var result = picturesArray[Math.floor(Math.random() * picturesArray.length)];
        if (uniquePictures.indexOf(result) === -1) {
          uniquePictures.push(result);
        }
      }
      picturesContainerElement.appendChild(addPicturesInFragment(uniquePictures));
      this.changeClass(this.new);
    },

    discussedClickHandler: function () {
      picturesDelete();
      var discussedPictures = picturesArray
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
      this.changeClass(this.discussed);
    }
  };

  filterButton.popular.addEventListener('click', window.debounce(function () {
    filterButton.popularClickHandler();
  }));
  filterButton.new.addEventListener('click', window.debounce(function () {
    filterButton.newClickHandler();
  }));
  filterButton.discussed.addEventListener('click', window.debounce(function () {
    filterButton.discussedClickHandler();
  }));

  var pictureTemplate = document.querySelector('#picture').content;
  window.backend.load(successHandler, errorHandler);
})();
