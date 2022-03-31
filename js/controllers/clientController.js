angular.module('clientController', ['store-factories']);

function ClientListController($scope, rest, $window, usSpinnerService, modelFactory) {
  usSpinnerService.spin('spinner');
  $scope.module = 'clients';
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
      name: 'Apellido y nombre', //placeholder filter
      model: $scope.module, //model filter, usually same model
      key: 'name', //attribute on model filter
      type: 'text',
      like: true
    }, {
      name: 'DNI',
      model: $scope.module,
      key: 'dni',
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
        alert('Hubo un error al eliminar el cliente.');
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

function ClientViewController($scope, $routeParams, rest, $location, $sce, usSpinnerService, $rootScope, $anchorScroll) {
  usSpinnerService.spin('spinner');
  $scope.module = 'clients';
  $scope.configCkeditor = {
    height: 200
  }

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module,
      // params: 'populate=notes'
    }, function(resp) {
      $scope.info = resp;

      if (!!resp.birth) {
          $scope.info.birth = $scope.info.birth ? moment($scope.info.birth).utc().toISOString().slice(0, 10) : null;
      }

      for (note in $scope.info.notes) {
        $scope.info.notes[note] = rest().findOne({
          type: 'notes',
          id: $scope.info.notes[note],
          params: 'populate=user'
        });
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
        alert('Hubo un error al eliminar el cliente.');
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
      clientid: $scope.info._id
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
        alert('Hubo un error al eliminar el cliente.');
        usSpinnerService.stop('spinner');
      });
    }
  };
};

function ClientCreateController($scope, rest, $location, $rootScope, usSpinnerService) {
  $scope.module = 'clients';
  $scope.info = {};
  $scope.today = moment().format('DD-MM-YYY');

  $scope.save = function() {

    usSpinnerService.spin('spinner');
    var data = {
      name: $scope.info.name,
      dni: $scope.info.dni,
      birth: moment($scope.info.birth, 'DD-MM-YYYY').utc().toISOString().slice(0, 10),
      cuit: $scope.info.cuit,
      phone: $scope.info.phone,
      mail: $scope.info.mail,
      address: $scope.info.address,
      // notes: $scope.info.notes
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
};

function ClientEditController($scope, $routeParams, $location, rest, $rootScope, usSpinnerService) {
  usSpinnerService.spin('spinner');
  $scope.module = 'clients';
  $scope.info = {};

  var loadModel = function() {
    rest().findOne({
      id: $routeParams.id,
      type: $scope.module
    }, function(resp) {
      $scope.info = resp;
      if (!!resp.birth) {
          $scope.info.birth = moment($scope.info.birth, 'YYYY-MM-DD').format('DD-MM-YYYY').slice(0, 10)
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
      name: $scope.info.name,
      dni: $scope.info.dni,
      birth: moment($scope.info.birth, 'DD-MM-YYYY').utc().toISOString().slice(0, 10),
      cuit: $scope.info.cuit,
      phone: $scope.info.phone,
      mail: $scope.info.mail,
      address: $scope.info.address,
      // notes: $scope.info.notes
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
};
