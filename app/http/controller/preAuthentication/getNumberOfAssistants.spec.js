require('../../../../globals');
const request = require('supertest');
const makeApp = require(`${root}/app/app`);
const app = makeApp();

describe('GET /assistant-count', () => {
  let res;

  test('should respond with a 200 status code', async () => {
    res = await request(app).get('/assistant-count');
    expect(res.statusCode).toBe(200);
  });

  test('should specify the content type as application/json', async () => {
    expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
  });

  test('should respond with a number', async () => {
    expect(res.body.data).toBeGreaterThanOrEqual(0);
  });
});
