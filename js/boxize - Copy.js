/*
 * Dynamic Content Box
 * By Abdullah Yousuf <dabdullahy@gmail.com>
 * Created July 15th, 2015
 * The Scholar's Choice, LLC
**/
(function($) {

    var settings = {
        height: "200px",
        width: ""
    };


    $.fn.getCaretPosition = function(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    };


    $.fn.setCaretTo = function(el, start, end) {
        function getTextNodesIn(node) {
            var textNodes = [];
            if (node.nodeType == 3) {
                textNodes.push(node);
            } else {
                var children = node.childNodes;
                for (var i = 0, len = children.length; i < len; ++i) {
                    textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
                }
            }
            return textNodes;
        }

        function setSelectionRange(el, start, end) {
            if ( end == undefined ) end = start;

            if (document.createRange && window.getSelection) {
                var range = document.createRange();
                range.selectNodeContents(el);
                var textNodes = getTextNodesIn(el);
                var foundStart = false;
                var charCount = 0,
                endCharCount;
                for (var i = 0, textNode; textNode = textNodes[i++];) {
                    endCharCount = charCount + textNode.length;
                    if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i <= textNodes.length))) {
                        range.setStart(textNode, start - charCount);
                        foundStart = true;
                    }
                    if (foundStart && end <= endCharCount) {
                        range.setEnd(textNode, end - charCount);
                        break;
                    }
                    charCount = endCharCount;
                }
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && document.body.createTextRange) {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(true);
                textRange.moveEnd("character", end);
                textRange.moveStart("character", start);
                textRange.select();
            }
        }
        setSelectionRange(el, start, end);
    };

    var getYoutubeVideoID = function(data) {
        //var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var p = /(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
        return (data.match(p)) ? RegExp.$1 : false;
    };

    $.fn.loadYT = function () {
        return this.each(function () {
            $(this).find('a:not(.yt-url)').filter('a').map(function () {
                var vId = getYoutubeVideoID(this.href); 
                if ( vId ) {
                    $(this)
                        .attr('data-vid', vId)
                        .addClass('yt-url')
                        .after('<iframe width="420" height="345" frameborder="0" allowfullscreen src="http://www.youtube.com/embed/'+ vId +'" />')
                };
            });
        });
    };


    // Linkify
    $.fn.boxizeLinkify = function (options) {
        var defaults = {
            nl2br: true,
            linkClass: 'tsc-boxize-link',
            format: function (value, type) {
                console.log(getYoutubeVideoID(value));
                if ( getYoutubeVideoID(value) !== false ) return false;
                console.log(value, type);
                return value;
            },
            formatHref: function (href, type) {
                console.log(getYoutubeVideoID(href));
                if ( getYoutubeVideoID(href) !== false ) return false;
                console.log(href, type);
                return href;
            }
        },
        settings = $.extend(defaults, options || {});

        return this.each(function () {
            $(this).linkify(settings);
        });
    };

    $.fn.boxize = function(options) {
        return this.each(function() {

            var _el = this;
            $(_el)
                .attr('contenteditable', true)
                .css("min-height", settings.height);

            var text = $(_el).text();
            var links = linkify.find(text);

            //console.log(links);

            links.map(function (link) {

                if ( getYoutubeVideoID(link.value) === false ) {
                    var html = $(_el).html();
                    var anchor = '<a href="'+ link.href +'" class="tsc-boxize-link" target="_blank">'+ link.value +'</a>';
                    var afterReplace = html.replace(link.value, anchor);
                    console.log(afterReplace);
                    $(_el).html(afterReplace);
                }
            });

            console.log( linkify.find( $(_el).html() ) );
            //$(this).boxizeLinkify();
            
            $(this).on('keyup',
            function() { 
                var caret = $(this).getCaretPosition(this);
                var text = $(this).text();
                
                //$(this).boxizeLinkify();

                $(this).setCaretTo(this, caret);
                //$(this).loadYT();

                //$(this).linkify();
            });
        });
    };
} (jQuery));