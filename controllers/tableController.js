const Table = require('../models/Table');

// Masa Oluşturma
const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    const companyId = req.user._id;
    
    // Aynı numaralı masa var mı kontrol et
    const existingTable = await Table.findOne({
      company: companyId,
      tableNumber
    });
    
    if (existingTable) {
      return res.status(400).json({ 
        message: `${tableNumber} numaralı masa zaten mevcut` 
      });
    }
    
    const table = await Table.create({
      company: companyId,
      tableNumber,
      capacity,
      status: 'available'
    });
    
    res.status(201).json({
      message: 'Masa başarıyla oluşturuldu',
      table
    });
  } catch (error) {
    console.error('Masa oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Masaları Listeleme
const getTables = async (req, res) => {
  try {
    const companyId = req.user._id;
    
    const tables = await Table.find({ company: companyId })
      .sort({ tableNumber: 1 });
    
    res.json({ tables });
  } catch (error) {
    console.error('Masa listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Masa Detayı
const getTableById = async (req, res) => {
  try {
    const tableId = req.params.id;
    const companyId = req.user._id;
    
    const table = await Table.findOne({
      _id: tableId,
      company: companyId
    });
    
    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }
    
    res.json({ table });
  } catch (error) {
    console.error('Masa detay hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Masa Güncelleme
const updateTable = async (req, res) => {
  try {
    const tableId = req.params.id;
    const companyId = req.user._id;
    const { tableNumber, capacity, status } = req.body;
    
    const table = await Table.findOne({
      _id: tableId,
      company: companyId
    });
    
    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }
    
    // Eğer masa numarası değiştiriliyorsa, benzersiz olduğunu kontrol et
    if (tableNumber && tableNumber !== table.tableNumber) {
      const existingTable = await Table.findOne({
        company: companyId,
        tableNumber
      });
      
      if (existingTable) {
        return res.status(400).json({ 
          message: `${tableNumber} numaralı masa zaten mevcut` 
        });
      }
      
      table.tableNumber = tableNumber;
    }
    
    // Diğer alanları güncelle
    if (capacity !== undefined) table.capacity = capacity;
    if (status) table.status = status;
    
    const updatedTable = await table.save();
    
    res.json({
      message: 'Masa başarıyla güncellendi',
      table: updatedTable
    });
  } catch (error) {
    console.error('Masa güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Masa Silme
const deleteTable = async (req, res) => {
  try {
    const tableId = req.params.id;
    const companyId = req.user._id;
    
    const table = await Table.findOne({
      _id: tableId,
      company: companyId
    });
    
    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }
    
    await table.deleteOne();
    
    res.json({ message: 'Masa başarıyla silindi' });
  } catch (error) {
    console.error('Masa silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Masa Durumunu Güncelleme
const updateTableStatus = async (req, res) => {
  try {
    const tableId = req.params.id;
    const companyId = req.user._id;
    const { status } = req.body;
    
    if (!status || !['available', 'occupied', 'reserved'].includes(status)) {
      return res.status(400).json({ 
        message: 'Geçerli bir durum belirtilmedi (available, occupied, reserved)' 
      });
    }
    
    const table = await Table.findOne({
      _id: tableId,
      company: companyId
    });
    
    if (!table) {
      return res.status(404).json({ message: 'Masa bulunamadı' });
    }
    
    table.status = status;
    const updatedTable = await table.save();
    
    res.json({
      message: `Masa durumu ${status} olarak güncellendi`,
      table: updatedTable
    });
  } catch (error) {
    console.error('Masa durum güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
  updateTableStatus
}; 