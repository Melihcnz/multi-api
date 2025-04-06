const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

// Ödeme Oluşturma
const createPayment = async (req, res) => {
  try {
    const { invoiceId, amount, paymentMethod } = req.body;
    const companyId = req.user._id;
    
    // Gerekli alanları kontrol et
    if (!invoiceId || !amount || !paymentMethod) {
      return res.status(400).json({ 
        message: 'Fatura ID, miktar ve ödeme yöntemi zorunludur' 
      });
    }
    
    // Fatura kontrolü
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      company: companyId
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Fatura bulunamadı' });
    }
    
    // Fatura zaten ödenmiş mi kontrol et
    if (invoice.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Bu fatura zaten ödenmiş' });
    }
    
    // Fatura iptal edilmiş mi kontrol et
    if (invoice.paymentStatus === 'cancelled') {
      return res.status(400).json({ message: 'İptal edilmiş fatura için ödeme yapılamaz' });
    }
    
    // Önceki ödemeleri al
    const previousPayments = await Payment.find({
      invoice: invoiceId,
      company: companyId,
      paymentStatus: 'completed'
    });

    // Toplam ödenen miktarı hesapla
    const totalPaidAmount = previousPayments.reduce((sum, payment) => sum + payment.amount, 0);

    // Yeni ödeme ile toplam miktarı hesapla
    const newTotalAmount = totalPaidAmount + amount;

    // Toplam ödeme miktarı fatura tutarını aşıyor mu kontrol et
    if (newTotalAmount > invoice.totalAmount) {
      return res.status(400).json({ 
        message: 'Toplam ödeme miktarı fatura tutarını aşamaz' 
      });
    }
    
    // Ödeme oluştur
    const payment = await Payment.create({
      company: companyId,
      invoice: invoiceId,
      amount,
      paymentMethod,
      paymentDate: new Date(),
      paymentStatus: 'completed'
    });
    
    // Eğer toplam ödeme miktarı fatura tutarına eşit veya çok yakınsa fatura durumunu güncelle
    if (newTotalAmount >= invoice.totalAmount || (invoice.totalAmount - newTotalAmount < 0.01)) {
      invoice.paymentStatus = 'paid';
      await invoice.save();
    }
    
    // Popüle edilmiş ödemeyi al
    const populatedPayment = await Payment.findById(payment._id)
      .populate('invoice', 'invoiceNumber totalAmount paymentStatus');
    
    res.status(201).json({
      message: 'Ödeme başarıyla kaydedildi',
      payment: populatedPayment
    });
  } catch (error) {
    console.error('Ödeme oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Ödemeleri Listeleme
const getPayments = async (req, res) => {
  try {
    const companyId = req.user._id;
    const { status, invoiceId } = req.query;
    
    const filter = { company: companyId };
    
    // Status filtresi
    if (status && ['completed', 'pending', 'failed'].includes(status)) {
      filter.paymentStatus = status;
    }
    
    // Fatura ID filtresi
    if (invoiceId) {
      filter.invoice = invoiceId;
    }
    
    const payments = await Payment.find(filter)
      .sort({ paymentDate: -1 })
      .populate('invoice', 'invoiceNumber totalAmount paymentStatus');
    
    res.json({ payments });
  } catch (error) {
    console.error('Ödeme listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Ödeme Detayı
const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const companyId = req.user._id;
    
    const payment = await Payment.findOne({
      _id: paymentId,
      company: companyId
    })
    .populate('invoice')
    .populate({
      path: 'invoice',
      populate: { path: 'order' }
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Ödeme bulunamadı' });
    }
    
    res.json({ payment });
  } catch (error) {
    console.error('Ödeme detay hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Ödeme İptal Etme
const cancelPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const companyId = req.user._id;
    
    const payment = await Payment.findOne({
      _id: paymentId,
      company: companyId
    }).populate('invoice');
    
    if (!payment) {
      return res.status(404).json({ message: 'Ödeme bulunamadı' });
    }
    
    // Ödeme zaten iptal edilmiş mi kontrol et
    if (payment.paymentStatus === 'failed') {
      return res.status(400).json({ message: 'Bu ödeme zaten iptal edilmiş' });
    }
    
    // Ödeme durumunu güncelle
    payment.paymentStatus = 'failed';
    
    // Fatura durumunu güncelle
    if (payment.invoice && payment.invoice.paymentStatus === 'paid') {
      const invoice = await Invoice.findById(payment.invoice._id);
      invoice.paymentStatus = 'pending';
      await invoice.save();
    }
    
    await payment.save();
    
    res.json({
      message: 'Ödeme başarıyla iptal edildi',
      payment
    });
  } catch (error) {
    console.error('Ödeme iptal hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Fatura Bazlı Ödemeler
const getPaymentsByInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const companyId = req.user._id;
    
    // Fatura kontrolü
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      company: companyId
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Fatura bulunamadı' });
    }
    
    const payments = await Payment.find({
      invoice: invoiceId,
      company: companyId,
      paymentStatus: 'completed'
    }).sort({ paymentDate: -1 });
    
    // Toplam ödeme miktarını hesapla
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    res.json({ 
      invoice: {
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
        paymentStatus: invoice.paymentStatus
      },
      payments,
      totalPaid,
      remaining: invoice.totalAmount - totalPaid
    });
  } catch (error) {
    console.error('Fatura bazlı ödeme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  cancelPayment,
  getPaymentsByInvoice
}; 