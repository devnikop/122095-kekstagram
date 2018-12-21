'use strict';

(function () {
  var openUploadImg = function () {
    var moveSlider = function (pinCoord) {
      effectLevelPin.style.left = pinCoord + '%';
      var effectLevelDepth = imgUploadOverlay.querySelector('.effect-level__depth');
      effectLevelDepth.style.width = pinCoord + '%';

      var effectLevelValue = imgUploadOverlay.querySelector('.effect-level__value');
      effectLevelValue.value = Math.round(pinCoord);
    };

    var onChangeEffect = function (effectsRadio) {
      var effectsPreview = effectsRadio.parentElement.querySelector('.effects__preview');
      effectsRadio.addEventListener('change', function () {
        imgUploadPreview.className = '';
        imgUploadPreview.style.filter = '';
        imgUploadPreview.classList.add(effectsPreview.classList[1]);
        moveSlider(100);

        var effectLevel = imgUploadOverlay.querySelector('.effect-level');
        if (imgUploadPreview.classList.contains('effects__preview--none')) {
          effectLevel.classList.add('hidden');
        } else {
          effectLevel.classList.remove('hidden');
        }
      });
    };

    var mousedownEffectLevelPin = function (evt) {
      evt.preventDefault();

      var changeEffectLevel = function () {
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
          moveSlider((effectLevelPin.offsetLeft - shiftX) * 100 / effectLevelLineWidth);
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
      imgUploadOverlay.remove();
      uploadFile.value = '';
      document.removeEventListener('keydown', onUploadImgEscPress);
    };

    var onUploadImgEscPress = function (evt) {
      if (evt.keyCode === 27 && (document.activeElement !== textHashtagsElement) && (document.activeElement !== textDescriptionElement)) {
        closeUploadImg();
      }
    };

    var updateUploadImageScale = function () {
      scaleControlValueElement.value = scaleControlValue + '%';
      imgUploadPreview.style.transform = ('scale(' + scaleControlValue / 100 + ')');
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

    var imgUploadOverlayTemplate = document.querySelector('.img-upload__overlay-template').content.cloneNode(true);
    var imgUploadForm = document.querySelector('.img-upload__form');
    imgUploadForm.appendChild(imgUploadOverlayTemplate);
    var imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');

    var imgUploadPreview = imgUploadOverlay.querySelector('.img-upload__preview > img');
    var effectLevelPin = imgUploadOverlay.querySelector('.effect-level__pin');
    effectLevelPin.addEventListener('mousedown', mousedownEffectLevelPin);

    var effectLevelLine = imgUploadOverlay.querySelector('.effect-level__line');
    var effectLevelLineCoords = effectLevelLine.getBoundingClientRect();
    var effectLevelLineWidth = effectLevelLine.offsetWidth;

    var effectsRadio = imgUploadOverlay.querySelectorAll('.effects__radio');
    for (var j = 0; j < effectsRadio.length; j++) {
      onChangeEffect(effectsRadio[j]);
    }

    moveSlider(0);

    var imgUploadCancel = imgUploadOverlay.querySelector('.img-upload__cancel');
    var textHashtagsElement = imgUploadOverlay.querySelector('.text__hashtags');
    var textDescriptionElement = imgUploadOverlay.querySelector('.text__description');
    imgUploadCancel.addEventListener('click', closeUploadImg);
    document.addEventListener('keydown', onUploadImgEscPress);
    textHashtagsElement.addEventListener('input', hashtagValidate);

    var zoomOutElement = imgUploadOverlay.querySelector('.scale__control--smaller');
    var zoomInElement = imgUploadOverlay.querySelector('.scale__control--bigger');
    var scaleControlValueElement = imgUploadOverlay.querySelector('.scale__control--value');
    var scaleControlValue = parseInt(scaleControlValueElement.value, 10);

    zoomOutElement.addEventListener('click', onClickZoomOutElement);
    zoomInElement.addEventListener('click', onClickZoomInElement);
  };

  var uploadFile = document.querySelector('#upload-file');
  uploadFile.addEventListener('change', openUploadImg);
})();
