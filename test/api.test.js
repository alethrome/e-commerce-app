const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const { Product, CartItem, Order, OrderItem } = require('../src/models');

const filepath = path.join(__dirname, '../src/keys', 'private_key.pem');
const privateKey = fs.readFileSync(filepath, 'utf8');

describe('Products API endpoints', () => {
    let token;

    before((done) => {
        token = jwt.sign({ id: 1, username: 'testuser' }, privateKey, { expiresIn: '1h', algorithm: 'RS256' });
        done();
    });

    it('POST /product/create', async() => {
        const req = {
            body: {
                name: 'Test Product',
                price: '10.99',
                description: 'Test description'
            },
            file: { path: '/mock/path/image.jpg' }
        };

        const response = await request(app)
            .post('/product/create')
            .set('Authorization', `Bearer ${token}`)
            .send(req.body);

        expect(response.status).to.equal(200);

        await Product.destroy({
            where: { id: response.body.newProduct.id }
        });
    });

    it('GET /product/all', async() => {
        const response = await request(app)
            .get('/product/all')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).to.equal(200);
    });

    it('GET /product/:productId', async() => {
        let productId;

        const createdProduct = await Product.create({
            name: 'Test Product',
            price: 10.99,
            description: 'Test description'

        });

        productId = createdProduct.id;

        const response = await request(app)
            .get(`/product/${productId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).to.equal(200);

        await Product.destroy({
            where: { id: productId }
        });
    });

    it('PATCH /product/:productId', async() => {
        let productId;

        const req = {
            body: {
                name: 'Test Product 2',
                price: '20.00'
            }
        };

        const createdProduct = await Product.create({
            name: 'Test Product',
            price: 10.99,
            description: 'Test description'
        });

        productId = createdProduct.id;

        const response = await request(app)
            .patch(`/product/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(req.body);

        expect(response.status).to.equal(200);

        await Product.destroy({
            where: { id: productId }
        });
    });

    it('DELETE /product/:productId', async() => {
        let productId;

        const createdProduct = await Product.create({
            name: 'Test Product',
            price: 10.99,
            description: 'Test description'
        });

        productId = createdProduct.id;

        const response = await request(app)
            .delete(`/product/${productId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).to.equal(200);

        await Product.destroy({
            where: { id: productId }
        });
    });
});

describe('Cart Items API endpoints', () => {
    let token;

    before((done) => {
        token = jwt.sign({ id: 1, username: 'testuser' }, privateKey, { expiresIn: '1h', algorithm: 'RS256' });
        done();
    });

    it('POST /cart/insert', async() => {
        let sandbox;

        sandbox = sinon.createSandbox();

        const req = {
            body: {
                product_id: 1,
                quantity: 2
            },
            user: {
                userId: 20
            }   
        };

        sandbox.stub(CartItem, 'findOrCreate').resolves([{ id: 1, quantity: 2 }, true]);

        const response = await request(app)
            .post('/cart/insert')
            .set('Authorization', `Bearer ${token}`)
            .send(req.body);

        expect(response.status).to.equal(200);

        await CartItem.destroy({
            where: { cart_id: response.body.created.id }
        });

        sandbox.restore();
    });

    it('GET /cart/all', async() => {
        sinon.stub(CartItem, 'findAll').resolves([]);

        const response = await request(app)
            .get('/cart/all')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).to.equal(200);
    });

    it('PUT /cart/:itemId', async() => {
        let cartId;

        const updatedItem = {
            cart_id: 4,
            product_id: 4,
            user_id: 333,
            quantity: 3
        };

        const req = {
            body: { quantity: 3 }
        };

        sinon.stub(CartItem, 'update').resolves([1, updatedItem]);

        const response = await request(app)
            .put(`/cart/${cartId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(req.body);

        expect(response.status).to.equal(200);
    });

    it('DELETE /cart/:itemId', async() => {
        let itemId;

        const createdProduct = await Product.create({
            name: 'Test Product',
            price: 10.99,
            description: 'Test description'
        });

        const cartItem = {
            cart_id: 5,
            product_id: createdProduct.id,
            user_id: 333,
            quantity: 3
        };

        sinon.stub(CartItem, 'findOne').resolves(cartItem);

        itemId = cartItem.cart_id;

        const response = await request(app)
            .delete(`/cart/delete/${itemId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).to.equal(200);

        await Product.destroy({
            where: { id: createdProduct.id }
        });
    });
});

describe('Orders API endpoints', () => {
    let token;

    before((done) => {
        token = jwt.sign({ id: 1, username: 'testuser' }, privateKey, { expiresIn: '1h', algorithm: 'RS256' });
        done();
    });

    it('POST /order', async() => {
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
            user: { userId: 20 }
        };

        sinon.stub(Product, 'findOne').resolves({ price: 45.99 });
        sinon.stub(Order, 'create').resolves({ user_id: 20 });
        sinon.stub(OrderItem, 'create').resolves({ order_id: 20 });

        const response = await request(app)
            .post('/order/')
            .set('Authorization', `Bearer ${token}`)
            .send(req.body);

        expect(response.status).to.equal(200);
    });

    it('GET /order/list', async() => {
        sinon.stub(Order, 'findAll').resolves([]);

        const response = await request(app)
            .get('/order/list')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).to.equal(200);
    });

    it('GET /order/:orderId', async() => {
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

        const response = await request(app)
            .get(`/order/${req.params.orderId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).to.equal(200);
    });

    // it('DELETE /cart/:itemId', async() => {
    //     let itemId;

    //     const createdProduct = await Product.create({
    //         name: 'Test Product',
    //         price: 10.99,
    //         description: 'Test description'
    //     });

    //     const cartItem = {
    //         cart_id: 5,
    //         product_id: createdProduct.id,
    //         user_id: 333,
    //         quantity: 3
    //     };

    //     sinon.stub(CartItem, 'findOne').resolves(cartItem);

    //     itemId = cartItem.cart_id;

    //     const response = await request(app)
    //         .delete(`/cart/delete/${itemId}`)
    //         .set('Authorization', `Bearer ${token}`)

    //     expect(response.status).to.equal(200);

    //     await Product.destroy({
    //         where: { id: createdProduct.id }
    //     });
    // });
})