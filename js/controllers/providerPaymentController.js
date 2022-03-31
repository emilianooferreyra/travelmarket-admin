angular.module('providerPaymentController', ['store-factories']);

function ProviderPaymentListController($scope, rest, $window, usSpinnerService, modelFactory) {
  usSpinnerService.spin('spinner');
  $scope.module = 'providerpayments';
  $scope.paginate = {
    page: 1,
    skip: 0,
    limit: 99999999,
    countTotal: 0,
    orderBy: 'createdAt',
    populate: 'provider,sale',
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
      console.log(resp)
      resp.map((each)=>{
        if( each.sale ){
          rest().get({
            type: 'clients',
            params: '_id='+each.sale.client
          },function(client){
            console.log(client)
            if (client){
              return each.sale.client = client[0]
            }
          })
        }
      })
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
        alert('Hubo un error al eliminar el pago al proveedor.');
        usSpinnerService.stop('spinner');
      });
    }
  };

  $scope.paging = function(event, page, pageSize, total) {
    var skip = (page - 1) * $scope.paginate.limit;
    $scope.paginate.page = page;
    if (!!$scope.searchField && !!$scope.searchField.name) {
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

    $scope.paginate.conditions = conditions;

    conditions += 'orderBy=' + $scope.paginate.orderBy + '&populate=' + $scope.paginate.populate + '&sort=-1&skip=' + skip_pg + '&limit=' + $scope.paginate.limit;

    modelFactory.countProvider($scope.module, function(resp) {
      $scope.paginate.countTotal = resp;
    }, conditions);

    modelFactory.findProvider({type: $scope.module, conditions }, function(resp) {
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

function ProviderPaymentViewController($scope, $routeParams, rest, $location, $sce, usSpinnerService, $rootScope, $anchorScroll) {
  usSpinnerService.spin('spinner');
  $scope.module = 'providerpayments';
  $scope.configCkeditor = {
    height: 200
  }

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module,
      params: 'populate=provider,sale,notes'
    }, function(resp) {
      $scope.info = resp;

      rest().get({
        type: 'pays',
        params: 'providerpayment=' + resp._id
      }, function(pays) {
        $scope.info.pays = pays;
        rest().get({
          type: 'clients',
          params: '_id='+resp.sale.client
        },function(client){
          $scope.info.sale.client = client[0]
        })
      })

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
        alert('Hubo un error al eliminar el pago al proveedor.');
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
      providerpaymentid: $scope.info._id
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
        alert('Hubo un error al eliminar la nota.');
        usSpinnerService.stop('spinner');
      });
    }
  };
};

function ProviderPaymentCreateController($scope, rest, $location, $rootScope, usSpinnerService) {
  $scope.module = 'providerpayments';
  $scope.info = {};
  $scope.today = moment().format('DD-MM-YYY');

  $scope.save = function() {

    usSpinnerService.spin('spinner');
    var data = {
      sale: $scope.info.sale._id,
      provider: $scope.info.provider,
      date: $scope.info.date,
      currency: $scope.info.currency,
      total: $scope.info.total,
      description: $scope.info.description,
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
              placeholder: element.name + ' - ' + element.cuit
          });
      });
    }, function() {

    })
  };

  loadProviders();

  var loadSales = function() {
    $scope.configSale = {
        //create: true,
        openOnFocus: true,
        valueField: 'id',
        labelField: 'placeholder',
        placeholder: 'Venta',
        maxItems: 1,
        searchField: ['name'],
        // plugins: ['remove_button'],
        onItemAdd: function (value, $item) {
          rest().findOne({
            id: value,
            type: 'sales',
            params: 'populate=client,package'
          }, function(resp) {
            $scope.info.sale = resp;

            if (!!resp.date) {
                $scope.info.sale.date = moment($scope.info.sale.date, 'YYYY-MM-DD').format('DD-MM-YYYY').slice(0, 10)
            }

            usSpinnerService.stop('spinner');
          }, function(error) {
            $scope.info.sale = {};
            usSpinnerService.stop('spinner');
          });
        }
    };
    $scope.sales = [];

    rest().get({
      type: 'sales',
      params: 'populate=client,package&limit=99999999999'
    }, function(resp) {
      angular.forEach(resp, function(element) {
          $scope.sales.push({
              id: element._id,
              name: element.code,
              placeholder: element.code
          });
      });
    }, function() {

    })
  };

  loadSales();
};

function ProviderPaymentEditController($scope, $routeParams, $location, rest, $rootScope, usSpinnerService) {
  usSpinnerService.spin('spinner');
  $scope.module = 'providerpayments';
  $scope.info = {};

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module,
      params: 'populate=sale'
    }, function(resp) {
      $scope.info = resp;
      $scope.info.code = resp.sale.code;
      rest().findOne({
        id: resp.sale._id,
        type: 'sales',
        params: 'populate=client'
      }, function(sale) {
        $scope.info.sale = sale
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
      sale: $scope.info.sale._id,
      provider: $scope.info.provider,
      date: $scope.info.date,
      currency: $scope.info.currency,
      total: $scope.info.total,
      description: $scope.info.description,
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
              placeholder: element.name + ' - ' + element.cuit
          });
      });
    }, function() {

    })
  };

  loadProviders();

  var loadSales = function() {
    $scope.configSale = {
        //create: true,
        openOnFocus: true,
        valueField: 'id',
        labelField: 'placeholder',
        placeholder: 'Venta',
        maxItems: 1,
        searchField: ['name'],
        // plugins: ['remove_button'],
        onItemAdd: function (value, $item) {
          rest().findOne({
            id: value,
            type: 'sales',
            params: 'populate=client,package'
          }, function(resp) {
            $scope.info.sale = resp;

            if (!!resp.date) {
                $scope.info.sale.date = moment($scope.info.sale.date, 'YYYY-MM-DD').format('DD-MM-YYYY').slice(0, 10)
            }

            usSpinnerService.stop('spinner');
          }, function(error) {
            $scope.info.sale = {};
            usSpinnerService.stop('spinner');
          });
        }
    };
    $scope.sales = [];

    rest().get({
      type: 'sales',
      params: 'populate=client,package&limit=99999999999'
    }, function(resp) {
      angular.forEach(resp, function(element) {
          $scope.sales.push({
              id: element._id,
              name: element.code,
              placeholder: element.code
          });
      });
    }, function() {

    })
  };

  loadSales();
};
