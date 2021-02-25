chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.extractPage) {
    var extractor = new PageExtractor(request);
    var productLinks = extractor.getProductLinks();
    var hasNextPage = extractor.hasNextPage();
    console.log('PageExtractor data', productLinks);
    sendResponse({
      productLinks: productLinks,
      hasNextPage: hasNextPage
    });
    return true;
  }

  if (request.extractProduct) {
    var extractor = new ProductExtractor(request);
    var productDetail = extractor.getProductDetail();
    console.log('ProductExtractor data', productDetail);
    sendResponse({
      productDetail: productDetail
    });
    return true;
  }

  if (request.showDetail) {
    var products = request.products;
    var reportPage = new ReportPage();
    reportPage.show(products);
    sendResponse("OK");
    return true;
  }

});

