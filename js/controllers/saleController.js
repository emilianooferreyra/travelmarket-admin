angular.module('saleController', ['store-factories']);

function SaleListController($scope, rest, $window, usSpinnerService, modelFactory) {
  usSpinnerService.spin('spinner');
  $scope.module = 'sales';
  $scope.paginate = {
    page: 1,
    skip: 0,
    limit: 99999999,
    countTotal: 0,
    orderBy: 'createdAt',
    populate: 'client,package,notes,provider',
    conditions: ''
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
        alert('Hubo un error al eliminar la venta.');
        usSpinnerService.stop('spinner');
      });
    }
  };

  $scope.paging = function(event, page, pageSize, total) {
    var skip = (page - 1) * $scope.paginate.limit;
    $scope.paginate.page = page;
    if (!!$scope.searchField && (!!$scope.searchField.name || !!$scope.searchField.dni)) {
      search(skip);
    } else {
      loadModel(skip);
    }
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

  $scope.search = search;
  $scope.clearSearch = clearSearch;

  function search(skip) {
    const skip_pg = skip || $scope.paginate.skip;
    let conditions = '';
    console.log($scope.searchField)
    if (!!$scope.searchField.name) {
      conditions += 'name=' + $scope.searchField.name + '&';
    }
    if (!!$scope.searchField.dni) {
      conditions += 'dni=' + $scope.searchField.dni + '&';
    }

    $scope.paginate.conditions = conditions;

    conditions += 'orderBy=' + $scope.paginate.orderBy + '&populate=' + $scope.paginate.populate + '&sort=-1&skip=' + skip_pg + '&limit=' + $scope.paginate.limit;
    
    modelFactory.countClient($scope.module, function(resp) {
      $scope.paginate.countTotal = resp;
    }, conditions);

    modelFactory.findClient({type: $scope.module, conditions }, function(resp) {
      $scope.data = resp;
    });
  }

  function clearSearch() {
    if (!!$scope.searchField.name) {
      $scope.searchField.name = '';
    }
    if (!!$scope.searchField.dni) {
      $scope.searchField.dni = '';
    }
    $scope.paginate.conditions = '';
    $scope.paginate.page = 0;
    loadModel(0);
  };
};

function SaleViewController($scope, $routeParams, rest, $location, $sce, usSpinnerService, $rootScope, $anchorScroll) {
  usSpinnerService.spin('spinner');
  $scope.module = 'sales';
  $scope.configCkeditor = {
    height: 200
  }

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module,
      params: 'populate=client,provider,package,notes'
    }, function(resp) {
      $scope.info = resp;

      if (!!resp.date) {
          $scope.info.date = moment($scope.info.date, 'YYYY-MM-DD').format('DD-MM-YYYY').slice(0, 10)
      }

      rest().get({
        type: 'pays',
        params: 'sale=' + resp._id
      }, function(pays) {
        pays.map( each => each.date = moment(each.date, 'YYYY-MM-DD').format('DD-MM-YYYY').slice(0, 10))
        $scope.info.pays = pays;
      })

      // for (note in $scope.info.notes) {
      //   $scope.info.notes[note] = rest().findOne({
      //     type: 'notes',
      //     id: $scope.info.notes[note],
      //     params: 'populate=user'
      //   });
      // }

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
        alert('Hubo un error al eliminar la venta.');
        usSpinnerService.stop('spinner');
      });
    }
  };

  $scope.deletePay = function(id) {
    if (confirm('¿Está seguro de realizar esta acción?')) {
      usSpinnerService.spin('spinner');
      rest().delete({
        id: id,
        type: 'pays'
      }, function(resp) {
        usSpinnerService.stop('spinner');
        //$location.path('/' + $scope.module + '/' + sale_id + '/view');
        loadModel();
      }, function(error) {
        alert('Hubo un error al eliminar el pago.');
        usSpinnerService.stop('spinner');
      });
    }
  };

  $scope.getHtml = function(html) {
    return $sce.trustAsHtml(html);
  };

  $scope.addNote = function() {
    usSpinnerService.spin('spinner');
    var data = {
      username: $scope.note.username,
      description: $scope.note.description,
      saleid: $scope.info._id
    };

    if(!!$scope.note._id) {
      rest().update({
         type: 'notes',
         id: $scope.note._id
      }, data, function (resp) {
        usSpinnerService.stop('spinner');
        $scope.note = {};
        $scope.formNote = false;
        $scope.btnNote = false;
        loadModel();
      }, function (error) {
        usSpinnerService.stop('spinner');
      });
    } else {
      rest().save({
         type: 'notes'
      }, data, function (resp) {
        usSpinnerService.stop('spinner');
        $scope.note = {};
        $scope.formNote = false;
        $scope.btnNote = false;
        loadModel();
      }, function (error) {
        usSpinnerService.stop('spinner');
      });
    }


  }

  $scope.descartarNota = function() {
    $scope.note = {};
    $scope.formNote = false;
    $scope.btnNote = false;
  }

  $scope.newNote = function() {
    $anchorScroll('formNote');
    $scope.note = {
      username: $rootScope.adminglob.currentUser.username
    };
    $scope.formNote = true;
    $scope.btnNote = true;
  }

  $scope.editNote = function(note) {
    $anchorScroll('formNote');
    $scope.note = {
      username: $rootScope.adminglob.currentUser.username,
      description: note.description,
      _id: note._id
    }
    $scope.formNote = true;
    $scope.btnNote = true;
  }

  $scope.deleteNote = function(note) {
    if (confirm('¿Está seguro de realizar esta acción?')) {
      usSpinnerService.spin('spinner');
      rest().delete({
        id: note._id,
        type: 'notes'
      }, function(resp) {
        usSpinnerService.stop('spinner');
        loadModel();
      }, function(error) {
        alert('Hubo un error al eliminar la venta.');
        usSpinnerService.stop('spinner');
      });
    }
  };
};

function SaleCreateController($scope, rest, $location, $rootScope, usSpinnerService) {
  $scope.module = 'sales';
  $scope.info = {};
  $scope.today = moment().format('DD-MM-YYY');

  $scope.save = function() {

    usSpinnerService.spin('spinner');
    var data = {
      client: $scope.info.client,
      provider: $scope.info.provider,
      package: $scope.info.package,
      impNeto: $scope.info.impNeto,
      category: $scope.info.category,
      remain: $scope.info.remain,
      tx: $scope.info.tx,
      impTm: $scope.info.impTm,
      description: $scope.info.description,
      currency: $scope.info.currency,
      date: moment($scope.info.date, 'DD-MM-YYYY').utc().toISOString().slice(0, 10),
    };

    rest().save({
       type: $scope.module
    }, data, function (resp) {
      usSpinnerService.stop('spinner');
      $location.url('/' + $scope.module + '/' + resp._id + '/view');
    }, function (error) {
      usSpinnerService.stop('spinner');
    });
  };

  var loadClients = function() {
    $scope.configClient = {
        //create: true,
        openOnFocus: true,
        valueField: 'id',
        labelField: 'placeholder',
        placeholder: 'Cliente',
        maxItems: 1,
        searchField: ['name'],
        // plugins: ['remove_button'],
        onItemAdd: function (value, $item) {

        }
    };
    $scope.clients = [];

    rest().get({
      type: 'clients',
      params: 'limit=99999999999'
    }, function(resp) {
      angular.forEach(resp, function(element) {
          $scope.clients.push({
              id: element._id,
              name: element.name,
              placeholder: element.name + ' - ' + element.cuit
          });
      });
    }, function() {

    })
  };

  loadClients();

  var loadProviders = function() {
    $scope.configProvider = {
        //create: true,
        openOnFocus: true,
        valueField: 'id',
        labelField: 'placeholder',
        placeholder: 'Proveedor',
        maxItems: 1,
        searchField: ['name'],
        // plugins: ['remove_button'],
        onItemAdd: function (value, $item) {

        }
    };
    $scope.providers = [];

    rest().get({
      type: 'providers',
      params: 'limit=99999999999'
    }, function(resp) {
      angular.forEach(resp, function(element) {
          $scope.providers.push({
              id: element._id,
              name: element.name,
              placeholder: element.name
          });
      });
    }, function() {

    })
  };

  loadProviders();

  var loadPackages = function() {
    $scope.configPackage = {
        //create: true,
        openOnFocus: true,
        valueField: 'id',
        labelField: 'placeholder',
        placeholder: 'Paquete',
        maxItems: 1,
        searchField: ['name'],
        // plugins: ['remove_button'],
        onItemAdd: function (value, $item) {

        }
    };
    $scope.packages = [];

    rest().get({
      type: 'packages',
      params: 'limit=99999999999'
    }, function(resp) {
      angular.forEach(resp, function(element) {
          $scope.packages.push({
              id: element._id,
              name: element.name,
              placeholder: element.city + ' - ' + element.country + ' - ' + element.beach
          });
      });
    }, function() {

    })
  };

  loadPackages();
};

function SaleEditController($scope, $routeParams, $location, rest, $rootScope, usSpinnerService) {
  usSpinnerService.spin('spinner');
  $scope.module = 'sales';
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

      usSpinnerService.stop('spinner');
    }, function(error) {
      $scope.info = {};
      usSpinnerService.stop('spinner');
    });
  };

  loadModel();

  $scope.save = function() {
    var data = {
      client: $scope.info.client,
      provider: $scope.info.provider,
      package: $scope.info.package,
      impNeto: $scope.info.impNeto,
      remain: $scope.info.remain,
      category: $scope.info.category,
      tx: $scope.info.tx,
      impTm: $scope.info.impTm,
      description: $scope.info.description,
      currency: $scope.info.currency,
      date: moment($scope.info.date, 'DD-MM-YYYY').utc().toISOString().slice(0, 10),
    };

    rest().update({
       id: $routeParams.id,
       type: $scope.module
    }, data, function (resp) {
      usSpinnerService.stop('spinner');
      $location.url('/' + $scope.module + '/' + resp._id + '/view');
    }, function (error) {
      usSpinnerService.stop('spinner');
    });
  };

  var loadClients = function() {
    $scope.configClient = {
        //create: true,
        openOnFocus: true,
        valueField: 'id',
        labelField: 'placeholder',
        placeholder: 'Cliente',
        maxItems: 1,
        searchField: ['name'],
        // plugins: ['remove_button'],
        onItemAdd: function (value, $item) {

        }
    };
    $scope.clients = [];

    rest().get({
      type: 'clients',
      params: 'limit=99999999999'
    }, function(resp) {
      angular.forEach(resp, function(element) {
          $scope.clients.push({
              id: element._id,
              name: element.name,
              placeholder: element.name + ' - ' + element.cuit
          });
      });
    }, function() {

    })
  };

  loadClients();

  var loadProviders = function() {
    $scope.configProvider = {
        //create: true,
        openOnFocus: true,
        valueField: 'id',
        labelField: 'placeholder',
        placeholder: 'Proveedor',
        maxItems: 1,
        searchField: ['name'],
        // plugins: ['remove_button'],
        onItemAdd: function (value, $item) {

        }
    };
    $scope.providers = [];

    rest().get({
      type: 'providers',
      params: 'limit=99999999999'
    }, function(resp) {
      angular.forEach(resp, function(element) {
          $scope.providers.push({
              id: element._id,
              name: element.name,
              placeholder: element.name
          });
      });
    }, function() {

    })
  };

  loadProviders();

  var loadPackages = function() {
    $scope.configPackage = {
        //create: true,
        openOnFocus: true,
        valueField: 'id',
        labelField: 'placeholder',
        placeholder: 'Paquete',
        maxItems: 1,
        searchField: ['name'],
        // plugins: ['remove_button'],
        onItemAdd: function (value, $item) {

        }
    };
    $scope.packages = [];

    rest().get({
      type: 'packages',
      params: 'limit=99999999999'
    }, function(resp) {
      angular.forEach(resp, function(element) {
          $scope.packages.push({
              id: element._id,
              name: element.name,
              placeholder: element.city + ' - ' + element.country + ' - ' + element.beach
          });
      });
    }, function() {

    })
  };

  loadPackages();
};
