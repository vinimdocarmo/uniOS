(function () {

    angular
        .module('settings', [])
        .constant('METHODS', {
            ROUND_ROBIN: 'ROUND_ROBIN',
            LTG: 'LTG'
        })
        .controller('SettingsCtrl', SettingsCtrl)
        .service('settings', settings);

    function settings(METHODS) {
        var numberOfCPUs = 4,
            numberOfProcesses = 10,
            method = METHODS.ROUND_ROBIN,
            numberOfQuantum = 4;

        return {
            setNumberOfCPUs(_numberOfCPUs_) {
                numberOfCPUs = _numberOfCPUs_;
                return this;
            },
            setNumberOfProcesses(_numberOfProcesses_) {
                numberOfProcesses = _numberOfProcesses_;
                return this;
            },
            setNumberOfQuantum(_numberOfQuantum_) {
                numberOfQuantum = _numberOfQuantum_;
                return this;
            },
            setMethod(_method_) {
                method = _method_;
                return this;
            },
            getNumberOfCPUs() {
                return numberOfCPUs;
            },
            getNumberOfProcesses() {
                return numberOfProcesses;
            },
            getNumberOfQuantum() {
                return numberOfQuantum;
            },
            getMethod() {
                return method;
            },
            toString() {
                return `
                method: ${method}
                number of CPUs: ${numberOfCPUs}
                number of quantum: ${numberOfQuantum}
                number of processes: ${numberOfProcesses}`;
            }
        };
    }

    function SettingsCtrl($scope, settings, METHODS) {
        $scope.METHODS = METHODS;
        $scope.numberOfCPUs = settings.getNumberOfCPUs();
        $scope.method = settings.getMethod();
        $scope.numberOfProcesses = settings.getNumberOfProcesses();
        $scope.numberOfQuantum = settings.getNumberOfQuantum();

        $scope.saveSettings = saveSettings;

        function saveSettings() {
            settings
                .setNumberOfCPUs($scope.numberOfCPUs)
                .setMethod($scope.method)
                .setNumberOfProcesses($scope.numberOfProcesses)
                .setNumberOfQuantum($scope.numberOfQuantum);

            console.log(settings.toString());
        }
    }

})();