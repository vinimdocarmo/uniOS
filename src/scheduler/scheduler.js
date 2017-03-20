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
                processes.push(process);
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
                processes.push(new Process());
            }
        }

        function clearScheduler() {
            CPUs = [];
            processes = [];
        }
    }

    function SchedulerCtrl($scope, scheduler) {
        scheduler.build();

        $scope.scheduler = scheduler;

        $scope.runScheduler = runScheduler;
        $scope.resetScheduler = resetScheduler;

        function runScheduler() {
        }

        function resetScheduler() {
            $scope.scheduler.build();
        }
    }

})();