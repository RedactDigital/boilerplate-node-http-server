require('../../../../globals');
const request = require('supertest');
const makeApp = require(`${root}/app/app`);
const app = makeApp();
const { AuthCode } = require(`${root}/app/http/models`);

describe('POST /verify', () => {
  let res;

  describe('when the user is not logged in', () => {
    test('should respond with a 401 status code', async () => {
      res = await request(app).post('/verify');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('when the user is logged in', () => {
    let user;
    describe('given no data', () => {
      test('should respond with a 400 status code', async () => {
        user = await request(app).post('/login').send({ email: 'unverified@test.com', password: 'password' });
        res = await request(app)
          .post('/verify')
          .set({ Authorization: `Bearer ${user.body.token}` })
          .send();
        expect(res.statusCode).toBe(400);
      });

      test('should specify the content type as application/json', async () => {
        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
      });

      test('should respond with an error message', async () => {
        expect(res.body.message.verificationCode).toEqual(['The verificationCode field is required.']);
      });
    });

    describe('given verificationCode as an integer', () => {
      test('should respond with a 400 status code', async () => {
        user = await request(app).post('/login').send({ email: 'unverified@test.com', password: 'password' });
        res = await request(app)
          .post('/verify')
          .set({ Authorization: `Bearer ${user.body.token}` })
          .send({ verificationCode: 111111 });
        expect(res.statusCode).toBe(400);
      });

      test('should specify the content type as application/json', async () => {
        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
      });

      test('should respond with an error message', async () => {
        expect(res.body.message.verificationCode).toEqual(['The verificationCode must be a string.']);
      });
    });

    describe('given user has no verification code', () => {
      test('should respond with a 400 status code', async () => {
        user = await request(app).post('/login').send({ email: 'jondoe@test.com', password: 'password' });
        res = await request(app)
          .post('/verify')
          .set({ Authorization: `Bearer ${user.body.token}` })
          .send({ verificationCode: '111111' });
        expect(res.statusCode).toBe(400);
      });

      test('should specify the content type as application/json', async () => {
        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
      });

      test('should respond with an error message', async () => {
        expect(res.body.message).toEqual('Invalid verification code');
      });
    });

    describe('given verificationCode is invalid', () => {
      test('should respond with a 400 status code', async () => {
        user = await request(app).post('/login').send({ email: 'unverified@test.com', password: 'password' });
        res = await request(app)
          .post('/verify')
          .set({ Authorization: `Bearer ${user.body.token}` })
          .send({ verificationCode: '111111' });
        expect(res.statusCode).toBe(400);
      });

      test('should specify the content type as application/json', async () => {
        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
      });

      test('should respond with an error message', async () => {
        expect(res.body.message).toEqual('Invalid verification code');
      });
    });

    describe('given verificationCode is expired', () => {
      test('should respond with a 400 status code', async () => {
        user = await request(app).post('/login').send({ email: 'unverifiedExpired@test.com', password: 'password' });
        res = await request(app)
          .post('/verify')
          .set({ Authorization: `Bearer ${user.body.token}` })
          .send({ verificationCode: '12345' });
        expect(res.statusCode).toBe(400);
      });

      test('should specify the content type as application/json', async () => {
        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
      });

      test('should respond with an error message', async () => {
        expect(res.body.message).toEqual('Verification code expired, a new code has been sent to your email');
      });
    });

    describe('given verificationCode is valid', () => {
      test('should respond with a 200 status code', async () => {
        user = await request(app).post('/login').send({ email: 'unverified@test.com', password: 'password' });
        res = await request(app)
          .post('/verify')
          .set({ Authorization: `Bearer ${user.body.token}` })
          .send({ verificationCode: '12345' });
        expect(res.statusCode).toBe(200);
      });

      test('should specify the content type as application/json', async () => {
        expect(res.headers['content-type']).toEqual(expect.stringContaining('application/json'));
      });

      test('should respond with a success message', async () => {
        expect(res.body.message).toEqual('Verification successful');
      });

      test('should destroy auth code on success', async () => {
        user = await request(app).post('/login').send({ email: 'unverified@test.com', password: 'password' });
        const authCode = await AuthCode.findOne({ where: { userId: user.body.user.id } });
        expect(authCode).toBeFalsy();
      });

      test('should update the users verifiedAt column', async () => {
        expect(user.body.user.verifiedAt).toBeTruthy();
      });
    });
  });
});
