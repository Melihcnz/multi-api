const Customer = require('../models/Customer');

// Müşteri Oluşturma
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const companyId = req.user._id;
    
    const customer = await Customer.create({
      company: companyId,
      name,
      email,
      phone,
      address
    });
    
    res.status(201).json({
      message: 'Müşteri başarıyla oluşturuldu',
      customer
    });
  } catch (error) {
    console.error('Müşteri oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Müşterileri Listeleme
const getCustomers = async (req, res) => {
  try {
    const companyId = req.user._id;
    
    const customers = await Customer.find({ company: companyId });
    
    res.json({ customers });
  } catch (error) {
    console.error('Müşteri listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Müşteri Detayı
const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const companyId = req.user._id;
    
    const customer = await Customer.findOne({
      _id: customerId,
      company: companyId
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    
    res.json({ customer });
  } catch (error) {
    console.error('Müşteri detay hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Müşteri Güncelleme
const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const companyId = req.user._id;
    const { name, email, phone, address } = req.body;
    
    const customer = await Customer.findOne({
      _id: customerId,
      company: companyId
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    
    // Alanları güncelle
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;
    
    const updatedCustomer = await customer.save();
    
    res.json({
      message: 'Müşteri başarıyla güncellendi',
      customer: updatedCustomer
    });
  } catch (error) {
    console.error('Müşteri güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Müşteri Silme
const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const companyId = req.user._id;
    
    const customer = await Customer.findOne({
      _id: customerId,
      company: companyId
    });
    
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    
    await customer.deleteOne();
    
    res.json({ message: 'Müşteri başarıyla silindi' });
  } catch (error) {
    console.error('Müşteri silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Müşteri Arama
const searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;
    const companyId = req.user._id;
    
    if (!query) {
      return res.status(400).json({ message: 'Arama kriteri gereklidir' });
    }
    
    const customers = await Customer.find({
      company: companyId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json({ customers });
  } catch (error) {
    console.error('Müşteri arama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers
}; 