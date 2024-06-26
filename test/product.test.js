const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const app = require('../src/app');
const sequelize = require('../src/config/database.js');
const { Product } = require('../src/models');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../src/controllers/productController');

describe('PRODUCTS', () => {
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

    it('should create a new product', async () => {
        const req = {
            body: {
                name: 'Test Product',
                price: '10.99',
                description: 'Test description'
            },
            file: { path: '/mock/path/image.jpg' }
        };

        sinon.stub(Product, 'create').resolves({
            id: 1,
            name: req.body.name,
            price: parseFloat(req.body.price),
            description: req.body.description,
            imageURL: req.file.path
        });

        await createProduct(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            success: true,  
            message: 'Product successfully created.',
            newProduct: {
                name: req.body.name,
                price: parseFloat(req.body.price),
                description: req.body.description,
                imageURL: req.file.path
            }
        })).to.be.true;
    });

    it('should get all products', async () => {
        sinon.stub(Product, 'findAll').resolves([
            {
                id: 1,
                name: 'Wallet',
                price: parseFloat('100'),
                description: 'test description',
                imageURL: null
            }
        ]);

        await getAllProducts(null, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.be.an('array');
    });

    it('should get a product by id', async () => {
        const req = {
            params: { productId: 5 }
        };
        
        sinon.stub(Product, 'findByPk').resolves({ 
            id: 5,
            name: 'Hairclip',
            price: 10,
            description: 'test description',
            imageURL: null
        });

        await getProductById(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.firstCall.args[0]).to.be.an('object');
    });

    it('should update a product', async () => {
        const updatedData = {
            id: 5,
            name: 'Hair clip',
            price: 14,
            description: 'test description',
            imageURL: null
        }
        const req = {
            params: { productId: 5 },
            body: {
                name: 'Hair clip',
                price: 14
            }
        };

        sinon.stub(Product, 'findByPk').resolves({
            id: 5,
            name: 'Hairclip',
            price: 10,
            description: 'test description',
            imageURL: null
        });

        sinon.stub(Product, 'update').resolves([1, updatedData]);

        await updateProduct(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            success: true,
            message: 'Product successfully updated.',
            updatedData
        }));
    })

    it('should delete a product', async () => {
        const deletedData = {
            id: 5,
            name: 'Hairclip',
            price: 10,
            description: 'test description',
            imageURL: null
        };

        const req = {
            params: {
                productId: 3
            }
        };

        sinon.stub(Product, 'findByPk').resolves(deletedData);

        sinon.stub(Product, 'destroy').resolves(1);

        await deleteProduct(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({
            success: true,
            message: 'Product successfully deleted.',
            deletedData
        }));
    });
});
