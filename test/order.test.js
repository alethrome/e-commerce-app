const { expect } = require('chai');
const sinon = require('sinon'); 
const sandbox = sinon.createSandbox();
const sequelize = require('../src/config/database');

const { OrderItem }= require('../src/models');
const { Product } = require('../src/models');
const { Order } = require('../src/models');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../src/controllers/orderController');

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
        sandbox.restore();
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

    it('should handle bad create order request', async () => {
        const req = {
            body: {
                products: [
                    {
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

        sandbox.stub(Order, 'create').resolves({ order_id: 1 });

        await createOrder(req, res);

        expect(res.status.calledWith(400)).to.be.true;
    });

    it('should get all orders', async () => {
        const req = {
            user: { userId: 123 }
        };

        const mockOrder = [
            { order_id: 1, user_id: 123, total_amount: 500 },
            { order_id: 2, user_id: 123, total_amount: 150.75 }
        ];

        const mockOrderItem = [
            { order_id: 1, product_id: 1, quantity: 2 },
            { order_id: 2, product_id: 2, quantity: 3 },
            { order_id: 2, product_id: 4, quantity: 1 }
        ];

        sinon.stub(Order, 'findAll').resolves(mockOrder);
        sinon.stub(OrderItem, 'findAll').resolves(mockOrderItem);

        await getOrders(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.have.key('Orders');
    });

    it('should handle bad get order request', async () => {
        const req = {
            user: { userId: 123 }
        };

        const mockOrder = [
            { order_id: 1, user_id: 123, total_amount: 500 },
            { order_id: 2, user_id: 123, total_amount: 150.75 }
        ];

        const mockOrderItem = [
            { order_id: 1, product_id: 1, quantity: 2 },
            { order_id: 2, product_id: 2, quantity: 3 },
            { order_id: 2, product_id: 4, quantity: 1 }
        ];

        sinon.stub(Order, 'findAll').resolves(mockOrder);
        sinon.stub(OrderItem, 'findAll').resolves(mockOrderItem);

        await getOrders(null, res);

        expect(res.status.calledWith(400)).to.be.true;
    });

    it('should get an order by id', async() => {
        const req = {
            user: { userId: 123 },
            params: { orderId: 3 }
        };

        const mockOrderItem = [
            { order_id: 3, product_id: 1, quantity: 2 },
            { order_id: 3, product_id: 2, quantity: 3 },
            { order_id: 3, product_id: 4, quantity: 1 }
        ];

        sinon.stub(Order, 'findOne').resolves({ order_id: req.params.orderId })
        sinon.stub(OrderItem, 'findAll').resolves(mockOrderItem);

        await getOrderById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.include.all.keys('Order', 'Products');
    });

    it('should handle order not found', async() => {
        const req = {
            user: { userId: 123 },
            params: { orderId: 3 }
        };

        sinon.stub(Order, 'findOne').resolves(null);

        await getOrderById(req, res);

        expect(res.status.calledWith(404)).to.be.true;
    });

    it('should get order by id request error', async() => {
        const req = {
            user: { userId: 123 },
            params: { orderId: 3 }
        };

        sinon.stub(Order, 'findOne').rejects();

        await getOrderById(req, res);

        expect(res.status.calledWith(400)).to.be.true;
    });

    it('should update order status successfully', async () => {
        const order = {
          order_id: 1
        };

        sinon.stub(Order, 'findByPk').resolves(order);
    
        const updatedOrder = {
          order_id: 1,
          status: 'completed',
        };
        sinon.stub(Order, 'update').resolves([1, [updatedOrder]]);
    
        await updateOrderStatus(req, res);
        
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.include({ message: 'Order status is successfully updated.' });
      });
});