angular.module('payController', ['store-factories']);

function PayListController($scope, rest, $window, usSpinnerService, modelFactory, $routeParams) {
  usSpinnerService.spin('spinner');
  $scope.module = 'pays';
  $scope.paginate = {
    page: 1,
    skip: 0,
    limit: 15,
    countTotal: 0,
    orderBy: 'createdAt',
    populate: '',
    conditions: ''
  };

  $scope.filtersView = {
  //   model: $scope.module,
  //   input: [{
  //     name: 'Nombre', //placeholder filter
  //     model: $scope.module, //model filter, usually same model
  //     key: 'name', //attribute on model filter
  //     type: 'text',
  //     like: true
  //   }, {
  //     name: 'CUIT',
  //     model: $scope.module,
  //     key: 'cuit',
  //     type: 'text',
  //     like: false
  //   }],
  //   dropdown: [
  //   //   {
  //   //   name: 'Centro Médico', //placeholder filter
  //   //   model: $scope.module,
  //   //   key: 'medicalcenter',
  //   //   associatedModel: 'medicalcenters', //associatedModel filter
  //   //   associatedKey: 'name', //attribute on associatedModel filter
  //   //   multiple:  false//filter with multiple associatedModel
  //   // }
  // ]
  };

console.log($routeParams.typePay)
  if($routeParams.typePay == 'sale') {
    $scope.sale = $routeParams.id;
    $scope.paginate.conditions = 'sale=' + $routeParams.id;
  } else if ($routeParams.typePay == 'providerpayment') {
    $scope.providerpayment = $routeParams.id;
    $scope.paginate.conditions = 'providerpayment=' + $routeParams.id;
  }


  //get countTotal for paginate
  modelFactory.count($scope.module, setCount);

  var loadModel = function(skip) {
    var skip_pg = skip || $scope.paginate.skip;
    var condition = '';

    condition = setCond(condition, skip_pg);

    rest().get({
        type: $scope.module,
        params: condition
    }, function(resp) {
      $scope.data = resp;
      //$scope.paginate.countTotal = resp.length;
      usSpinnerService.stop('spinner');
    }, function(error) {
      $scope.data = [];
      usSpinnerService.stop('spinner');
    });
  };

  loadModel();

  function setCount(count) {
    $scope.paginate.countTotal = count;
  };

  $scope.delete = function(id) {
    if (confirm('¿Está seguro de realizar esta acción?')) {
      usSpinnerService.spin('spinner');
      rest().delete({
        id: id,
        type: $scope.module
      }, function(resp) {
        $window.location.reload();
      }, function(error) {
        alert('Hubo un error al eliminar el pago.');
        usSpinnerService.stop('spinner');
      });
    }
  };

  $scope.paging = function(event, page, pageSize, total) {
    var skip = (page - 1) * $scope.paginate.limit;
    $scope.paginate.page = page;
    loadModel(skip);
  };

  function setCond(cond, skip_pg) {
    if(!!$scope.paginate.orderBy) {
      cond += 'orderBy=' + $scope.paginate.orderBy + '&';
    } else {
      cond += 'orderBy=createdAt&';
    }

    cond += 'sort=-1&';

    if(!!$scope.paginate.populate) {
      cond += 'populate=' + $scope.paginate.populate + '&';
    }

    cond += 'skip=' + skip_pg + '&';

    if(!!$scope.paginate.limit) {
      cond += 'limit=' + $scope.paginate.limit;
    }

    if(!!$scope.paginate.conditions) {
      cond += '&' + $scope.paginate.conditions;
    }

    return cond;
  }
};

function PayViewController($scope, $routeParams, rest, $location, $sce, usSpinnerService, $rootScope, $anchorScroll) {
  usSpinnerService.spin('spinner');
  $scope.module = 'pays';
  $scope.configCkeditor = {
    height: 200
  }

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module,
      params: 'populate=sale,providerpayment'
    }, function(resp) {
      $scope.info = resp;

      if (!!resp.date) {
          $scope.info.date = moment($scope.info.date, 'YYYY-MM-DD').format('DD-MM-YYYY').slice(0, 10)
      }

      usSpinnerService.stop('spinner');
    }, function(error) {
      $scope.info = {};
      usSpinnerService.stop('spinner');
    });
  };

  loadModel();

  $scope.delete = function(id) {
    if (confirm('¿Está seguro de realizar esta acción?')) {
      usSpinnerService.spin('spinner');
      rest().delete({
        id: id,
        type: $scope.module
      }, function(resp) {
        usSpinnerService.stop('spinner');
        $location.path('/' + $scope.module);
      }, function(error) {
        alert('Hubo un error al eliminar el pago.');
        usSpinnerService.stop('spinner');
      });
    }
  };

  $scope.getHtml = function(html) {
    return $sce.trustAsHtml(html);
  };

};

function PayCreateController($scope, rest, $location, $rootScope, $routeParams, usSpinnerService) {
  $scope.module = 'pays';
  $scope.info = {};
  $scope.today = moment().format('DD-MM-YYY');

  if($routeParams.typePay == 'sale') {
    rest().findOne({
      type: 'sales',
      id: $routeParams.id,
      params: 'populate=client,package'
    }, function(resp) {
      $scope.info.sale = resp;
    })
  } else if ($routeParams.typePay == 'providerpayment') {
    rest().findOne({
      type: 'providerpayments',
      id: $routeParams.id,
      params: 'populate=sale,provider'
    }, function(resp) {
      $scope.info.sale = resp.sale;
      $scope.info.sale.currency = resp.currency
      $scope.info.providerpayment = resp;
    })
  }


  $scope.save = function() {

    usSpinnerService.spin('spinner');
    var data = {
      payMethod: $scope.info.payMethod,
      currency: $scope.info.currency,
      importe: $scope.info.importe,
      exchangeRate: $scope.info.exchangeRate,
      date: moment($scope.info.date, 'DD-MM-YYYY').utc().toISOString().slice(0, 10),
    };

    if(!!$routeParams.typePay && $routeParams.typePay == 'sale') {
      data.sale = $scope.info.sale._id;
    }

    if(!!$routeParams.typePay && $routeParams.typePay == 'providerpayment') {
      data.providerpayment = $scope.info.providerpayment._id;
    }

    rest().save({
       type: $scope.module
    }, data, function (resp) {
      usSpinnerService.stop('spinner');
      if($routeParams.typePay == 'sale') {
        $location.url('/sales/' + $scope.info.sale._id + '/view');
      }
      else{
        $location.url('/providerpayments/' + $scope.info.providerpayment._id + '/view');
      }
    }, function (error) {
      usSpinnerService.stop('spinner');
    });
  };

};

function PayEditController($scope, $routeParams, $location, rest, $rootScope, usSpinnerService) {
  usSpinnerService.spin('spinner');
  $scope.module = 'pays';
  $scope.info = {};

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module
    }, function(resp) {
      $scope.info = resp;

      if (!!resp.date) {
          $scope.info.date = moment($scope.info.date, 'YYYY-MM-DD').format('DD-MM-YYYY').slice(0, 10)
      }

      rest().findOne({
        type: 'sales',
        id: resp.sale._id,
        params: 'populate=client,package'
      }, function(resp) {
        $scope.info.sale = resp;
      })

      usSpinnerService.stop('spinner');
    }, function(error) {
      $scope.info = {};
      usSpinnerService.stop('spinner');
    });
  };

  loadModel();

  $scope.save = function() {
    var data = {
      payMethod: $scope.info.payMethod,
      currency: $scope.info.currency,
      importe: $scope.info.importe,
      exchangeRate: $scope.info.exchangeRate,
      date: moment($scope.info.date, 'DD-MM-YYYY').utc().toISOString().slice(0, 10),
    };

    rest().update({
       id: $routeParams.id,
       type: $scope.module
    }, data, function (resp) {
      usSpinnerService.stop('spinner');
      $location.url('/sales/' + $scope.info.sale._id + '/view');
    }, function (error) {
      usSpinnerService.stop('spinner');
    });
  };
};
