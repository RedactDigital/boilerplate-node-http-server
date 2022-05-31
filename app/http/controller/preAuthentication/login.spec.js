require('../../../../globals');
const request = require('supertest');
const makeApp = require(`${root}/app/app`);
const app = makeApp();

describe('POST /login', () => {
  let res;

  describe('given the the correct email and password and verified account', () => {
    test('should respond with a 200 status code', async () => {
      res = await request(app).post('/login').send({ email: 'jondoe@test.com', password: 'password' });
      expect(res.statusCode).toBe(200);
    });

    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with a user token', async () => {
      expect(res.body.token).toBeDefined();
    });

    test('should respond WITHOUT password', async () => {
      expect(res.body.user.password).toBeUndefined();
    });

    test('should respond with the user object', async () => {
      expect(res.body.user).toBeDefined();
    });
  });

  describe('given a valid phone number and password with an unverified account', () => {
    test('should respond with a 401 status code', async () => {
      res = await request(app).post('/login').send({ email: 'unverified@test.com', password: 'password' });
      expect(res.statusCode).toBe(401);
    });

    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message).toEqual(expect.stringContaining('User is not verified'));
    });
  });

  describe('given no data', () => {
    test('should respond with a 400 status code', async () => {
      res = await request(app).post('/login').send();
      expect(res.statusCode).toBe(400);
    });

    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message).toBeDefined();
    });
  });

  describe('given a phone number and wrong password', () => {
    test('should respond with a 401 status code', async () => {
      res = await request(app).post('/login').send({ phone: '5553555555', password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message).toEqual(expect.stringContaining('Invalid email/phone or password'));
    });
  });

  describe('given an email and wrong password', () => {
    test('should respond with a 401 status code', async () => {
      res = await request(app).post('/login').send({ email: 'jondoe@test.com', password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message).toEqual(expect.stringContaining('Invalid email/phone or password'));
    });
  });
});
