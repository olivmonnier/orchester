var expect = chai.expect;
var should = chai.should();

describe('Class Orchester', function() {
  describe('instantiate with no params', function() {
    it('Should be an error', function() {
      expect(Orchester).to.throw(Error);
    });
  });
  describe('instantiate with a basename declared', function() {
    it('Should be an error', function() {
      var o = new Orchester({basename: 'test'});
      var fn = function() { throw o; }

      expect(fn).to.throw(Error);
    })
  });
  describe('instantiate with a basename and workerPath declared', function() {
    it('Should be successful', function() {
      var o = new Orchester({basename: 'test', workerPath: '../dist/orchester.worker.js'});

      expect(o).to.be.instanceof(Orchester);
    })
  })
});
