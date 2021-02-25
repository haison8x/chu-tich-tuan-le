// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var maxPageCount = 2;
var productLinks = [];
var products = [];
var currentPageUrl = '';
var currentProductLinkIndex = 0;
var currentTab = null;
var browser = new PopupBrowser();
$(document).ready(function () {
  maxPageCount = jQuery('#max-page').val();

  $('#calculate').on('click', function () {
    reset();

    chrome.tabs.getSelected(null, function (tab) {
      currentTab = tab;
      currentPageUrl = tab.url;
      browser.fetchPage(currentPageUrl, fetchPageCallback, currentTab);
    });

    function fetchPageCallback(result) {
      var links = result.productLinks;
      productLinks = productLinks.concat(links);

      // Fetch Product Link
      var currentPage = getCurrentPage(currentPageUrl);
      var nextPage = currentPage + 1;
      var hasNextPage = result.hasNextPage;
      if (hasNextPage && nextPage < maxPageCount) {
        currentPageUrl = removeURLParameter(currentPageUrl, 'page');
        currentPageUrl = currentPageUrl + '&page=' + nextPage;
        browser.fetchPage(currentPageUrl, fetchPageCallback, currentTab);
      }
      else if (currentProductLinkIndex < productLinks.length) {
        // Fetch Product
        var productLink = productLinks[currentProductLinkIndex];
        browser.fetchProduct(productLink, fetchProductCallback, currentTab);
      }
    }

    function fetchProductCallback(result) {
      result.productDetail.link=productLinks[currentProductLinkIndex];
      products.push(result.productDetail);
      currentProductLinkIndex++;

      if (currentProductLinkIndex < productLinks.length) {
        var productLink = productLinks[currentProductLinkIndex];
        browser.fetchProduct(productLink, fetchProductCallback, currentTab);
      }
      else {
        $('#status').empty();
        browser.showDetail(products);
      }
    }
  });

  function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

      var prefix = encodeURIComponent(parameter) + '=';
      var pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (var i = pars.length; i-- > 0;) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
  }

  function getUrlParameter(urlString, paremeter) {
    var url = new URL(urlString);
    return url.searchParams.get(paremeter);
  }

  function getCurrentPage(urlString) {
    var currentPage = getUrlParameter(urlString, 'page');
    currentPage = parseInt(currentPage);
    return isNaN(currentPage) ? 0 : currentPage;
  }

  function reset() {
    productLinks = [];
    products = [];
    currentPageUrl = '';
    currentProductLinkIndex = 0;
    currentTab = null;

    $('#status')
      .empty()
      .append('<span> Đang cào, đừng nóng</span>');
  }
});
