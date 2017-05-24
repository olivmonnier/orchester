var expect = chai.expect;
var should = chai.should();

describe('Test', function() {
  it('run', function() {
    var orchester = Orchester.run({
      basename: 'Test bdd',
      interval: 10000,
      adapters: {
        'adapter1': {
          get: function(res) {
            console.log(res, this)
          }
        },
        'adapter2': {
          get: function(res) {
            console.log(res)
          }
        }
      }
    });

    orchester.repositories.put({
      name: 'Repo 1',
      adapter: 'adapter1',
      synced: true
    });
    orchester.repositories.put({
      name: 'Repo 2',
      adapter: 'adapter2',
      synced: true
    });
  })
});
