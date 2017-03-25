(function () {

    var id = 0;

    angular
        .module('process', [])
        .service('Process', Process);

    function Process($interval) {
        const ONE_SECOND = 1000;

        function Process() {
            this.id = ++id;
            this.executionTime = _.random(4, 20);
            this.timeLeft = this.executionTime;
            this.priority = _.random(0, 3);
            this.deadline = _.random(4, 20);
        }

        Process.prototype.startLifeCycle = function () {
            $interval(() => this.deadline--, ONE_SECOND, this.deadline);
        };

        Process.prototype.startExecution = function () {
            $interval(() => this.timeLeft--, ONE_SECOND, this.timeLeft);
        };

        return Process;
    }

})();