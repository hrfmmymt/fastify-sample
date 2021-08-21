'use strict';
const { test } = require('tap');
const request = require('request');
const supertest = require('supertest');

const build = require('../src/app');

test('GET `/` route', (t) => {
  t.plan(3);

  const fastify = build();

  // At the end of your tests it is highly recommended to call `.close()`
  // to ensure that all connections to external services get closed.
  t.teardown(() => fastify.close());

  fastify.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers['content-type'], 'text/html; charset=utf-8');
    }
  );
});

test('GET `/:post` post', (t) => {
  t.plan(3);

  const fastify = build();

  t.teardown(() => fastify.close());

  fastify.inject(
    {
      method: 'GET',
      url: '/1',
    },
    (err, response) => {
      t.error(err);
      t.equal(response.statusCode, 200);
      t.equal(response.headers['content-type'], 'text/html; charset=utf-8');
    }
  );
});
