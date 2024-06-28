const { expect } = require('chai');
const sinon = require('sinon');

const { CartItem } = require('../src/models');
const { createCartItem, getCartItems, updateItemQuantity, removeCartItem } = require('../src/controllers/cartItemController');

describe('CART ITEMS', () => {
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

    it('should add products to cart', async () => {
        let sandbox;

        sandbox = sinon.createSandbox();

        const createdData = {
            product_id: 1,
            user_id: 20,
            quantity: 2
        }
        const req = {
            body: {
                product_id: 1,
                quantity: 2
            },
            user: {
                userId: 20
            }
        };

        sandbox.stub(CartItem, 'findOrCreate').resolves([createdData, true]);

        await createCartItem(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            success: true,
            message: 'Product successfully added to cart.',
            created: createdData
        })).to.be.true;

        sandbox.restore();
    });

    it('should update existing items in cart', async () => {
        let sandbox;

        sandbox = sinon.createSandbox();

        const cartData = {
            product_id: 1,
            user_id: 20,
            quantity: 2
        };

        const updatedData = {
            product_id: 1,
            user_id: 20,
            quantity: 2
        };

        const req = {
            body: {
                product_id: 1,
                quantity: 2
            },
            user: {
                userId: 20
            }
        };

        sandbox.stub(CartItem, 'findOrCreate').resolves([cartData, false]);
        sinon.stub(CartItem, 'update').resolves([1, [updatedData]]);

        await createCartItem(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.include({ message: 'Product quantity successfully updated.' });

        sandbox.restore();
    });

    it('should handle bad create request', async () => {
        let sandbox;

        sandbox = sinon.createSandbox();

        const cartData = {
            product_id: 1,
            user_id: 20,
            quantity: 2
        };

        const req = {
            user: {
                userId: 20
            }
        };

        sandbox.stub(CartItem, 'findOrCreate').resolves([cartData, false]);

        await createCartItem(req, res);

        expect(res.status.calledWith(400)).to.be.true;

        sandbox.restore();
    });

    it('should get all cart items', async () => {
        const req = {
            user: { userId: 5 }
        };

        sinon.stub(CartItem, 'findAll').resolves([]);

        await getCartItems(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.be.an('array');
    });

    it('should handle bad get request', async () => {
        const req = {
            user: { userId: 5 }
        };

        sinon.stub(CartItem, 'findAll').resolves();

        await getCartItems(null, res);

        expect(res.status.calledWith(400)).to.be.true;
    });

    it('should update cart item', async () => {
        const updatedItem = {
            cart_id: 4,
            product_id: 4,
            user_id: 333,
            quantity: 3
        };

        const req = {
            params: { itemId: 4 },
            user: { userId: 333 },
            body: { quantity: 3 }
        };

        sinon.stub(CartItem, 'update').resolves([1, updatedItem]);

        await updateItemQuantity(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            success: true,
            message: 'Quantity is updated.',
            updatedItem
        })).to.be.true;
    });

    it('should handle error with cart item not found', async () => {
        const req = {
            params: { itemId: 4 },
            user: { userId: 333 },
            body: { quantity: 3 }
        };

        sinon.stub(CartItem, 'update').resolves([0, []]);

        await updateItemQuantity(req, res);

        expect(res.status.calledWith(404)).to.be.true;
    });

    it('should remove item from cart', async () => {
        const cartItem = {
            cart_id: 5,
            product_id: 4,
            user_id: 333,
            quantity: 3
        };

        const req = {
            user: { userId: 1 },
            params: { itemId: 5 }
        };

        sinon.stub(CartItem, 'findOne').resolves(cartItem);

        sinon.stub(CartItem, 'destroy').resolves(1);

        await removeCartItem(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            success: true,
            message: 'Item successfully removed from cart.',
            removedItem: cartItem
        })).to.be.true;
    });

    it('should handle error when deleting non-existent item', async () => {
        const req = {
            user: { userId: 1 },
            params: { itemId: 5 }
        };

        sinon.stub(CartItem, 'findOne').resolves();

        await removeCartItem(req, res);

        expect(res.status.calledWith(404)).to.be.true;
    })
})