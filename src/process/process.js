(function () {

    var id = 0;

    angular
        .module('process', [])
        .constant('PROCESS_STATUS', {
            ABORTED: 'ABORTED',
            TERMINATED: 'TERMINATED',
            READY: 'READY',
            RUNNING: 'RUNNING'
        })
        .service('Process', Process);

    function Process($interval, PROCESS_STATUS) {
        const ONE_SECOND = 1000;

        function Process() {
            this.id = ++id;
            this.executionTime = _.random(4, 20);
            this.timeLeft = this.executionTime;
            this.priority = _.random(0, 3);
            this.deadline = _.random(4, 20);
            this.status = PROCESS_STATUS.READY;
        }

        Process.prototype.startLifeCycle = function () {
            $interval(() => this.deadline--, ONE_SECOND, this.deadline);
        };

        Process.prototype.startExecution = function () {
            this.status = PROCESS_STATUS.RUNNING;
            $interval(() => this.timeLeft--, ONE_SECOND, this.timeLeft);
        };

        Process.prototype.setStatus = function (status) {
            this.status = status;
        };

        Process.prototype.getStatus = function () {
            return this.status;
        };

        Process.prototype.isAborted = function () {
            return this.status === PROCESS_STATUS.ABORTED;
        };

        Process.prototype.isTerminated = function () {
            return this.status === PROCESS_STATUS.TERMINATED;
        };

        return Process;
    }

})();