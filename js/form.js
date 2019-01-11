'use strict';

(function () {
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var SCALE_STEP = 25;
  var HASHTAGS_COUNT = 5;
  var HASHTAG_LENGTH = 20;
  var SLIDER_MAX = 100;
  var SLIDER_MIN = 0;

  var uploadFileChangeHandler = function () {
    var moveSlider = function (pinCoord) {
      effectLevelPinElement.style.left = pinCoord + '%';
      var effectLevelDepthElement = imgUploadOverlayElement.querySelector('.effect-level__depth');
      effectLevelDepthElement.style.width = pinCoord + '%';

      var effectLevelValueElement = imgUploadOverlayElement.querySelector('.effect-level__value');
      effectLevelValueElement.value = Math.round(pinCoord);
    };

    var onChangeEffect = function (effectsRadioElement) {
      var effectsRadioChangeHandler = function () {
        imgUploadPreviewElement.className = '';
        imgUploadPreviewElement.style.filter = '';
        imgUploadPreviewElement.classList.add(effectsPreviewElement.classList[1]);
        moveSlider(SLIDER_MAX);

        var effectLevelElement = imgUploadOverlayElement.querySelector('.effect-level');
        if (imgUploadPreviewElement.classList.contains('effects__preview--none')) {
          effectLevelElement.classList.add('hidden');
        } else {
          effectLevelElement.classList.remove('hidden');
        }
      };

      var effectsPreviewElement = effectsRadioElement.parentElement.querySelector('.effects__preview');
      effectsRadioElement.addEventListener('change', effectsRadioChangeHandler);
    };

    var EffectLevelPinMousedownHandler = function (evt) {
      evt.preventDefault();

      var changeEffectLevel = function () {
        var pinCoord = Math.round(effectLevelPinElement.offsetLeft / (effectLevelLineWidth / 100));

        if (imgUploadPreviewElement.classList.contains('effects__preview--chrome')) {
          imgUploadPreviewElement.style.filter = 'grayscale(' + pinCoord / 100 + ')';
        } else if (imgUploadPreviewElement.classList.contains('effects__preview--sepia')) {
          imgUploadPreviewElement.style.filter = 'sepia(' + pinCoord / 100 + ')';
        } else if (imgUploadPreviewElement.classList.contains('effects__preview--marvin')) {
          imgUploadPreviewElement.style.filter = 'invert(' + pinCoord + '%)';
        } else if (imgUploadPreviewElement.classList.contains('effects__preview--phobos')) {
          var pinCoordBlur = Math.round(effectLevelPinElement.offsetLeft / (effectLevelLineWidth / 300));
          imgUploadPreviewElement.style.filter = 'blur(' + pinCoordBlur / 100 + 'px)';
        } else if (imgUploadPreviewElement.classList.contains('effects__preview--heat')) {
          var pinCoordBrightness = Math.round(effectLevelPinElement.offsetLeft / (effectLevelLineWidth / 200));
          imgUploadPreviewElement.style.filter = 'brightness(' + ((pinCoordBrightness / 100) + 1) + ')';
        }
      };

      var EffectLevelPinMousemoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        if (effectLevelLineCoords.right < startCoordX) {
          moveSlider(SLIDER_MAX);
        } else if (effectLevelLineCoords.left > startCoordX) {
          moveSlider(SLIDER_MIN);
        } else {
          var shiftX = startCoordX - moveEvt.clientX;
          startCoordX = moveEvt.clientX;
          moveSlider((effectLevelPinElement.offsetLeft - shiftX) * 100 / effectLevelLineWidth);
          changeEffectLevel();
        }
      };

      var EffectLevelPinMouseupHandler = function () {
        changeEffectLevel();
        document.removeEventListener('mousemove', EffectLevelPinMousemoveHandler);
        document.removeEventListener('mouseup', EffectLevelPinMouseupHandler);
      };

      var startCoordX = evt.clientX;
      document.addEventListener('mousemove', EffectLevelPinMousemoveHandler);
      document.addEventListener('mouseup', EffectLevelPinMouseupHandler);
    };

    var uploadImgClose = function () {
      imgUploadOverlayElement.remove();
      uploadFileElement.value = '';
      document.removeEventListener('keydown', uploadImgEscPressHandler);
    };

    var imgUploadCancelClickHandler = function () {
      uploadImgClose();
    };

    var uploadImgEscPressHandler = function (evt) {
      window.keyboard.isEscPressed(evt, uploadImgClose);
    };

    var updateUploadImageScale = function () {
      scaleControlValueElement.value = scaleControlValue + '%';
      imgUploadPreviewElement.style.transform = ('scale(' + scaleControlValue / 100 + ')');
    };

    var zoomOutClickHandler = function () {
      if (scaleControlValue > SCALE_MIN && scaleControlValue <= SCALE_MAX) {
        scaleControlValue -= SCALE_STEP;
        updateUploadImageScale();
      }
    };

    var zoomInClickHandler = function () {
      if (scaleControlValue >= SCALE_MIN && scaleControlValue < SCALE_MAX) {
        scaleControlValue += SCALE_STEP;
        updateUploadImageScale();
      }
    };

    var setInvalid = function (validityMessage) {
      textHashtagElement.setCustomValidity(validityMessage);
      textHashtagElement.style.borderColor = 'red';
    };

    var setValid = function () {
      textHashtagElement.setCustomValidity('');
      textHashtagElement.style.borderColor = 'initial';
    };

    var hashtagInputHandler = function () {
      var hashtagsArray = textHashtagElement.value.trim().toLowerCase().split(' ');

      if (hashtagsArray[0] === '') {
        setValid();
      } else if (hashtagsArray.length > HASHTAGS_COUNT) {
        setInvalid('Нельзя указать больше пяти хэш-тегов');
      } else {
        for (var i = 0; i < hashtagsArray.length; i++) {
          if (hashtagsArray[i].charAt(0) !== '#') {
            setInvalid('Хэш-тег должен начинаться с символа #');
            break;
          } else if (hashtagsArray[i].charAt(1) === '') {
            setInvalid('Хэш-тег не может состоять только из одной решётки');
            break;
          } else if (hashtagsArray.indexOf(hashtagsArray[i], i + 1) !== -1) {
            setInvalid('Один и тот же хэш-тег не может быть использован дважды');
            break;
          } else if (hashtagsArray[i].indexOf('#', 1) !== -1) {
            setInvalid('Хэш-тег не должен содержать более одного символа #');
            break;
          } else if (hashtagsArray[i].length > HASHTAG_LENGTH) {
            setInvalid('Максимальная длина одного хэш-тега 20 символов, включая решётку');
            break;
          } else {
            setValid();
          }
        }
      }
    };

    var successHandler = function () {
      var successWindowClose = function () {
        document.querySelector('.success').remove();
        document.removeEventListener('keydown', successWindowEscPressHandler);
        document.removeEventListener('click', successWindowClose);
      };

      var successButtonClickHandler = function () {
        successWindowClose();
      };

      var successWindowEscPressHandler = function (evt) {
        window.keyboard.isEscPressed(evt, successWindowClose);
      };

      uploadImgClose();

      successButtonElement.addEventListener('click', successButtonClickHandler);
      document.addEventListener('keydown', successWindowEscPressHandler);
      document.addEventListener('click', successWindowClose);

      document.querySelector('main').appendChild(successTemplate);
    };

    var errorHandler = function (errorMessage) {
      var errorWindowClose = function () {
        document.querySelector('.error').remove();
        document.removeEventListener('keydown', errorWindowEscPressHandler);
        document.removeEventListener('click', errorWindowClose);
      };

      var errorWindowEscPressHandler = function (evt) {
        window.keyboard.isEscPressed(evt, errorWindowClose);
      };

      uploadImgClose();

      var errorElement = errorTemplate.cloneNode(true);
      errorElement.querySelector('.error__title').textContent = errorMessage;

      errorButtonElements.forEach(function (errorButton) {
        errorButton.addEventListener('click', errorWindowClose);
      });
      document.addEventListener('keydown', errorWindowEscPressHandler);
      document.addEventListener('click', errorWindowClose);

      document.querySelector('main').appendChild(errorElement);
    };

    var textHashtagEscPressHandler = function (evt) {
      window.keyboard.isEscPressed(evt, evt.stopPropagation.bind(evt));
    };

    var textDescriptionEscPressHandler = function (evt) {
      window.keyboard.isEscPressed(evt, evt.stopPropagation.bind(evt));
    };

    var imgUploadOverlayTemplate = document.querySelector('.img-upload__overlay-template').content.cloneNode(true);
    var imgUploadFormElement = document.querySelector('.img-upload__form');

    var successTemplate = document.querySelector('#success').content.cloneNode(true);
    var successButtonElement = successTemplate.querySelector('.success__button');
    var errorTemplate = document.querySelector('#error').content;
    var errorButtonElements = errorTemplate.querySelectorAll('.error__button');

    imgUploadFormElement.addEventListener('submit', function (evt) {
      window.backend.save(new FormData(imgUploadFormElement), successHandler, errorHandler);
      evt.preventDefault();
    });

    imgUploadFormElement.appendChild(imgUploadOverlayTemplate);
    var imgUploadOverlayElement = imgUploadFormElement.querySelector('.img-upload__overlay');

    var imgUploadPreviewElement = imgUploadOverlayElement.querySelector('.img-upload__preview > img');
    var effectLevelPinElement = imgUploadOverlayElement.querySelector('.effect-level__pin');
    effectLevelPinElement.addEventListener('mousedown', EffectLevelPinMousedownHandler);

    var effectLevelLineElement = imgUploadOverlayElement.querySelector('.effect-level__line');
    var effectLevelLineCoords = effectLevelLineElement.getBoundingClientRect();
    var effectLevelLineWidth = effectLevelLineElement.offsetWidth;

    var effectsRadioElements = imgUploadOverlayElement.querySelectorAll('.effects__radio');
    effectsRadioElements.forEach(function (element) {
      onChangeEffect(element);
    });

    moveSlider(SLIDER_MIN);

    var imgUploadCancelElement = imgUploadOverlayElement.querySelector('.img-upload__cancel');
    var textHashtagElement = imgUploadOverlayElement.querySelector('.text__hashtags');
    var textDescriptionElement = imgUploadOverlayElement.querySelector('.text__description');
    imgUploadCancelElement.addEventListener('click', imgUploadCancelClickHandler);
    document.addEventListener('keydown', uploadImgEscPressHandler);
    textHashtagElement.addEventListener('input', hashtagInputHandler);
    textHashtagElement.addEventListener('keydown', textHashtagEscPressHandler);
    textDescriptionElement.addEventListener('keydown', textDescriptionEscPressHandler);

    var zoomOutElement = imgUploadOverlayElement.querySelector('.scale__control--smaller');
    var zoomInElement = imgUploadOverlayElement.querySelector('.scale__control--bigger');
    var scaleControlValueElement = imgUploadOverlayElement.querySelector('.scale__control--value');
    var scaleControlValue = parseInt(scaleControlValueElement.value, 10);

    zoomOutElement.addEventListener('click', zoomOutClickHandler);
    zoomInElement.addEventListener('click', zoomInClickHandler);
  };

  var uploadFileElement = document.querySelector('#upload-file');
  uploadFileElement.addEventListener('change', uploadFileChangeHandler);
})();
