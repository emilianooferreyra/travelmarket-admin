(function (window, angular) {
    angular.module('model-factories', [])

    .factory('modelFactory', ModelFactory);

    function ModelFactory(rest, usSpinnerService, $window, $location) {
      var model = {
        count,
        search,
        findClient,
        findProvider,
        countClient,
        countProvider
      }

      return model;

      function count(type, callback, params) {
        rest().count({
          type: type,
          params: (!!params) ? params : ''
        }, function(resp) {
          if(!!callback)
              callback(resp.count);
        });
      };

      function search(element, callback) {
        console.log(element.conditions);
        rest().get({
            type: element.type,
            params: element.conditions//pm + "orderBy="+orderBy+"&sort="+ sort + conditions
        }, function(resp) {
            if(!!callback)
                callback(resp);
        }, function(error) {
            // if(!!callback)
            //     callback(false);
        });
      }

      function findClient(element, callback) {
        console.log(element.conditions);
        rest().getClient({
            type: element.type,
            params: element.conditions//pm + "orderBy="+orderBy+"&sort="+ sort + conditions
        }, function(resp) {
            if(!!callback)
                callback(resp);
        }, function(error) {
            // if(!!callback)
            //     callback(false);
        });
      }

      function countClient(type, callback, params) {
        rest().countClient({
          type: type,
          params: (!!params) ? params : ''
        }, function(resp) {
          if(!!callback)
              callback(resp.count);
        });
      };

      function findProvider(element, callback) {
        console.log(element.conditions);
        rest().getProvider({
            type: element.type,
            params: element.conditions//pm + "orderBy="+orderBy+"&sort="+ sort + conditions
        }, function(resp) {
            if(!!callback)
                callback(resp);
        }, function(error) {
            // if(!!callback)
            //     callback(false);
        });
      }

      function countProvider(type, callback, params) {
        rest().countProvider({
          type: type,
          params: (!!params) ? params : ''
        }, function(resp) {
          if(!!callback)
              callback(resp.count);
        });
      };
    };
})(window, window.angular);
