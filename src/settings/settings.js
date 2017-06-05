(function () {

    angular
        .module('settings', [])
        .constant('ONE_SECOND', 1000)
        .constant('METHODS', {
            ROUND_ROBIN: 'ROUND_ROBIN',
            LTG: 'LTG'
        })
        .constant('MEMORY_ALGORITHMS', {
            BEST_FIT: 'BEST_FIT',
            QUICK_FIT: 'QUICK_FIT',
            MERGE_FIT: 'MERGE_FIT',
        })
        .controller('SettingsCtrl', SettingsCtrl)
        .service('settings', settings);

    function settings(METHODS, MEMORY_ALGORITHMS) {
        var numberOfCPUs = 4,
            numberOfProcesses = 10,
            method = METHODS.ROUND_ROBIN,
            memorySize = 5000,
            numberOfLists = 2,
            requestsInterval = 10,
            memoryAlgorithm = MEMORY_ALGORITHMS.BEST_FIT,
            quantum = 4;

        return {
            setNumberOfCPUs(_numberOfCPUs_) {
                numberOfCPUs = _numberOfCPUs_;
                return this;
            },
            setNumberOfProcesses(_numberOfProcesses_) {
                numberOfProcesses = _numberOfProcesses_;
                return this;
            },
            setMemorySize(size) {
                memorySize = size;
                return this;
            },
            setRequestsInterval(interval) {
                requestsInterval = interval;
                return this;
            },
            setNumberOfLists(_numberOfLists_) {
                numberOfLists = _numberOfLists_;
                return this;
            },
            setNumberOfQuantum(_numberOfQuantum_) {
                quantum = _numberOfQuantum_;
                return this;
            },
            setMemoryAlgorithm(_memoryAlgorithm_) {
                memoryAlgorithm = _memoryAlgorithm_;
                return this;
            },
            setMethod(_method_) {
                method = _method_;
                return this;
            },
            getNumberOfCPUs() {
                return numberOfCPUs;
            },
            getRequestsInterval() {
                return requestsInterval;
            },
            getNumberOfLists() {
                return numberOfLists;
            },
            getNumberOfProcesses() {
                return numberOfProcesses;
            },
            getQuantum() {
                return quantum;
            },
            getMemorySize() {
                return memorySize;
            },
            getMemoryAlgorithm() {
                return memoryAlgorithm;
            },
            getMethod() {
                return method;
            },
            toString() {
                return `
                method: ${method}
                memory algorithm: ${memoryAlgorithm}
                memory size: ${memorySize} bytes
                number of lists: ${numberOfLists}
                requests interval: ${requestsInterval}
                number of CPUs: ${numberOfCPUs}
                number of quantum: ${quantum}
                number of processes: ${numberOfProcesses}`;
            }
        };
    }

    function SettingsCtrl($scope, settings, METHODS, MEMORY_ALGORITHMS) {
        $scope.METHODS = METHODS;
        $scope.MEMORY_ALGORITHMS = MEMORY_ALGORITHMS;
        $scope.numberOfCPUs = settings.getNumberOfCPUs();
        $scope.method = settings.getMethod();
        $scope.numberOfProcesses = settings.getNumberOfProcesses();
        $scope.numberOfQuantum = settings.getQuantum();
        $scope.memorySize = settings.getMemorySize();
        $scope.numberOfLists = settings.getNumberOfLists();
        $scope.requestsInterval = settings.getRequestsInterval();
        $scope.memoryAlgorithm = settings.getMemoryAlgorithm();

        $scope.saveSettings = saveSettings;

        function saveSettings() {
            settings
                .setNumberOfCPUs($scope.numberOfCPUs)
                .setMethod($scope.method)
                .setNumberOfProcesses($scope.numberOfProcesses)
                .setMemoryAlgorithm($scope.memoryAlgorithm)
                .setMemorySize($scope.memorySize)
                .setNumberOfLists($scope.numberOfLists)
                .setRequestsInterval($scope.requestsInterval)
                .setNumberOfQuantum($scope.numberOfQuantum);
        }
    }

})();