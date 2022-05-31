require('../../../../globals');
const request = require('supertest');
const makeApp = require(`${root}/app/app`);
const app = makeApp();

describe('POST /register', () => {
  let res;
  const correctUserRequestObject = {
    email: 'register@test.com',
    firstName: 'register',
    lastName: 'test',
    password: 'password',
    phone: '8888889999',
    country: 'US',
  };
  describe('given the user object', () => {
    test('should respond with a 200 status code', async () => {
      res = await request(app).post('/register').send(correctUserRequestObject);
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
      expect(res.body.user).toMatchObject({
        id: expect.any(Number),
        email: 'register@test.com',
        firstName: 'Register',
        lastName: 'Test',
        name: 'Register Test',
        phone: '+1 888 888 9999',
        affiliateSlug: expect.any(String),
      });
    });
  });

  describe('given the user object with no data', () => {
    test('should respond with a 400 status code', async () => {
      res = await request(app).post('/register').send();
      expect(res.statusCode).toBe(400);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message).toBeDefined();
    });
  });

  describe('given the user object with invalid phone number', () => {
    test('should respond with a 400 status code', async () => {
      let invalidUserRequestObject = {
        ...correctUserRequestObject,
      };
      invalidUserRequestObject.phone = '123456789';
      res = await request(app).post('/register').send(invalidUserRequestObject);
      expect(res.statusCode).toBe(400);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message.phone).toEqual(['Invalid phone number']);
    });
  });

  describe('given the user object with invalid email', () => {
    test('should respond with a 400 status code', async () => {
      let invalidUserRequestObject = {
        ...correctUserRequestObject,
      };
      invalidUserRequestObject.email = 'invalidemail';
      res = await request(app).post('/register').send(invalidUserRequestObject);
      expect(res.statusCode).toBe(400);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message.email).toEqual(['The email format is invalid.']);
    });
  });

  describe('given the user object with a password with less than 8 characters', () => {
    test('should respond with a 400 status code', async () => {
      let invalidUserRequestObject = {
        ...correctUserRequestObject,
      };
      invalidUserRequestObject.password = '123';
      res = await request(app).post('/register').send(invalidUserRequestObject);
      expect(res.statusCode).toBe(400);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message.password).toContainEqual(
        expect.stringContaining('The password must be at least 8 characters')
      );
    });
  });

  describe('given the user object with a password with more than 64 characters', () => {
    test('should respond with a 400 status code', async () => {
      let invalidUserRequestObject = {
        ...correctUserRequestObject,
      };
      invalidUserRequestObject.password = require('crypto').randomBytes(65).toString('base64');
      res = await request(app).post('/register').send(invalidUserRequestObject);
      expect(res.statusCode).toBe(400);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message.password).toContainEqual(
        expect.stringContaining('The password may not be greater than 64 characters')
      );
    });
  });

  describe('given the user object with email already registered', () => {
    test('should respond with a 400 status code', async () => {
      res = await request(app).post('/register').send(correctUserRequestObject);
      expect(res.statusCode).toBe(400);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message).toEqual(expect.stringContaining('Email is already registered'));
    });
  });

  describe('given the user object with phone already registered', () => {
    test('should respond with a 400 status code', async () => {
      correctUserRequestObject.email = 'marryjane@test.com'; // change email to force the phone to be checked
      res = await request(app).post('/register').send(correctUserRequestObject);
      expect(res.statusCode).toBe(400);
    });

    // should respond with a json object containing an error message
    test('should specify the content type as application/json', async () => {
      expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    });

    test('should respond with an error message', async () => {
      expect(res.body.message).toEqual(expect.stringContaining('Phone number is already registered'));
    });
  });
});
