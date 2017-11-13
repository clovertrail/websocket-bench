/**
 * Class for display bench result
 */
var DefaultReporter = function (outputStream) {

  this.outputStream = outputStream || process.stdout;

};

DefaultReporter.prototype.report = function (steps, monitor, stopwatch) {

  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];
    this.outputStream.write(step.number + ',' +
                            step.monitor.results.connection + ',' +
                            step.monitor.results.errors + ',' +
                            step.stopwatch.getDuration());
    this.outputStream.write('\n');
  }
};

module.exports = DefaultReporter;
