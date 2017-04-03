(function () {

    angular
        .module('cpu', [])
        .controller('CPUCtrl', CPUCtrl)
        .service('CPU', CPU);

    function CPU() {
        function CPU() {
            this.process = null;
        }

        CPU.prototype.setProcess = function (process) {
            this.process = process;
            this.process.startExecution();
        };

        CPU.prototype.releaseProcess = function () {
            var process = this.process;
            this.process = null;
            return process;
        };

        return CPU;
    }

    function CPUCtrl($scope, $interval, scheduler, EVENTS) {
        $scope.scheduler = scheduler;

        $interval(notifyTerminatedProcess, 100);

        function notifyTerminatedProcess() {
            _.each(scheduler.getCPUs(), (cpu) => {
                if (cpu.process && cpu.process.timeLeft === 0) {
                    $scope.$parent.$emit(EVENTS.PROCESS_DONE, cpu, cpu.releaseProcess());
                }
            });
        }
    }

})();