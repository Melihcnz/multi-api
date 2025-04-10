const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Route'ları import et
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const stockRoutes = require('./routes/stockRoutes');
const reportRoutes = require('./routes/reportRoutes');
const staffRoutes = require('./routes/staffRoutes');

// Çevre değişkenlerini yükle
dotenv.config();

// MongoDB'ye bağlan
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',  // Tüm kaynaklardan erişime izin verir (geliştirme aşamasında)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/staff', staffRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'MongoDB API çalışıyor!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
}); 