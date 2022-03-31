/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('inspinia', [
        'ngRoute',                      //Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'controllers',                  //Controllers
        "angular-jwt",
        "ngCookies",
        //"store-factories"
        "ngMessages",
        "ngResource",
        "ngRoute.middleware",
        "store-directives",
        "ngCkeditor",
        "ngFileUpload",
        "datePicker",
        "bw.paging",
        "angularSpinner",
        "model-factories",
        "selectize"
    ])
})();
