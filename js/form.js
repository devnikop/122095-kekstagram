'use strict';

(function () {
  var openUploadImg = function () {
    var moveSlider = function (pinCoord) {
      effectLevelPinElement.style.left = pinCoord + '%';
      var effectLevelDepth = imgUploadOverlayElement.querySelector('.effect-level__depth');
      effectLevelDepth.style.width = pinCoord + '%';

      var effectLevelValue = imgUploadOverlayElement.querySelector('.effect-level__value');
      effectLevelValue.value = Math.round(pinCoord);
    };

    var onChangeEffect = function (effectsRadioElement) {
      var effectsPreviewElement = effectsRadioElement.parentElement.querySelector('.effects__preview');
      effectsRadioElement.addEventListener('change', function () {
        imgUploadPreviewElement.className = '';
        imgUploadPreviewElement.style.filter = '';
        imgUploadPreviewElement.classList.add(effectsPreviewElement.classList[1]);
        moveSlider(100);

        var effectLevelElement = imgUploadOverlayElement.querySelector('.effect-level');
        if (imgUploadPreviewElement.classList.contains('effects__preview--none')) {
          effectLevelElement.classList.add('hidden');
        } else {
          effectLevelElement.classList.remove('hidden');
        }
      });
    };

    var mousedownEffectLevelPin = function (evt) {
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

      var mousemoveEffectLevelPin = function (moveEvt) {
        moveEvt.preventDefault();

        if (effectLevelLineCoords.right < startCoordX) {
          moveSlider(100);
        } else if (effectLevelLineCoords.left > startCoordX) {
          moveSlider(0);
        } else {
          var shiftX = startCoordX - moveEvt.clientX;
          startCoordX = moveEvt.clientX;
          moveSlider((effectLevelPinElement.offsetLeft - shiftX) * 100 / effectLevelLineWidth);
          changeEffectLevel();
        }
      };

      var mouseupEffectLevelPin = function () {
        changeEffectLevel();
        document.removeEventListener('mousemove', mousemoveEffectLevelPin);
        document.removeEventListener('mouseup', mouseupEffectLevelPin);
      };

      var startCoordX = evt.clientX;
      document.addEventListener('mousemove', mousemoveEffectLevelPin);
      document.addEventListener('mouseup', mouseupEffectLevelPin);
    };

    var closeUploadImg = function () {
      imgUploadOverlayElement.remove();
      uploadFileElement.value = '';
      document.removeEventListener('keydown', onUploadImgEscPress);
    };

    var onUploadImgEscPress = function (evt) {
      if (evt.keyCode === 27 && (document.activeElement !== textHashtagsElement) && (document.activeElement !== textDescriptionElement)) {
        closeUploadImg();
      }
    };

    var updateUploadImageScale = function () {
      scaleControlValueElement.value = scaleControlValue + '%';
      imgUploadPreviewElement.style.transform = ('scale(' + scaleControlValue / 100 + ')');
    };

    var onClickZoomOutElement = function () {
      if (scaleControlValue > 25 && scaleControlValue <= 100) {
        scaleControlValue -= 25;
        updateUploadImageScale();
      }
    };

    var onClickZoomInElement = function () {
      if (scaleControlValue >= 25 && scaleControlValue < 100) {
        scaleControlValue += 25;
        updateUploadImageScale();
      }
    };

    var setInvalid = function (validityMessage) {
      textHashtagsElement.setCustomValidity(validityMessage);
      textHashtagsElement.style.borderColor = 'red';
    };

    var setValid = function () {
      textHashtagsElement.setCustomValidity('');
      textHashtagsElement.style.borderColor = 'initial';
    };

    var hashtagValidate = function () {
      var hashtagsArray = textHashtagsElement.value.trim().toLowerCase().split(' ');
      if (hashtagsArray[0] !== '') {
        if (hashtagsArray.length > 5) {
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
            } else if (hashtagsArray[i].length > 20) {
              setInvalid('Максимальная длина одного хэш-тега 20 символов, включая решётку');
              break;
            } else {
              setValid();
            }
          }
        }
      } else {
        setValid();
      }
    };

    var successHandler = function () {
      var closeSuccessWindow = function () {
        document.querySelector('.success').remove();
        document.removeEventListener('keydown', onSuccessWindowEscPress);
        document.removeEventListener('click', closeSuccessWindow);
      };

      var onSuccessWindowEscPress = function (evt) {
        if (evt.keyCode === 27) {
          closeSuccessWindow();
        }
      };

      closeUploadImg();

      successButton.addEventListener('click', closeSuccessWindow);
      document.addEventListener('keydown', onSuccessWindowEscPress);
      document.addEventListener('click', closeSuccessWindow);

      document.querySelector('main').appendChild(successTemplate);
    };

    var errorHandler = function (errorMessage) {
      var closeErrorWindow = function () {
        document.querySelector('.error').remove();
        document.removeEventListener('keydown', onErrorWindowEscPress);
        document.removeEventListener('click', closeErrorWindow);
      };

      var onErrorWindowEscPress = function (evt) {
        if (evt.keyCode === 27) {
          closeErrorWindow();
        }
      };

      closeUploadImg();

      errorTemplate.querySelector('.error__title').textContent = errorMessage;
      for (var i = 0; i < errorButtons.length; i++) {
        errorButtons[i].addEventListener('click', closeErrorWindow);
      }
      document.addEventListener('keydown', onErrorWindowEscPress);
      document.addEventListener('click', closeErrorWindow);

      document.querySelector('main').appendChild(errorTemplate);
    };

    var imgUploadOverlayTemplate = document.querySelector('.img-upload__overlay-template').content.cloneNode(true);
    var imgUploadFormElement = document.querySelector('.img-upload__form');

    var successTemplate = document.querySelector('#success').content.cloneNode(true);
    var successButton = successTemplate.querySelector('.success__button');
    var errorTemplate = document.querySelector('#error').content.cloneNode(true);
    var errorButtons = errorTemplate.querySelectorAll('.error__button');

    imgUploadFormElement.addEventListener('submit', function (evt) {
      window.backend.save(new FormData(imgUploadFormElement), successHandler, errorHandler);
      evt.preventDefault();
    });

    imgUploadFormElement.appendChild(imgUploadOverlayTemplate);
    var imgUploadOverlayElement = imgUploadFormElement.querySelector('.img-upload__overlay');

    var imgUploadPreviewElement = imgUploadOverlayElement.querySelector('.img-upload__preview > img');
    var effectLevelPinElement = imgUploadOverlayElement.querySelector('.effect-level__pin');
    effectLevelPinElement.addEventListener('mousedown', mousedownEffectLevelPin);

    var effectLevelLineElement = imgUploadOverlayElement.querySelector('.effect-level__line');
    var effectLevelLineCoords = effectLevelLineElement.getBoundingClientRect();
    var effectLevelLineWidth = effectLevelLineElement.offsetWidth;

    var effectsRadioElements = imgUploadOverlayElement.querySelectorAll('.effects__radio');
    for (var j = 0; j < effectsRadioElements.length; j++) {
      onChangeEffect(effectsRadioElements[j]);
    }

    moveSlider(0);

    var imgUploadCancelElement = imgUploadOverlayElement.querySelector('.img-upload__cancel');
    var textHashtagsElement = imgUploadOverlayElement.querySelector('.text__hashtags');
    var textDescriptionElement = imgUploadOverlayElement.querySelector('.text__description');
    imgUploadCancelElement.addEventListener('click', closeUploadImg);
    document.addEventListener('keydown', onUploadImgEscPress);
    textHashtagsElement.addEventListener('input', hashtagValidate);

    var zoomOutElement = imgUploadOverlayElement.querySelector('.scale__control--smaller');
    var zoomInElement = imgUploadOverlayElement.querySelector('.scale__control--bigger');
    var scaleControlValueElement = imgUploadOverlayElement.querySelector('.scale__control--value');
    var scaleControlValue = parseInt(scaleControlValueElement.value, 10);

    zoomOutElement.addEventListener('click', onClickZoomOutElement);
    zoomInElement.addEventListener('click', onClickZoomInElement);
  };

  var uploadFileElement = document.querySelector('#upload-file');
  uploadFileElement.addEventListener('change', openUploadImg);
})();
