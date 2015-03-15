/*
  Suddenly.js
  ===========

  Useage:
    <element data-suddenly="Replace text.">Text words.</element>

  Options:
    [data-suddenly-option={option1: value, option2: value, ...}]:
      Options, contains:
        interval: {start: 40, end: 200}
        debug: false
        possibility: 0.02

  Under GPLv2, by Edward Cheng
 */

(function (window, jQuery) {
  var $ = jQuery;
  var global = window;
  var regex_word = /[a-z]|[A-Z]|[1-9]|-/;

  var cloneArray = function (input) {
    return input.slice(0, input.length - 1);
  }

  var isUndefined = function (value) {
    return typeof(value) === 'undefined';
  }

  var randomRange = function (start, end, floored) {
    if(floored) {
      return Math.floor(start + Math.random() * (end - start));
    } else {
      return start + Math.random() * (end - start);
    }
  }

  var indexParse = function (text) {
    var index = [];
    for (var i = 0; i < text.length; i++) {
      index.push('');
      for (; i < text.length; i++) {
        if(regex_word.test(text[i])) {
          index[index.length - 1] = index[index.length - 1].concat(text[i]);
        } else {
          if(index[index.length - 1].length === 0) {
            index[index.length - 1] = index[index.length - 1].concat(text[i]);
          } else {
            index.push(text[i]);
          }
          break;
        }
      }
    }
    return index;
  }

  var textParse = function (index) {
    var output = '';
    for (var i = 0; i < index.length; i++) {
      output = output.concat(index[i]);
    }
    return output;
  }

  var optionParse = function (input) {
    var output = {
      interval: {
        start: 40,
        end: 200
      },
      possibility: 0.02,
      debug: false
    }
    if(typeof(input) === 'object') {
      if(!isUndefined(input.interval)) {
        output.interval = input.interval;
      }
      if(!isUndefined(input.debug)) {
        output.debug = input.debug;
      }
      if(!isUndefined(input.possibility)) {
        output.possibility = input.possibility;
      }
    }
    return output;
  }

  var replace = function (index_runtime, index_base, index_replace, options) {
    for (var i = 0; i < index_runtime.length; i++) {
      if(Math.random() < options.possibility) {
        index_runtime[i] = (Math.random() < 0.5 ? index_base[i] : index_replace[i]);
      }
    }
  }

  var replaced = function (element, index_runtime, index_base, index_replace, options) {
    replace(index_runtime, index_base, index_replace, options);
    element.text(textParse(index_runtime));
    setTimeout(function() {
      replaced(element, index_runtime, index_base, index_replace, options);
    }, randomRange(options.interval.start, options.interval.end, true));
  }

  var targets = $('[data-suddenly]');
  targets.each(function (index, original_element) {
    var element = $(original_element);
    var text_base = element.text();
    var text_replace = element.data('suddenly');
    var index_base = indexParse(text_base);
    var index_replace = indexParse(text_replace);
    var options = optionParse(element.data('suddenly-option'));

    if(index_base.length !== index_replace.length) {
      if(index_base.length > index_replace.length) {
        index_base = index_base.slice(0, index_replace.length);
      } else {
        index_replace = index_replace.slice(0, index_base.length);
      }
      console.warn('Suddenly.js index not matched, sliced. For element ', element);
    }
    var index_runtime = cloneArray(index_base);

    var log = function () {
      if(options.debug) {
        console.log(arguments);
      }
    }
    log('Suddenly.js debug info, element: ', original_element);
    log('Text base: ', index_base);
    log('Text replace: ', index_replace);
    replaced(element, index_runtime, index_base, index_replace, options);
  });

})(window, jQuery);
