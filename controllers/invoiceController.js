const Invoice = require('../models/Invoice');
const Order = require('../models/Order');

// Fatura oluşturma fonksiyonu
const generateInvoiceNumber = async (companyId) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Son faturayı bul
  const lastInvoice = await Invoice.findOne({ company: companyId })
    .sort({ invoiceDate: -1 });
  
  let sequence = 1;
  
  if (lastInvoice) {
    // Son fatura numarasından sıra numarasını çıkar
    const lastInvoiceNumber = lastInvoice.invoiceNumber;
    const lastSequence = parseInt(lastInvoiceNumber.split('-')[2]);
    
    if (!isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }
  
  // Fatura numarası formatı: INV-YYMM-SEQUENCE
  return `INV-${year}${month}-${sequence.toString().padStart(4, '0')}`;
};

// Fatura Oluşturma
const createInvoice = async (req, res) => {
  try {
    const { orderId, dueDate } = req.body;
    const companyId = req.user._id;
    
    // Sipariş kontrolü
    const order = await Order.findOne({
      _id: orderId,
      company: companyId
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }
    
    // Sipariş tamamlanmamışsa uyarı ver
    if (order.status !== 'completed') {
      return res.status(400).json({ 
        message: 'Tamamlanmamış siparişler için fatura oluşturulamaz'
      });
    }
    
    // Aynı sipariş için fatura var mı kontrol et
    const existingInvoice = await Invoice.findOne({
      order: orderId,
      company: companyId
    });
    
    if (existingInvoice) {
      return res.status(400).json({ 
        message: 'Bu sipariş için zaten bir fatura oluşturulmuş' 
      });
    }
    
    // Fatura numarası oluştur
    const invoiceNumber = await generateInvoiceNumber(companyId);
    
    // Fatura oluştur
    const invoice = await Invoice.create({
      company: companyId,
      order: orderId,
      invoiceNumber,
      invoiceDate: new Date(),
      dueDate: dueDate || null,
      totalAmount: order.totalAmount,
      paymentStatus: 'pending'
    });
    
    // Popüle edilmiş faturayı al
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('order', 'orderDate totalAmount')
      .populate({
        path: 'order',
        populate: [
          { path: 'customer', select: 'name' },
          { path: 'table', select: 'tableNumber' }
        ]
      });
    
    res.status(201).json({
      message: 'Fatura başarıyla oluşturuldu',
      invoice: populatedInvoice
    });
  } catch (error) {
    console.error('Fatura oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Faturaları Listeleme
const getInvoices = async (req, res) => {
  try {
    const companyId = req.user._id;
    const { status } = req.query;
    
    const filter = { company: companyId };
    
    // Status filtresi
    if (status && ['pending', 'paid', 'cancelled'].includes(status)) {
      filter.paymentStatus = status;
    }
    
    const invoices = await Invoice.find(filter)
      .sort({ invoiceDate: -1 })
      .populate('order', 'orderDate totalAmount')
      .populate({
        path: 'order',
        populate: { path: 'customer', select: 'name' }
      });
    
    res.json({ invoices });
  } catch (error) {
    console.error('Fatura listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Fatura Detayı
const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const companyId = req.user._id;
    
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      company: companyId
    })
    .populate('order')
    .populate({
      path: 'order',
      populate: [
        { path: 'customer', select: 'name email phone address' },
        { path: 'table', select: 'tableNumber' },
        { path: 'items.product', select: 'name' }
      ]
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Fatura bulunamadı' });
    }
    
    res.json({ invoice });
  } catch (error) {
    console.error('Fatura detay hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Fatura Durumu Güncelleme
const updateInvoiceStatus = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const companyId = req.user._id;
    const { paymentStatus } = req.body;
    
    if (!paymentStatus || !['pending', 'paid', 'cancelled'].includes(paymentStatus)) {
      return res.status(400).json({ 
        message: 'Geçerli bir durum belirtilmedi (pending, paid, cancelled)' 
      });
    }
    
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      company: companyId
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Fatura bulunamadı' });
    }
    
    invoice.paymentStatus = paymentStatus;
    const updatedInvoice = await invoice.save();
    
    const populatedInvoice = await Invoice.findById(updatedInvoice._id)
      .populate('order', 'orderDate totalAmount')
      .populate({
        path: 'order',
        populate: { path: 'customer', select: 'name' }
      });
    
    res.json({
      message: `Fatura durumu ${paymentStatus} olarak güncellendi`,
      invoice: populatedInvoice
    });
  } catch (error) {
    console.error('Fatura durum güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Siparişe Göre Fatura Getir
const getInvoiceByOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const companyId = req.user._id;
    
    const invoice = await Invoice.findOne({
      company: companyId,
      order: orderId
    })
    .populate('order')
    .populate({
      path: 'order',
      populate: [
        { path: 'customer', select: 'name email phone address' },
        { path: 'table', select: 'tableNumber' },
        { path: 'items.product', select: 'name' }
      ]
    });
    
    if (!invoice) {
      return res.status(404).json({ 
        message: 'Bu siparişe ait fatura bulunamadı' 
      });
    }
    
    res.json({ invoice });
  } catch (error) {
    console.error('Sipariş bazlı fatura hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  getInvoiceByOrder
}; 