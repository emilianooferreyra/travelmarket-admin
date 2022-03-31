angular
        .module('homeController', ['authentication-service']);

function HomeController(AuthenticationService, $location, $scope) {
    
}
;

function LoginController($location, AuthenticationService, $scope, $rootScope) {
    $scope.login = login;
    
    (function initController() {
        sessionStorage.setItem('logged', false);
        // reset login status
        AuthenticationService.ClearCredentials();
    })();

    function login() {
        var vm = $scope.vm;

            var data = {
                username: vm.username,
                password: vm.password
            };
            
            vm.dataLoading = true;
            AuthenticationService.Login(data, function(response) {
                if (response.message == 'ok') {
                    AuthenticationService.SetCredentials(vm.username, vm.password, response.token);//, response.data.user);
                    sessionStorage.setItem('logged', true);
                    $location.path('/');
                } else {
                    alert(response.message);
                    vm.password = '';
                    vm.dataLoading = false;
                    
                    sessionStorage.removeItem('logged');
                }
            });
    }
    ;
}