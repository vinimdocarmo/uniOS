(function () {

    angular
        .module('uniOS', ['ngMaterial', 'ui.router', 'scheduler'])
        .constant('EVENTS', {
            EMPTY_CPU: 'EMPTY_CPU',
            PROCESS_DONE: 'PROCESS_DONE'
        })
        .config(function($mdIconProvider, $stateProvider) {
            $mdIconProvider
                .iconSet('action', './src/assets/img/icons/action.svg')
                .iconSet('file', './src/assets/img/icons/file.svg')
                .iconSet('device', './src/assets/img/icons/device.svg')
                .iconSet('content', './src/assets/img/icons/content.svg')
                .iconSet('communication', './src/assets/img/icons/communication.svg')
                .iconSet('editor', './src/assets/img/icons/editor.svg')
                .iconSet('navigation', './src/assets/img/icons/navigation.svg');

            const schedulerState = {
                name: 'scheduler',
                url: '/scheduler',
                templateUrl: 'src/scheduler/scheduler.html'
            };

            const settingsState = {
                name: 'settings',
                url: '/settings',
                templateUrl: 'src/settings/settings.html'
            };

            $stateProvider.state(schedulerState);
            $stateProvider.state(settingsState);
        })
        .controller('uniOSCtrl', function ($scope, $mdSidenav, $mdMedia) {
            $scope.appName = 'uniOS';

            $scope.$mdMedia = $mdMedia;
            $scope.toggleLeft = function() {
                $mdSidenav('left').toggle();
            };
        });

})();
