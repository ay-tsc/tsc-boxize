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
        youtybeTemplate: '<div contenteditable="false" class="no-linkify yt-video-content yt-vid-{{videoId}}" data-vid="{{videoId}}" data-yt-url="{{youtubeUrl}}">' + 
                                '<a class="remove-video">&nbsp;X&nbsp;</a>' + 
                                '<iframe width="420" height="345" frameborder="0" allowfullscreen src="http://www.youtube.com/embed/{{videoId}}" />' +
                        '</div>',
        editableExtender: '<br>'
    };

    /**
     *  Check for a valid Link
     */
    var isValidUrl = function (url) {
        return linkify.test($.trim(url));
    };

    /**
     *  Extracts Links
     */
    var extractLinks = function (data) {
        return linkify.find($.trim(data));
    };

    /**
     *  Checking for existance of urls
     */
    var isLinkifyAble = function (data) {
        return extractLinks(data).length;
    };

    /**
     *  Check if URL is youtube
     */
    String.prototype.isYoutubeURL = function () {
        var p = /youtu(be)?/, match = this.match(p);
        return match ? true : false;
    };

    /**
     * Get Youtube Video ID
     */
    var getYoutubeVideoID = function(link) { 
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        //var p = /(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
        return (link.trim().match(p)) ? RegExp.$1: false;
    };

    /**
     * linkify
     */
     var doLinkify = function (inputToLinkify, options) {
        if ( !isLinkifyAble(inputToLinkify) ) return false;

        var defaults = {
            linkClass: 'tsc-boxize-url',
            nl2br: false
        },
        settings = $.extend(defaults, options || {});
        return inputToLinkify.linkify(settings)
     };

    /**
     * Linkify all URLs
     */
    $.fn.boxizeLinkify = function(opts) {

        return this.each(function() {

            var parent = this,
                textNodes = [];
            
            function walkThroughNodes(node) {
                if ( node ) {
                    node = node.firstChild;
                    while( node != null ) {
                        if ( node.nodeType == 3 ) {
                            textNodes.push(node);
                        } else if ( node.nodeType == 1 && !$(node).hasClass('no-linkify') ) {
                            walkThroughNodes(node);
                        }
                        node = node.nextSibling;
                    }
                }
            }
            walkThroughNodes(this);

            $(textNodes).each(function () {
                var node = this, 
                    textContent = 'textContent' in this ? 'textContent' : 'innerText',
                    link = node[textContent],
                    parentNode = node.parentNode,
                    parentNodeName = parentNode.nodeName;

                if ( !isLinkifyAble(link) ) {
                    if ( parentNodeName == 'A' ) {
                        $(parentNode).before(link).remove();
                    } else if( node.nodeType == 3 || parentNode.nodeType == 3 ) {
                        $(node).before(link).remove();
                    }
                }

                if ( isValidUrl(link) && link.isYoutubeURL() ) {
                    var ytVId = getYoutubeVideoID(link);
                    if ( ytVId && !$(parent).find('.yt-vid-' + ytVId).length ) {
                        var youtubeVideo = settings.youtybeTemplate.replace(/{{videoId}}/g, ytVId).replace(/{{youtubeUrl}}/g, link);
                        $(node).after( $.parseHTML(youtubeVideo) ).remove();
                    }
                } else {
                    var anchor = doLinkify(link);
                    if ( parentNodeName == 'A' ) {
                        $(parentNode).before(anchor).remove();
                    } else if ( node.nodeType == 3 || parentNode.nodeType == 3 ) {
                        $(node).before(anchor).remove();
                    }
                }
            });

            // exception for IFrame as last child
            var lastChild = $(parent).find(':last-child');
            if ( lastChild.is('iframe') ) {
                $(parent).append(settings.editableExtender);
            }

        });
    };

    /**
     *  Save Current Cursor position
     */
    $.fn.saveCursor = function () {
        var saveSelection, position;
        if (window.getSelection && document.createRange) {
            saveSelection = function(containerEl) {
                var range = window.getSelection().getRangeAt(0);
                var preSelectionRange = range.cloneRange();
                preSelectionRange.selectNodeContents(containerEl);
                preSelectionRange.setEnd(range.startContainer, range.startOffset);
                var start = preSelectionRange.toString().length;

                return {
                    start: start,
                    end: start + range.toString().length
                };
            };
        } else if (document.selection) {
            saveSelection = function(containerEl) {
                var selectedTextRange = document.selection.createRange();
                var preSelectionTextRange = document.body.createTextRange();
                preSelectionTextRange.moveToElementText(containerEl);
                preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
                var start = preSelectionTextRange.text.length;

                return {
                    start: start,
                    end: start + selectedTextRange.text.length
                }
            };
        }

        return saveSelection(this[0]);
    };

    /**
     *  Restore Cursor position after Content Editable update
     */
    $.fn.restoreCursor = function(savedCursor) {
        var restoreSelection;
        if (window.getSelection && document.createRange) {
            restoreSelection = function(containerEl, savedSel) {
                var charIndex = 0, range = document.createRange();
                range.setStart(containerEl, 0);
                range.collapse(true);
                var nodeStack = [containerEl], node, foundStart = false, stop = false;

                while (!stop && (node = nodeStack.pop())) {
                    if (node.nodeType == 3) {
                        var nextCharIndex = charIndex + node.length;
                        if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                            range.setStart(node, savedSel.start - charIndex);
                            foundStart = true;
                        }
                        if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                            range.setEnd(node, savedSel.end - charIndex);
                            stop = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        var i = node.childNodes.length;
                        while (i--) {
                            nodeStack.push(node.childNodes[i]);
                        }
                    }
                }

                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            };
        } else if (document.selection) {
            restoreSelection = function(containerEl, savedSel) {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(containerEl);
                textRange.collapse(true);
                textRange.moveEnd("character", savedSel.end);
                textRange.moveStart("character", savedSel.start);
                textRange.select();
            };
        }

        return this.each(function () {
            restoreSelection(this, savedCursor);
        });
    };

    /**
     *  Boxize Plugin
     */
    $.fn.boxize = function(options) {

        return this.each(function() {
            var _el = this;
            var keyTimer = null, keyDelay = 1000;

            $(_el)
                .attr('contenteditable', true)
                .css("min-height", settings.height)
                .restoreCursor({start: 1, end: 1})
                .boxizeLinkify()
                .on('keyup', function (e) {
                    if (keyTimer) {
                        window.clearTimeout(keyTimer);
                    }
                    keyTimer = window.setTimeout(function() {
                        $(_el).boxizeLinkify();
                        keyTimer = null;
                    }, keyDelay);
                })
                .on('paste', function () {
                    $(this).boxizeLinkify();
                })
                .on('click', '.remove-video', function () {
                    $(this).closest('.yt-video-content').remove();
                });
        });
    };
} (jQuery));