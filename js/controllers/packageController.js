angular.module('packageController', ['store-factories']);

function PackageListController($scope, rest, $window, usSpinnerService, modelFactory) {
  usSpinnerService.spin('spinner');
  $scope.module = 'packages';
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
    model: $scope.module,
    input: [{
      name: 'Ciudad', //placeholder filter
      model: $scope.module, //model filter, usually same model
      key: 'city', //attribute on model filter
      type: 'text',
      like: true
    },{
      name: 'País', //placeholder filter
      model: $scope.module, //model filter, usually same model
      key: 'country', //attribute on model filter
      type: 'text',
      like: true
    },{
      name: 'Playa', //placeholder filter
      model: $scope.module, //model filter, usually same model
      key: 'beach', //attribute on model filter
      type: 'text',
      like: true
    },{
      name: 'Días', //placeholder filter
      model: $scope.module, //model filter, usually same model
      key: 'days', //attribute on model filter
      type: 'text',
      like: false
    }],
    dropdown: [
    //   {
    //   name: 'Centro Médico', //placeholder filter
    //   model: vm.module,
    //   key: 'medicalcenter',
    //   associatedModel: 'medicalcenters', //associatedModel filter
    //   associatedKey: 'name', //attribute on associatedModel filter
    //   multiple:  false//filter with multiple associatedModel
    // }
  ]
  };

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

  $scope.delete = function(id) {
    if (confirm('¿Está seguro de realizar esta acción?')) {
      usSpinnerService.spin('spinner');
      rest().delete({
        id: id,
        type: $scope.module
      }, function(resp) {
        $window.location.reload();
      }, function(error) {
        usSpinnerService.stop('spinner');
      });
    }
  };
  $scope.paging = function(event, page, pageSize, total) {
    var skip = (page - 1) * $scope.paginate.limit;
    $scope.paginate.page = page;
    loadModel(skip);
  };

  function setCount(count) {
    $scope.paginate.countTotal = count;
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

function PackageViewController($scope, $routeParams, rest, $location, usSpinnerService) {
  usSpinnerService.spin('spinner');
  $scope.module = 'packages';

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module,
      params: 'populate=front'
    }, function(resp) {

      $scope.info = resp;
      if (!!resp.when) {
          $scope.info.when = $scope.info.when ? moment($scope.info.when).utc().toISOString().slice(0, 10) : null;
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
        usSpinnerService.stop('spinner');
      });
    }
  };
};

function PackageCreateController($scope, rest, $location, $filter, Upload, $rootScope, usSpinnerService) {
  $scope.module = 'packages';
  $scope.info = {};

  $scope.clearFront = function() {
    $scope.info.front = null;
  };

  $scope.today = moment().format('YYYY-MM-DD');

  $scope.save = function() {
    usSpinnerService.spin('spinner');
    var data = {
      city: $filter('uppercase')($scope.info.city),
      country: $filter('uppercase')($scope.info.country),
      beach: $filter('uppercase')($scope.info.beach),
      when: moment($scope.info.when, 'DD-MM-YYYY').utc().toISOString().slice(0, 10),
      days: $scope.info.days,
      starred: $scope.info.starred,
      aerial: $scope.info.aerial,
      transfer: $scope.info.transfer,
      excursion: $scope.info.excursion,
      accommodation: $scope.info.accommodation,
      minorsAge: $scope.info.minorsAge,
      foodRegime: $scope.info.foodRegime,
      passengers: $scope.info.passengers,
      price: $scope.info.price,
      hotelName: $scope.info.hotelName,
      description: $scope.info.description,
      nights: $scope.info.nights,
      front: $scope.info.front,
      currency: $scope.info.currency
    };

    Upload.upload({
      url: $rootScope.url + "/packages",
      arrayKey: '',
      data: data,
      headers: {
        'Authorization': 'JWT ' + $rootScope.adminglob.currentUser.token
      }
    }).then(function(resp) {
      usSpinnerService.stop('spinner');
      $location.url('/' + $scope.module);
    }, function(error) {
      usSpinnerService.stop('spinner');
    }, function(evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    });
  };
};

function PackageEditController($scope, $routeParams, $location, rest, $filter, Upload, $rootScope, usSpinnerService) {
  usSpinnerService.spin('spinner');
  $scope.module = 'packages';
  $scope.info = {};

  $scope.clearFront = function() {
    $scope.info.front = null;
  };

  $scope.today = moment().format('YYYY-MM-DD');

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module,
      params: 'populate=front'
    }, function(resp) {
      $scope.info = resp;
      if (!!resp.when) {
          $scope.info.when = moment($scope.info.when, 'YYYY-MM-DD').format('DD-MM-YYYY').slice(0, 10)
      }
      usSpinnerService.stop('spinner');
    }, function(error) {
      $scope.info = {};
      usSpinnerService.stop('spinner');
    });
  };

  loadModel();

  $scope.save = function() {
    usSpinnerService.spin('spinner');
    var data = {
      city: $filter('uppercase')($scope.info.city),
      country: $filter('uppercase')($scope.info.country),
      beach: $filter('uppercase')($scope.info.beach),
      when: moment($scope.info.when, 'DD-MM-YYYY').utc().toISOString().slice(0, 10),
      days: $scope.info.days,
      starred: $scope.info.starred,
      aerial: $scope.info.aerial,
      transfer: $scope.info.transfer,
      excursion: $scope.info.excursion,
      accommodation: $scope.info.accommodation,
      minorsAge: $scope.info.minorsAge,
      foodRegime: $scope.info.foodRegime,
      passengers: $scope.info.passengers,
      price: $scope.info.price,
      hotelName: $scope.info.hotelName,
      description: $scope.info.description,
      nights: $scope.info.nights,
      currency: $scope.info.currency
    };

    if (!!$scope.info.front && !$scope.info.front.source) {
      data.front = $scope.info.front;
    }
    console.log(data);
    Upload.upload({
      url: $rootScope.url + "/" + $scope.module + "/" + $routeParams.id,
      method: 'PUT',
      data: data,
      headers: {
        'Authorization': 'JWT ' + $rootScope.adminglob.currentUser.token
      }
    }).then(function(resp) {
      usSpinnerService.stop('spinner');
      $location.url('/' + $scope.module);
    }, function(error) {
      usSpinnerService.stop('spinner');
    }, function(evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log(progressPercentage);
    });
  };
};
