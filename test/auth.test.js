const { expect } = require('chai');

const app = require('../src/app');

describe('Testing app creation', () => {
    it('App should correctly exported', () => {
        expect(typeof app).to.equal('function')
    })
});