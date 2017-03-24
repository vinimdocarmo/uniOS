(function () {

    angular
        .module('scheduler', ['settings', 'process'])
        .service('scheduler', scheduler)
        .controller('SchedulerCtrl', SchedulerCtrl);

    function scheduler(settings, Process) {
        var CPUs, processes;

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
            addProcess(process) {
                _addInOrder(process);
                settings.setNumberOfProcesses(settings.getNumberOfProcesses() + 1);
            },
            clearScheduler() {
                clearScheduler();
            }
        };

        function buildCPUs() {
            for (let i = 0; i < settings.getNumberOfCPUs(); i++) {
                CPUs.push(i);
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
        }

        function _addInOrder(process) {
            var sortedIndex = _.sortedIndex(processes, process, function (proc) {
                return proc.deadline;
            });

            processes.splice(sortedIndex, 0, process);
        }
    }

    function SchedulerCtrl($scope, scheduler, Process) {
        scheduler.build();

        $scope.scheduler = scheduler;

        $scope.runScheduler = runScheduler;
        $scope.resetScheduler = resetScheduler;
        $scope.addNewProcess = addNewProcess;

        function runScheduler() {
        }

        function resetScheduler() {
            $scope.scheduler.build();
        }

        function addNewProcess() {
            scheduler.addProcess(new Process());
        }
    }

})();