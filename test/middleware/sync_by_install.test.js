'use strict';

const request = require('supertest');
const app = require('../../servers/registry');
const mm = require('mm');

describe('test/middleware/sync_by_install.test.js', () => {
  afterEach(mm.restore);

  it('should ignore sync on install private scoped package', done => {
    request(app.listen())
    .get('/@cnpmtest/foo')
    .set('User-Agent', 'node/v4.4.4')
    .expect({
      error: 'not_found',
      reason: 'document not found',
    })
    .expect(404, done);
  });

  it('should sync and redirect to npmjs.com on install public scoped package', done => {
    request(app.listen())
    .get('/@jkroso/type')
    .set('User-Agent', 'node/v4.4.4')
    .expect('Location', 'https://registry.npmjs.com/@jkroso/type')
    .expect(302, done);
  });
});
