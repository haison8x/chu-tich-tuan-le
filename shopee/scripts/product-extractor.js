ProductExtractor = function () { };

ProductExtractor.prototype = {
  getProductDetail: function () {
    var promotions = [];
    jQuery('._1nb0l8 >div').each(function (i, e) { 
      promotions.push(jQuery(e).text());
    });
    return {
      name: jQuery('._3ZV7fL span').text(),
      shop: jQuery('._3KP9-e').text(),
      discount: jQuery('._3ghar9').text(),
      price: jQuery('.AJyN7v').text(),
      promotions: promotions
    };
  }
};
