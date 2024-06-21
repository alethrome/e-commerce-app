const { expect } = require('chai');
const sinon = require('sinon'); 
const sandbox = sinon.createSandbox();
const sequelize = require('../src/config/database');

const { OrderItem }= require('../src/models');
const { Product } = require('../src/models');
const { Order } = require('../src/models');
const { createOrder } = require('../src/controllers/orderController');

describe('ORDERS', () => {
    let res;
    
    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
    })
    
    afterEach(() => {
        sinon.restore();
    });

    it('should create order', async () => {
        const req = {
            body: {
                products: [
                    {
                        product_id: 2,
                        quantity: 3
                    },
                    {
                        product_id: 3,
                        quantity: 1
                    }
                ]
            },
            user: { userId: 2 }
        };

        const transaction = {
            commit: sandbox.stub().resolves(),
            rollback: sandbox.stub().resolves()
        };

        sandbox.stub(sequelize, 'transaction').resolves(transaction);

        const findProduct = sandbox.stub(Product, 'findOne');
        const createOrderItem = sandbox.stub(OrderItem, 'create');

        findProduct.onFirstCall().resolves({ price: 200 });
        findProduct.onSecondCall().resolves({ price: 500 });

        sandbox.stub(Order, 'create').resolves({ order_id: 1 });

        createOrderItem.onFirstCall().resolves({ id: 1 });
        createOrderItem.onSecondCall().resolves({ id: 2 });

        await createOrder(req, res);

        expect(transaction.commit.called).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.include({ message: 'Order is successfully placed.' });
        expect(res.json.firstCall.args[0]).to.include({ success:  true });
        expect(res.json.firstCall.args[0]).to.include.keys('order');
    });

    it('should get all orders', async () => {
        const req = {
            user: { userId: 123 }
        };

        sinon.stub(Order, 'findAll').resolves({ orders:[]});
    })
});