(function($) {

  Drupal.behaviors.facetbrowser = {
    attach: function(context, settings) {
      Drupal.FoldFacetGroup();

      // Check for click in checkbox, and execute search
      $(Drupal.settings.dingFacetBrowser.mainElement + ' .form-type-checkbox input').change(function(e) {
        $('body').prepend('<div class="facetbrowser_overlay"><div class="spinner"></div></div>');
        window.location = $(e.target).parent().find('a').attr('href');
      });
    }
  };

  /**
   * Fold facet groups to show only 5 per group.
   */
  Drupal.FoldFacetGroup = function() {
    $(Drupal.settings.dingFacetBrowser.mainElement + ' fieldset.form-wrapper').each(function() {
      var facetGroup = $(this);

      // Hide 6th+ items.
      if (facetGroup.find('.form-type-checkbox').size() > Drupal.settings.dingFacetBrowser.showCount) {
        facetGroup.find('.form-type-checkbox').each(function(counter, facetElement) {
          if (counter >= Drupal.settings.dingFacetBrowser.showCount) {
            $(facetElement).hide();
          }
        });

        // Add "View more" link in group.
        var span_id = 'expand_more_' + facetGroup.attr('id');
        if (!facetGroup.find('#' + span_id).length) {
          facetGroup.append(
            '<span class="expand" id="' + span_id + '">'
            + Drupal.t('Vis flere')
            + '</span>'
          );
        }
      }
    });

    $(Drupal.settings.dingFacetBrowser.mainElement + ' .expand').live('click', function() {
      var clickedKey = this;
      var facetGroup = $(clickedKey).parent();
      var span_id_more = 'expand_more_' + facetGroup.attr('id');
      var span_id_less = 'expand_less_' + facetGroup.attr('id');

      facetGroup.find('.form-type-checkbox:' + (clickedKey.id == span_id_more ? 'hidden': 'visible')).each(function(count, facetElement) {
        if (clickedKey.id == span_id_more && count < Drupal.settings.dingFacetBrowser.showCount) {
          // Add "less" link after "more".
          $(facetElement).slideDown('fast', function() {
            if (facetGroup.find('.form-type-checkbox:visible').size() >= Drupal.settings.dingFacetBrowser.showCount && facetGroup.find('#' + span_id_less).size() === 0 && count % Drupal.settings.dingFacetBrowser.showCount === 0) {
              facetGroup.find('#' + span_id_more).after('<span class="expand" id="' + span_id_less + '">' + Drupal.t('Luk') + '</span>');
              facetGroup.find('#' + span_id_less).show();
            }
          });
        }
        else if (clickedKey.id == span_id_less && count >= Drupal.settings.dingFacetBrowser.showCount) {
          // Remove "less" link if only 5 items are show.
          $(facetElement).slideUp('fast', function() {
            if (facetGroup.find('.form-type-checkbox:visible').size() == Drupal.settings.dingFacetBrowser.showCount && facetGroup.find('#' + span_id_less + ':visible')) {
              facetGroup.find('#' + span_id_less).fadeOut().remove();
            }
          });
        }
      });

      // Remove "more" if reached the limit.
      if( (facetGroup.find('.form-type-checkbox:visible').size() >= facetGroup.data('count')) && (clickedKey.id == span_id_more) ) {
        facetGroup.find('#' + span_id_more).remove();
      }

      // Add "more" link.
      if( clickedKey.id == span_id_less){
        if(facetGroup.find('#' + span_id_more).length == 0) {
          facetGroup.append('<span class="expand" id="' + span_id_more + '">' + Drupal.t('Vis flere') + '</span>');
          facetGroup.find('#' + span_id_more).show();
        }
      }
    });
  };

})(jQuery);
