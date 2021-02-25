ReportPage = function () { };

ReportPage.prototype = {
  show: function (products) {
    jQuery('head').append(
      `<style>td, th { border: solid 1px black; } </style>`
    );
    var mainContent = jQuery('#main');
    mainContent.empty();

    mainContent.append(`<p><h2>Danh sách sản phẩm</h2></p>`);
    mainContent.append(`<table style="border-collapse: collapse;">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Shop</th>
                    <th>Giá</th>
                    <th>Giảm giá</th>
                    <th>Ưu đãi</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody id="extension-detail-products">
  
            </tbody>
          </talbe>`);

    for (var i = 0; i < products.length; i++) {
      jQuery('#extension-detail-products').append(
        `<tr> <td>` +
        (i + 1) +
        `</td>
        <td>` +
        products[i].name +
        `</td>
       <td>`
        +
        products[i].shop +
        `</td>
       <td>` +
        products[i].price +
        `</td>
    <td>` +
        products[i].discount +
        `</td>
 <td>` +
        this.getPromotions(products[i].promotions) +
        `</td>
       <td>` +
        products[i].link +
        `</td>
       </tr>`
      );
    }
  },
  numberWithCommas: function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  getPromotions: function (promotions) {
    var text = '';
    for (var i = 0; i < promotions.length; i++) {
      text += promotions[i] + '<br/>';
    }
    return text;
  }
};
