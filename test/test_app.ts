import tap from 'tap';

const build = require('../src/app');

tap.test('GET `/` route', (t) => {
  t.plan(3);

  const fastify = build();

  t.teardown(() => fastify.close());

  fastify.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err: Error, response: any) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers['content-type'], 'text/html; charset=utf-8');
    }
  );
});

tap.test('GET `/:post` post', (t) => {
  t.plan(3);

  const fastify = build();

  t.teardown(() => fastify.close());

  fastify.inject(
    {
      method: 'GET',
      url: '/1',
    },
    (err: Error, response: any) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers['content-type'], 'text/html; charset=utf-8');
    }
  );
});
