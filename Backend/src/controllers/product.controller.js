const Product = require('../models/product.model');
const { sendSuccess, sendError } = require('../utils/response');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return sendSuccess(res, 'Products fetched successfully', products);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    
    return sendSuccess(res, 'Product fetched successfully', product);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, availableStock } = req.body;
    
    const product = new Product({
      name,
      availableStock,
    });
    
    await product.save();
    return sendSuccess(res, 'Product created successfully', product, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    
    return sendSuccess(res, 'Product updated successfully', product);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    
    return sendSuccess(res, 'Product deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 404);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
