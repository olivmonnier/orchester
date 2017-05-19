var expect = chai.expect;
var should = chai.should();

describe('Test', function() {
  it('run', function() {
    var orchester = Orchester.run({
      basename: 'Test bdd',
      workerPath: 'orchester.worker.js',
      interval: 1
    })
  })
});
