const ProductCategory = require('../models/ProductCategory');

// Kategori Oluşturma
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const companyId = req.user._id; // Firma ID'si
    
    const category = await ProductCategory.create({
      company: companyId,
      name,
      description
    });
    
    res.status(201).json({
      message: 'Kategori başarıyla oluşturuldu',
      category
    });
  } catch (error) {
    console.error('Kategori oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kategorileri Listeleme
const getCategories = async (req, res) => {
  try {
    const companyId = req.user._id;
    
    const categories = await ProductCategory.find({ company: companyId });
    
    res.json({ categories });
  } catch (error) {
    console.error('Kategori listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kategori Detayı
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const companyId = req.user._id;
    
    const category = await ProductCategory.findOne({
      _id: categoryId,
      company: companyId
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    
    res.json({ category });
  } catch (error) {
    console.error('Kategori detay hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kategori Güncelleme
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const companyId = req.user._id;
    const { name, description } = req.body;
    
    const category = await ProductCategory.findOne({
      _id: categoryId,
      company: companyId
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    
    category.name = name || category.name;
    category.description = description || category.description;
    
    const updatedCategory = await category.save();
    
    res.json({
      message: 'Kategori başarıyla güncellendi',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kategori Silme
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const companyId = req.user._id;
    
    const category = await ProductCategory.findOne({
      _id: categoryId,
      company: companyId
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    
    await category.deleteOne();
    
    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
}; 