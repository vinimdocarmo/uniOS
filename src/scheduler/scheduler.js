(function () {

    angular
        .module('scheduler', ['settings', 'process', 'cpu'])
        .service('scheduler', scheduler)
        .controller('SchedulerCtrl', SchedulerCtrl);

    function scheduler(settings, Process, CPU, PROCESS_STATUS) {
        var CPUs = [],
            processes = [],
            terminatedOrAbortedProcesses = [];

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
            getTerminatedAndAbortedProcesses() {
                return terminatedOrAbortedProcesses;
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
                initialSchedule.bind(this)();
            },
            nextProcess () {
                if (_.isEmpty(processes)) {
                    return null;
                }
                settings.setNumberOfProcesses(settings.getNumberOfProcesses() - 1);
                return processes.shift();
            },
            addAbortedProcess(process) {
                process.setStatus(PROCESS_STATUS.ABORTED);
                return terminatedOrAbortedProcesses.push(process);
            },
            addTerminatedProcess(process) {
                process.setStatus(PROCESS_STATUS.TERMINATED);
                return terminatedOrAbortedProcesses.push(process);
            }
        };

        function initialSchedule() {
            var self = this;

            _.each(CPUs, (cpu) => {
                cpu.setProcess(self.nextProcess());
            });
        }

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
            terminatedOrAbortedProcesses = [];
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

    function SchedulerCtrl($scope, $interval, scheduler, settings, Process, EVENTS, METHODS) {
        scheduler.build();

        $scope.scheduler = scheduler;
        $scope.settings = settings;
        $scope.METHODS = METHODS;

        $scope.runScheduler = runScheduler;
        $scope.resetScheduler = resetScheduler;
        $scope.addNewProcess = addNewProcess;

        function runScheduler() {
            subscribeProcessDoneEvent();
            $scope.scheduler.run();
            $interval(abortNextProcessIfDeadlineIsZero, 0);
        }

        function abortNextProcessIfDeadlineIsZero() {
            var nextProcess = _.first(scheduler.getProcesses());

            if (nextProcess && nextProcess.deadline === 0) {
                scheduler.addAbortedProcess(scheduler.nextProcess());
            }
        }

        function resetScheduler() {
            $scope.scheduler.build();
        }

        function addNewProcess() {
            scheduler.addProcess(new Process());
        }

        function subscribeProcessDoneEvent() {
            $scope.$on(EVENTS.PROCESS_DONE, (event, cpu, terminatedProcess) => {
                scheduler.addTerminatedProcess(terminatedProcess);

                var nextProcess = scheduler.nextProcess();

                if (nextProcess) {
                    if (nextProcess.deadline === 0) {
                        scheduler.addAbortedProcess(nextProcess);
                    } else {
                        cpu.setProcess(nextProcess);
                    }
                }
            });
        }
    }

})();