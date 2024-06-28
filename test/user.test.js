const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../src/models');
const { registerUser } = require('../src/controllers/userController.js');
const { loginUser } = require('../src/controllers/authController.js');

describe('USERS', () => {
    let res;
    
    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
    });
    
    afterEach(() => {
        sinon.restore();
    });

    it('should register new user', async () => {
        const req = {
            body: {
              name: 'John Bravo',
              username: 'Buddy',
              password: 'password'
            }
        };

        sinon.stub(bcrypt, 'genSalt').resolves('mockedSalt');
        sinon.stub(bcrypt, 'hash').resolves('mockedHash');

        sinon.stub(User, 'create').resolves(req.body);
        
        await registerUser(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.include({ message: 'User successfully registered.' });
    });

    it('should authenticate user', async () => {
        const req = {
          body: {
            username: 'Buddy',
            password: 'password01'
          }
        };
    
        const user = {
          id: 1,
          username: 'johndoe',
          password: '$2b$10$u6l5sDS9kTs83/x.WP8jEu8FZo5xPz.a0DBM9x/j7iM8nTYCq/1qW'
        };

        sinon.stub(User, 'findOne').resolves(user);
    
        sinon.stub(bcrypt, 'compare').resolves(true);
    
        const token = 'accesstoken';
        sinon.stub(jwt, 'sign').returns(token);
    
        await loginUser(req, res);
    
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.have.keys('message', 'success', 'accessToken');
      });
})