(function () {

    angular
        .module('scheduler', ['settings', 'process', 'cpu'])
        .service('scheduler', scheduler)
        .controller('SchedulerCtrl', SchedulerCtrl);

    function scheduler(settings, Process, CPU) {
        var CPUs = [],
            processes = [],
            terminatedProcesses = [];

        return {
            build() {
                clearScheduler();
                buildCPUs();
                buildProcesses();
            },
            getSettings () {
                return settings;
            },
            getCPUs() {
                return CPUs;
            },
            getProcesses() {
                return processes;
            },
            getTerminatedProcesses() {
                return terminatedProcesses;
            },
            addProcess(process) {
                _addInOrder(process);
                process.startLifeCycle();
                settings.setNumberOfProcesses(settings.getNumberOfProcesses() + 1);
            },
            clearScheduler() {
                clearScheduler();
            },
            run() {
                startProcessesLifeCycle();
            },
            nextProcess () {
                if (_.isEmpty(processes)) {
                    return null;
                }
                settings.setNumberOfProcesses(settings.getNumberOfProcesses() - 1);
                return processes.shift();
            },
            addTerminatedProcess(process) {
                return terminatedProcesses.push(process);
            }
        };

        function buildCPUs() {
            for (let i = 0; i < settings.getNumberOfCPUs(); i++) {
                CPUs.push(new CPU());
            }
        }

        function buildProcesses() {
            for (let i = 0; i < settings.getNumberOfProcesses(); i++) {
                _addInOrder(new Process());
            }
        }

        function clearScheduler() {
            CPUs = [];
            processes = [];
            terminatedProcesses = [];
        }

        function _addInOrder(process) {
            var sortedIndex = _.sortedIndex(processes, process, function (proc) {
                return proc.deadline;
            });

            processes.splice(sortedIndex, 0, process);
        }

        function startProcessesLifeCycle() {
            _.each(processes, (process) => process.startLifeCycle());
        }
    }

    function SchedulerCtrl($scope, $interval, scheduler, Process, EVENTS) {
        scheduler.build();

        $scope.scheduler = scheduler;

        $scope.runScheduler = runScheduler;
        $scope.resetScheduler = resetScheduler;
        $scope.addNewProcess = addNewProcess;

        function runScheduler() {
            subscribeEmptyCPUEvent();
            subscribeProcessDoneEvent();
            $scope.scheduler.run();
            $interval(abortNextProcessIfDeadlineIsZero, 0);
        }

        function abortNextProcessIfDeadlineIsZero() {
            var nextProcess = _.first(scheduler.getProcesses());

            if (nextProcess && nextProcess.deadline === 0) {
                scheduler.addTerminatedProcess(scheduler.nextProcess());
            }
        }

        function resetScheduler() {
            $scope.scheduler.build();
        }

        function addNewProcess() {
            scheduler.addProcess(new Process());
        }

        function subscribeEmptyCPUEvent() {
            $scope.$on(EVENTS.EMPTY_CPU, (event, cpu) => {
                event.stopPropagation();
                var nextProcess = scheduler.nextProcess();
                if (nextProcess) {
                    cpu.setProcess(nextProcess);
                }
            });
        }

        function subscribeProcessDoneEvent() {
            $scope.$on(EVENTS.PROCESS_DONE, (event, terminatedProcess) => {
                event.stopPropagation();
                scheduler.addTerminatedProcess(terminatedProcess);
            });
        }
    }

})();