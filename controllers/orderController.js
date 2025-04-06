const Order = require('../models/Order');
const Product = require('../models/Product');
const Table = require('../models/Table');

// Sipariş Oluşturma
const createOrder = async (req, res) => {
  try {
    const { tableId, customerId, items } = req.body;
    const companyId = req.user._id;
    const userId = req.user._id; // Kullanıcı veya firma hesabı olabilir
    
    // Masa kontrolü
    if (tableId) {
      const table = await Table.findOne({
        _id: tableId,
        company: companyId
      });
      
      if (!table) {
        return res.status(404).json({ message: 'Masa bulunamadı' });
      }
      
      // Masa durumunu occupied olarak güncelle
      table.status = 'occupied';
      await table.save();
    }
    
    // Sipariş öğelerini hazırla
    const orderItems = [];
    let totalAmount = 0;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Sipariş öğeleri gereklidir' });
    }
    
    // Her bir ürün için detayları al
    for (const item of items) {
      const { productId, quantity, notes } = item;
      
      // Ürün kontrolü
      const product = await Product.findOne({
        _id: productId,
        company: companyId
      });
      
      if (!product) {
        return res.status(404).json({ 
          message: `Ürün bulunamadı: ${productId}` 
        });
      }
      
      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;
      
      orderItems.push({
        product: productId,
        quantity,
        unitPrice,
        totalPrice,
        notes
      });
      
      totalAmount += totalPrice;
    }
    
    // Sipariş oluştur
    const order = await Order.create({
      company: companyId,
      table: tableId,
      customer: customerId,
      user: userId,
      items: orderItems,
      totalAmount,
      status: 'pending'
    });
    
    // Popüle edilmiş siparişi al
    const populatedOrder = await Order.findById(order._id)
      .populate('table', 'tableNumber')
      .populate('customer', 'name')
      .populate('user', 'name')
      .populate('items.product', 'name');
    
    res.status(201).json({
      message: 'Sipariş başarıyla oluşturuldu',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Siparişleri Listeleme
const getOrders = async (req, res) => {
  try {
    const companyId = req.user._id;
    const { status } = req.query;
    
    const filter = { company: companyId };
    
    // Status filtresi
    if (status && ['pending', 'preparing', 'completed', 'cancelled'].includes(status)) {
      filter.status = status;
    }
    
    const orders = await Order.find(filter)
      .sort({ orderDate: -1 })
      .populate('table', 'tableNumber')
      .populate('customer', 'name')
      .populate('user', 'name');
    
    res.json({ orders });
  } catch (error) {
    console.error('Sipariş listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Sipariş Detayı
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const companyId = req.user._id;
    
    const order = await Order.findOne({
      _id: orderId,
      company: companyId
    })
    .populate('table', 'tableNumber')
    .populate('customer', 'name')
    .populate('user', 'name')
    .populate('items.product', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Sipariş detay hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Sipariş Durumu Güncelleme
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const companyId = req.user._id;
    const { status } = req.body;
    
    if (!status || !['pending', 'preparing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        message: 'Geçerli bir durum belirtilmedi (pending, preparing, completed, cancelled)' 
      });
    }
    
    const order = await Order.findOne({
      _id: orderId,
      company: companyId
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
    
    // Sipariş tamamlandığında veya iptal edildiğinde masa durumunu güncelle
    if ((status === 'completed' || status === 'cancelled') && order.table) {
      const table = await Table.findById(order.table);
      
      if (table) {
        table.status = 'available';
        await table.save();
      }
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('table', 'tableNumber')
      .populate('customer', 'name')
      .populate('user', 'name');
    
    res.json({
      message: `Sipariş durumu ${status} olarak güncellendi`,
      order: populatedOrder
    });
  } catch (error) {
    console.error('Sipariş durum güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Sipariş Öğesi Ekleme
const addOrderItem = async (req, res) => {
  try {
    const orderId = req.params.id;
    const companyId = req.user._id;
    const { productId, quantity, notes } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ 
        message: 'Ürün ID ve miktar gereklidir' 
      });
    }
    
    const order = await Order.findOne({
      _id: orderId,
      company: companyId
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
    
    // Tamamlanmış veya iptal edilmiş siparişe ürün eklenemez
    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({ 
        message: 'Tamamlanmış veya iptal edilmiş siparişe ürün eklenemez' 
      });
    }
    
    // Ürün kontrolü
    const product = await Product.findOne({
      _id: productId,
      company: companyId
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    
    const unitPrice = product.price;
    const totalPrice = unitPrice * quantity;
    
    // Yeni sipariş öğesi ekle
    order.items.push({
      product: productId,
      quantity,
      unitPrice,
      totalPrice,
      notes
    });
    
    // Toplam tutarı güncelle
    order.calculateTotalAmount();
    
    const updatedOrder = await order.save();
    
    // Popüle edilmiş siparişi al
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('table', 'tableNumber')
      .populate('customer', 'name')
      .populate('user', 'name')
      .populate('items.product', 'name');
    
    res.json({
      message: 'Siparişe ürün eklendi',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Sipariş öğesi ekleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Masa Bazlı Aktif Sipariş
const getActiveOrderByTable = async (req, res) => {
  try {
    const tableId = req.params.tableId;
    const companyId = req.user._id;
    
    const activeOrder = await Order.findOne({
      company: companyId,
      table: tableId,
      status: { $in: ['pending', 'preparing'] }
    })
    .sort({ orderDate: -1 })
    .populate('table', 'tableNumber')
    .populate('customer', 'name')
    .populate('user', 'name')
    .populate('items.product', 'name');
    
    if (!activeOrder) {
      return res.status(404).json({ 
        message: 'Bu masaya ait aktif sipariş bulunamadı' 
      });
    }
    
    res.json({ order: activeOrder });
  } catch (error) {
    console.error('Masa bazlı sipariş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  addOrderItem,
  getActiveOrderByTable
}; 