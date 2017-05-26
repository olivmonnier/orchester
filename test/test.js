var expect = chai.expect;
var should = chai.should();

describe('Test', function() {
  it('run', function() {
    var n = 0;
    var orchester = Orchester.run({
      basename: 'Test bdd',
      interval: 10000,
      adapters: {
        'adapter1': {
          get: function(res) {
            //console.log(res, this)
          }
        },
        'adapter2': {
          get: function(res) {
            var self = this;

            this.resources.put({
              name: 'test' + n,
              repositoryId: res.id
            }).then(function() {
              n++;
            })
          },
          post: function(type, res) {
            //console.log('POST Event', res)
          },
          remove: function(type, res) {
            //console.log('DELETE Event', type, res);
          }
        }
      }
    });

    /*orchester.repositories.put({
      name: 'Repo 1',
      adapter: 'adapter1',
      synced: true
    });
    orchester.repositories.put({
      name: 'Repo 2',
      adapter: 'adapter2',
      synced: true
    });
    orchester.repositories.put({
      name: 'Repo 3',
      adapter: 'adapter2',
      synced: true
    }).then((res) => {
      orchester.repositories.remove(res.id)
    });*/
  })
});
