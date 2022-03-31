(function() {
    var app = angular.module('store-directives', []);




    searchBar.$inject = ['$parse', 'modelFactory'];
    function searchBar($parse) {
        return {
            restrict: "E",
            templateUrl: "views/directives/search.html",
            scope: "=",
            controller: function ($scope, modelFactory, rest) {
              console.log('searchBar');
              var sb = this;

              sb.search = search;
              sb.clearSearch = clearSearch;

              $scope.today = moment().format('YYYY-MM-DD');

              function search() {
                  var conditions = '';
                  var like = false;
                  var element = {
                    type: $scope.filtersView.model
                  };

                  angular.forEach($scope.filtersView.input, function(element) {
                    if(!!element.val) {
                      if(element.type == 'date') {
                        conditions += element.key + '=' + element.val.toISOString().slice(0, 10) + '&';
                      } else {
                        conditions += element.key + '=' + element.val + '&';
                      }

                      if(!!element.like) {
                        like = true;
                      }
                    }
                  });

                  if(!!like) {
                    conditions += 'like=true&';
                  }

                  angular.forEach($scope.filtersView.dropdown, function(element) {
                    if(!!element.val) {
                      conditions += element.key + '=' + element.val + '&';
                    }
                  });
console.log($scope.$parent);
console.log($scope);
                  $scope.$parent.paginate.conditions = conditions;

                  conditions += 'orderBy=' + $scope.paginate.orderBy + '&populate=' + $scope.paginate.populate + '&sort=-1&skip=0&limit=' + $scope.paginate.limit;

                  modelFactory.count(element.type, function(resp) {
                    $scope.$parent.paginate.countTotal = resp;
                  }, conditions);
                  element.conditions = conditions;
                  modelFactory.search(element, function(resp) {
                    $scope.$parent.data = resp;
                  });
                }

                function clearSearch() {
                    angular.forEach($scope.filtersView.input, function(element) {
                      if(!!element.val) {
                        delete element.val;
                      }
                    });

                    angular.forEach($scope.filtersView.dropdown, function(element) {
                      if(!!element.val) {
                        delete element.val;
                      }
                    });

                    if(!!sb.info) {
                      sb.info = {};
                    }

                    search();
                };

            },
            link: function(scope, element, attrs) {
              scope.filtersView = $parse(attrs.filters)();
              scope.paginate = $parse(attrs.paginate)();
            },
            controllerAs: "sb"
        };
    };
    app.directive("searchBar", searchBar);


    app.filter('foodFilter', function () {
        return function (input) {
            if(!!input) {
                var translate = {
                    breakfast: 'Desayuno',
                    allinclusive: 'All inclusive',
                    complete: 'Completo',
                    european: 'Europeo',
                    other: 'Otro',
                    none: 'Ninguno'
                };

                return translate[input];
            } else {
                return input;
            }
        };
    });
    app.filter('currencyFilter', function () {
        return function (input) {
            if(!!input) {
                var translate = {
                    ars: 'Pesos argentinos',
                    usd: 'Dólares',
                    eur: 'Euros'
                };

                return translate[input];
            } else {
                return input;
            }
        };
    });
    app.filter('currencySymbolFilter', function () {
        return function (input) {
            if(!!input) {
                var translate = {
                    ars: '$',
                    usd: 'u$s',
                    eur: '€'
                };

                return translate[input];
            } else {
                return input;
            }
        };
    });

    app.filter('methodFilter', function () {
        return function (input) {
            if(!!input) {
                var translate = {
                    dt: 'Depósito/Transferencia',
                    card: 'Tarjeta',
                    link: 'Link de pagos',
                    saldo: 'Pase de saldo / Monto a favor',
                    tc: 'TC Línea Aérea'
                };

                return translate[input];
            } else {
                return input;
            }
        };
    });

    findModel.$inject = ['rest'];
    function findModel(rest) {
      return function(item) {
        console.log(item);
        rest().findOne({
          type: 'notes',
          id: item,
          params: 'populate=user'
        }, function(resp) {
          console.log(resp.user);
          return resp.user;
        }, function(error) {
          // item[attribute] = item[attribute];
        });
      }
    }

    app.filter('findModel', findModel);

})();
