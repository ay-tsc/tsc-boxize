/*
 * Dynamic Content Box
 * By Abdullah Yousuf <dabdullahy@gmail.com>
 * Created July 15th, 2015
 * The Scholar's Choice, LLC
**/
(function($) {
    /**
     *  Default Settings for Boxize
     */
    var settings = {
        height: "200px",
        width: "",
        editableExtender: '<div><br></div>',
        previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <img data-dz-thumbnail />\n <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div><div>br</div>"
    };

    var ImgType = function (w, h) {
        if ( isNaN(w) === false && isNaN(h) === false ) {
            var _w = parseFloat(w), _h = parseFloat(h);
            if ( _w > _h ) return 'landscape';
            else if ( _w < _h ) return 'portrait';
            else return 'square';
        }
        return false;
    };

    /**
     *  Get Image Default Dimensions
     */
    var ImageDims = function(w, h, parent) {
        var t = ImgType(w, h), pW = 1, pH = 1;

        if ( typeof parent !== 'undefined' ) {
            pW = parent.width();
            pH = parent.height();
        }

        if ( isNaN(w) === false && isNaN(h) === false && t !== false ) {
            var _w = parseFloat(w), _h = parseFloat(h);

            if ( t === 'landscape' ) {
                if ( _w >= pW ) _w = pW / 0.3;
                if ( _h >= pH ) _h = _h / 1.62;
                _w = _h * 1.62 > _w ? (_w / 1.62) : (_h * 1.62);
            } else if ( t === 'portrait' ) {
                _w = _w >= pW ? (pW / 1.62) : (_w / 1.62);
                _h = (_h / 1.62) > _h ? _h : (_h / 1.62);
            } else {
                _w = _w / 1.62;
                _h = _h / 1.62;
            }
        }
        return {width: _w, height: _h};
    };

    var placeCaretAtEnd = function (el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    };

    $.fn.boxizeUpload = function(options) {
        var dzoneOpts = {
            clickable: false,
            previewTemplate: settings.previewTemplate,
            uploadMultiple: false,
            acceptedFiles : 'image/*'
        },
        opts = $.extend(dzoneOpts, options),
        xy = {
            x: 0,
            y: 0
        };
        return this.each(function(i) {

            var rId = 'boxzide-drop-' + ((new Date()).getTime() + i);
            $(this).addClass('boxize-dropzone').attr('id', rId);

            var el = this,
                $me = $(el),
                dzone = new Dropzone('#' + rId, opts);

            dzone.on('thumbnail', function(file, data) {
                var _thumb, _i, _len, _ref;

                if ( file.previewElement ) {

                    file.previewElement.classList.remove("dz-file-preview");
                    _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                    
                    return setTimeout(((function(_this) {
                        return function() {

                            var dims = ImageDims(file.width, file.height, $me);
                            file.previewElement.style.width = dims.width + 'px';
                            file.previewElement.style.height = dims.height + 'px';
                            
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                _thumb = _ref[_i];
                                _thumb.alt = file.name;
                                _thumb.src = file.xhr.response;
                                _thumb.onload = function () {
                                    this.classList.add('dz-img-responsive');
                                    setTimeout(function () {
                                        $(file.previewElement).find("[data-dz-thumbnail]").nextAll().remove();
                                    }, 20);
                                };
                            }

                            return file.previewElement.classList.add("dz-image-preview");
                        };
                    })(this)), 10);
                }
            }).on('queuecomplete', function () {
                placeCaretAtEnd(el);
                var ev = $.Event('keyup');
                ev.which = 13;
                $me.trigger(ev);
            });

        });
    };
} (jQuery));