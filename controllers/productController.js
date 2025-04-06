const Product = require('../models/Product');

// Ürün Oluşturma
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stockQuantity, category } = req.body;
    const companyId = req.user._id;
    
    const product = await Product.create({
      company: companyId,
      category,
      name,
      description,
      price,
      stockQuantity
    });
    
    res.status(201).json({
      message: 'Ürün başarıyla oluşturuldu',
      product
    });
  } catch (error) {
    console.error('Ürün oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Ürünleri Listeleme
const getProducts = async (req, res) => {
  try {
    const companyId = req.user._id;
    
    const products = await Product.find({ company: companyId })
      .populate('category', 'name');
    
    res.json({ products });
  } catch (error) {
    console.error('Ürün listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Ürün Detayı
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const companyId = req.user._id;
    
    const product = await Product.findOne({
      _id: productId,
      company: companyId
    }).populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Ürün detay hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Ürün Güncelleme
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const companyId = req.user._id;
    const { name, description, price, stockQuantity, category } = req.body;
    
    const product = await Product.findOne({
      _id: productId,
      company: companyId
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    
    // Alanları güncelle
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
    product.category = category || product.category;
    
    const updatedProduct = await product.save();
    
    res.json({
      message: 'Ürün başarıyla güncellendi',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Ürün Silme
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const companyId = req.user._id;
    
    const product = await Product.findOne({
      _id: productId,
      company: companyId
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    
    await product.deleteOne();
    
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kategori Bazlı Ürünleri Getirme
const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const companyId = req.user._id;
    
    const products = await Product.find({
      company: companyId,
      category: categoryId
    }).populate('category', 'name');
    
    res.json({ products });
  } catch (error) {
    console.error('Kategori bazlı ürün listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
}; 