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
            if (!this.process) {
                return null;
            }

            this.process.stopExecution();

            var process = this.process;
            this.process = null;

            return process;
        };

        return CPU;
    }

    function CPUCtrl($scope, $interval, scheduler, EVENTS, METHODS, settings) {
        $scope.scheduler = scheduler;

        if (settings.getMethod() === METHODS.LTG) {
            $interval(notifyTerminatedProcessForRoundRobin, 100);
        } else if (settings.getMethod() === METHODS.ROUND_ROBIN) {
            $interval(notifyEmptyCPU, 100);
        }

        function notifyEmptyCPU() {
            _.each(scheduler.getCPUs(), (cpu) => {
                if (!cpu.process) {
                    $scope.$parent.$emit(EVENTS.EMPTY_CPU, cpu);
                }
            });
        }

        function notifyTerminatedProcessForRoundRobin() {
            _.each(scheduler.getCPUs(), (cpu) => {
                if (cpu.process && cpu.process.timeLeft === 0) {
                    $scope.$parent.$emit(EVENTS.PROCESS_DONE, cpu, cpu.releaseProcess());
                }
            });
        }
    }

})();