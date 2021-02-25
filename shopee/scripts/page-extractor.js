PageExtractor = function () { };

PageExtractor.prototype = {
  getProductLinks: function () {
    var links = [];   
    jQuery('.shopee-search-item-result__items .shopee-search-item-result__item a').each(function (i, e) {
      var href = "https://shopee.vn" + jQuery(e).attr("href");
      links.push(href);
    });

    return links;
  },
  hasNextPage: function () {
    return jQuery('.shopee-search-item-result__items .shopee-search-item-result__item').length > 0;
  }
};
