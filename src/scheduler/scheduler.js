(function () {

    angular
        .module('scheduler', ['settings', 'process', 'cpu', 'memory-manager', 'memory', 'linked-list', 'double-linked-list', 'merge-fit'])
        .service('scheduler', scheduler)
        .controller('SchedulerCtrl', SchedulerCtrl);

    function scheduler($timeout, $interval, settings, Process, CPU, PROCESS_STATUS, METHODS, ONE_SECOND,
                       MEMORY_ALGORITHMS, MemoryManagerBestFit, Memory, MemoryManagerQuickFit, MemoryManagerMergeFit,
                       DoubleLinkedList, LinkedList) {
        var CPUs = [],
            processes = [],
            terminatedOrAbortedProcesses = [],
            targetPriority = 0,
            memoryManager,
            factors = [3, 2, 1, 0];

        return {
            build() {
                clearScheduler();
                buildMemoryManager();
                buildCPUs();
                buildProcesses();
                buildFactors();
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
            getMemoryManager() {
                return memoryManager;
            },
            getTerminatedAndAbortedProcesses() {
                return terminatedOrAbortedProcesses;
            },
            addProcess(process) {
                switch (settings.getMethod()) {
                    case METHODS.LTG:
                        addProcessForLTG(process);
                        break;
                    case METHODS.ROUND_ROBIN:
                        addProcessForRoundRobin(process);
                        break;
                }
            },
            scheduleProcess(cpu, process) {
                switch (settings.getMethod()) {
                    case METHODS.LTG:
                        scheduleProcessForLTG(cpu, process);
                        break;
                    case METHODS.ROUND_ROBIN:
                        scheduleProcessForRoundRobin(cpu, process);
                        break;
                }
            },
            getTargetPriority() {
                return targetPriority;
            },
            clearScheduler() {
                clearScheduler();
            },
            run() {
                if (settings.getMethod() === METHODS.LTG) {
                    startProcessesLifeCycle();
                }
                initialSchedule.bind(this)();
            },
            nextProcess() {
                if (_.isEmpty(processes)) {
                    return null;
                }

                switch (settings.getMethod()) {
                    case METHODS.LTG:
                        return nextProcessForLTG();
                        break;
                    case METHODS.ROUND_ROBIN:
                        return nextProcessForRoundRobin();
                        break;
                }
            },
            addAbortedProcess(process) {
                addAbortedProcess(process);
            },
            addTerminatedProcess(process) {
                addTerminatedProcess(process);
            }
        };

        function buildMemoryManager() {
            const memory = new Memory(settings.getMemorySize(), new LinkedList());
            switch (settings.getMemoryAlgorithm()) {
                case MEMORY_ALGORITHMS.BEST_FIT:
                    memoryManager = new MemoryManagerBestFit(memory);
                    break;
                case MEMORY_ALGORITHMS.QUICK_FIT:
                    memoryManager = new MemoryManagerQuickFit(memory, settings.getNumberOfLists(), settings.getRequestsInterval());
                    break;
                case MEMORY_ALGORITHMS.MERGE_FIT:
                    memoryManager = new MemoryManagerMergeFit(new Memory(settings.getMemorySize(), new DoubleLinkedList()));
                    break;
            }
        }

        function initialSchedule() {
            _.each(CPUs, (cpu) => {
                switch (settings.getMethod()) {
                    case METHODS.LTG:
                        scheduleProcessForLTG(cpu, nextProcessForLTG());
                        break;
                    case METHODS.ROUND_ROBIN:
                        scheduleProcessForRoundRobin(cpu, nextProcessForRoundRobin());
                        break;
                }
            });
        }

        function addAbortedProcess(process) {
            process.setStatus(PROCESS_STATUS.ABORTED);
            terminatedOrAbortedProcesses.push(process);
        }

        function addTerminatedProcess(process) {
            if (!process) {
                return;
            }
            process.setStatus(PROCESS_STATUS.TERMINATED);
            return terminatedOrAbortedProcesses.push(process);
        }

        function nextPriority() {
            var nextPriority = targetPriority++;

            if (nextPriority === processes.length - 1) {
                targetPriority = 0;
            }

            return nextPriority;
        }

        function nextProcessForLTG() {
            var nextProcess = processes.shift();

            if (nextProcess) {
                settings.setNumberOfProcesses(settings.getNumberOfProcesses() - 1);
            }

            return nextProcess;
        }

        function nextProcessForRoundRobin() {
            var nextProcess = processes[nextPriority()].shift();

            if (nextProcess) {
                settings.setNumberOfProcesses(settings.getNumberOfProcesses() - 1);
            } else {
                let processesIsEmpty = _.every(processes, (processesByPriority) => processesByPriority.length === 0);

                if (!processesIsEmpty) {
                    return nextProcessForRoundRobin();
                }
            }

            return nextProcess;
        }

        function buildCPUs() {
            for (let i = 0; i < settings.getNumberOfCPUs(); i++) {
                CPUs.push(new CPU());
            }
        }

        function buildProcesses() {
            switch (settings.getMethod()) {
                case METHODS.LTG:
                    buildProcessesForLTG();
                    break;
                case METHODS.ROUND_ROBIN:
                    buildProcessesForRoundRobin();
                    break;
            }
        }

        function buildFactors() {
            if (settings.getMethod() === METHODS.ROUND_ROBIN) {
                for (let i = 0; i < 4; i++) {
                    factors[i] = parseFloat(Math.random().toFixed(1));
                }

                factors = _.sortBy(factors, (f) => -f);
            }
        }

        function addProcessForLTG(process) {
            _addInOrder(process);
            settings.setNumberOfProcesses(settings.getNumberOfProcesses() + 1);
            process.startLifeCycle();
        }

        function addProcessForRoundRobin(process) {
            let quantum = settings.getQuantum() + factors[process.priority];
            process.setQuantum(quantum);
            processes[process.priority].push(process);
            settings.setNumberOfProcesses(settings.getNumberOfProcesses() + 1);
        }

        function scheduleProcessForLTG(cpu, process) {
            cpu.setProcess(process);
        }

        function scheduleProcessForRoundRobin(cpu, process) {
            let block;

            try {
                block = memoryManager.allocate(process.getBytes());
                cpu.setProcess(process);
                process.setBlockMemory(block);
                block.setProcess(process);
            } catch (error) {
                if (error.message.match(/OutOfMemory/)) {
                    console.error(`Out of memory. Process #${process.id} requested ${process.getBytes()} bytes. Aborting...`);
                    addAbortedProcess(process);
                    return;
                }
            }

            var executionTimeout = $timeout(() => {
                if (cpu.process) {
                    var releasedProcess = cpu.releaseProcess();

                    if (!releasedProcess) {
                        return;
                    }

                    memoryManager.free(releasedProcess.getBlockMemory());

                    if (releasedProcess.timeLeft === 0) {
                        addTerminatedProcess(releasedProcess);
                    } else {
                        addProcessForRoundRobin(releasedProcess);
                    }
                }
            }, process.quantum * ONE_SECOND);

            var interval = $interval(() => {
                if (process.timeLeft === 0) {
                    $timeout.cancel(executionTimeout);
                    $interval.cancel(interval);
                    const releasedProcess = cpu.releaseProcess();
                    if (releasedProcess) {
                        memoryManager.free(releasedProcess.getBlockMemory());
                        addTerminatedProcess(releasedProcess);
                    }
                }
            }, 100, process.quantum * ONE_SECOND);
        }

        function buildProcessesForLTG() {
            for (let i = 0; i < settings.getNumberOfProcesses(); i++) {
                _addInOrder(new Process());
            }
        }

        function buildProcessesForRoundRobin() {
            for (let i = 0; i < settings.getNumberOfProcesses(); i++) {
                let process = new Process();
                let quantum = settings.getQuantum() + factors[process.priority];

                process.setQuantum(quantum);

                processes[process.priority] = processes[process.priority] || [];

                processes[process.priority].push(process);
            }

            for (let i = 0; i < processes.length; i++) {
                processes[i] = processes[i] || [];
            }
        }


        function clearScheduler() {
            CPUs = [];
            processes = [];
            terminatedOrAbortedProcesses = [];
            memoryManager = null;
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

    function SchedulerCtrl($scope, $interval, scheduler, settings, Process, EVENTS, METHODS, MEMORY_ALGORITHMS) {
        scheduler.build();

        $scope.scheduler = scheduler;
        $scope.settings = settings;
        $scope.METHODS = METHODS;
        $scope.MEMORY_ALGORITHMS = MEMORY_ALGORITHMS;

        $scope.runScheduler = runScheduler;
        $scope.resetScheduler = resetScheduler;
        $scope.addNewProcess = addNewProcess;

        function runScheduler() {
            $scope.scheduler.run();

            if (settings.getMethod() === METHODS.LTG) {
                $interval(abortNextProcessIfDeadlineIsZero, 0);
                subscribeProcessDoneEvent();
            } else if (settings.getMethod() === METHODS.ROUND_ROBIN) {
                subscribeEmptyCPUEvent();
            }
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
                        scheduler.scheduleProcess(cpu, nextProcess);
                    }
                }
            });
        }

        function subscribeEmptyCPUEvent() {
            $scope.$on(EVENTS.EMPTY_CPU, (event, cpu) => {
                var nextProcess = scheduler.nextProcess();

                if (nextProcess) {
                    scheduler.scheduleProcess(cpu, nextProcess);
                }
            });
        }
    }

})();