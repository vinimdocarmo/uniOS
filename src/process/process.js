(function () {

    var id = 0;

    angular
        .module('process', [])
        .service('Process', Process);

    function Process() {
        function Process() {
            this.id = ++id;
            this.executionTime = _.random(4, 20);
            this.timeLeft = 0;
            this.priority = _.random(0, 3);
            this.deadline = _.random(4, 20);
        }

        return Process;
    }

})();