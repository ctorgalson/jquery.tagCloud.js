(function ($) {
  "use strict";
  /**
   * This plugin, when called on a container containing multiple links etc.,
   * each of which contains an attribute with a numerical 'weight' value,
   * intelligently turns the elements into a 'tag cloud'.
   *
   * @author Christopher Torgalson <manager@bedlamhotel.com>
   *
   * @param object overrides
   *  Configuration object. Contains the following items:
   *
   *  -- classes (array)
   *     An array of classes for use in the tag cloud output. Any number of
   *     items may be used. Should be ordered from smallest to largest. Default:
   *     ['tag-cloud-small', 'tag-cloud-medium', 'tag-cloud-large']
   *
   *  -- processedClassName (string)
   *     Class name to apply to each tag to mark it as having been processed by
   *     the plugin. Default: 'processed'
   *
   *  -- randomWeights (bool)
   *     Whether or not to assign random weights to tags in tag cloud. Only
   *     useful for testing. Default: false
   *
   *  -- tagSelector (string)
   *     CSS selector to be used with jQuery's .find() method to build a
   *     collection of tags inside the plugin. Default: '.tag-cloud-tag'
   *
   *  -- weightAttribute (string)
   *     Name of the attribute containing the 'weight' of the tag. The value of
   *     this attribute in the target markup should be numeric. Default:
   *     'data-tag-weight'
   *
   * @example
   *
   * Given the following markup:
   *
   * <ul id="tag-cloud">
   *  <li class="tag-cloud-tag" data-tag-weight="11"><a href="/lorem">Lorem</a></li>
   *  <li class="tag-cloud-tag" data-tag-weight="38"><a href="/ipsum">Ipsum</a></li>
   *  <li class="tag-cloud-tag" data-tag-weight="87"><a href="/dolor">Dolor</a></li>
   * </ul>
   *
   * Calling $('#tag-cloud').tagCloud(); with the default values produces the
   * following markup:
   *
   * <ul id="tag-cloud">
   *  <li class="tag-cloud-tag tag-cloud-small processed" data-tag-weight="11"><a href="/lorem">Lorem</a></li>
   *  <li class="tag-cloud-tag tag-cloud-medium processed" data-tag-weight="32"><a href="/ipsum">Ipsum</a></li>
   *  <li class="tag-cloud-tag tag-cloud-large processed" data-tag-weight="87"><a href="/dolor">Dolor</a></li>
   * </ul>
   *
   * @version 1.0
   */
  $.fn.tagCloud = function(overrides) {
    // Prepare default settings for plugin:
    var settings = $.extend(
          {
            classes: [
              'tag-cloud-small',
              'tag-cloud-medium',
              'tag-cloud-large'
            ],
            processedClassName: 'processed',
            randomWeights: false,
            tagSelector: '.tag-cloud-tag',
            weightAttribute: 'data-tag-weight'
          },
          overrides
        );
    // Loop through all of the tag clouds that match the selector the plugin was
    // called on:
    return this.each(function(i,e){
      // If the plugin call has asked for random weights (i.e. if we're testing):
      if (settings.randomWeights) {
        // Go through the tags, assign a random value between 1 and 100 to the
        // weight attribute, and remove the 'processed' class:
        $(settings.tagSelector).each(function(i,e){
          $(e)
            .attr(settings.weightAttribute, Math.floor(Math.random() * 101))
            .removeClass(settings.processedClassName);
        });
      }
      // Define some vars that we need inside the loop:
      //  -- the current element,
      //  -- the collection of tags
      //  -- an empty array for the weights
      //
      var $current = $(e),
          $tags = $current.find(settings.tagSelector),
          weights = [];
      // Populate the array with the weights of the various tags:
      $tags.each(function(i,e){
        weights[i] = parseInt($(e).attr(settings.weightAttribute), 10);      
      });
      // Vars based on the weights array:
      //  -- the max weight
      //  -- the min weight
      //  -- the number of different tag weights
      //  -- an empty array for the weight ranges
      //
      var max = Math.max.apply(Math, weights),
          min = Math.min.apply(Math, weights),
          divisions = settings.classes.length,
          rangeSize = (max - min) / divisions,
          rangeValues = [];
      // We know the first and last values for the ranges array at the outset:
      rangeValues[0] = min,
      rangeValues[divisions] = max;
      // Now calculate the ranges:
      for (var j = 1; j < divisions; j++) {
        rangeValues[j] = min + j * rangeSize;
      }
      // Now loop through each of the tags again:
      $tags.each(function(i,e){
        // Store the current element and its weight:
        var $current = $(e),
            $currentWeight = $current.attr(settings.weightAttribute);
        // Loop through the divisions in order to figure out which class to
        // assign to this tag:
        for (var j = 0; j < divisions; j++) {
          // If:
          //  -- the current element's weight is greater than or equal to the
          //     lower end of the range, AND
          //  -- the current element's weight is less than the upper end of the
          //     range, AND
          //  -- the element hasn't already been marked 'processed'
          //
          if ($currentWeight >= rangeValues[j] && $currentWeight <= rangeValues[j + 1] && !$current.hasClass(settings.processedClassName)) {
            // Add the class corresponding to this range and the 'processed'
            // class:
            $current.addClass(settings.classes[j] + ' ' + settings.processedClassName);
          }
        }
      });
    });
  };
})(jQuery);
