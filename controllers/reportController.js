const Report = require('../models/Report');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Table = require('../models/Table');

// Satış raporu oluştur
exports.createSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        
        // Rapor oluştur
        const report = new Report({
            company: req.user.company,
            type: 'satış',
            dateRange: {
                start: new Date(startDate),
                end: new Date(endDate)
            },
            generatedBy: req.user._id,
            status: 'hazırlanıyor'
        });

        // Satış verilerini getir
        const orders = await Order.find({
            company: req.user.company,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            },
            status: 'completed'
        }).populate('items.product');

        // Verileri işle
        const salesData = orders.map(order => ({
            orderId: order._id,
            date: order.createdAt,
            amount: order.totalAmount,
            items: order.items.map(item => ({
                product: item.product.name,
                quantity: item.quantity,
                price: item.price,
                total: item.quantity * item.price
            }))
        }));

        report.data = salesData;
        report.calculateSummary();
        await report.compareWithPreviousPeriod();
        await report.save();

        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: 'Rapor oluşturulurken bir hata oluştu' });
    }
};

// Stok raporu oluştur
exports.createStockReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        
        const report = new Report({
            company: req.user.company,
            type: 'stok',
            dateRange: {
                start: new Date(startDate),
                end: new Date(endDate)
            },
            generatedBy: req.user._id,
            status: 'hazırlanıyor'
        });

        // Stok verilerini getir
        const stocks = await Stock.find({
            company: req.user.company
        }).populate('product');

        const stockData = stocks.map(stock => ({
            product: stock.product.name,
            currentQuantity: stock.quantity,
            minQuantity: stock.minQuantity,
            maxQuantity: stock.maxQuantity,
            unit: stock.unit,
            status: stock.isLowStock() ? 'kritik' : 'normal'
        }));

        report.data = stockData;
        await report.save();

        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: 'Rapor oluşturulurken bir hata oluştu' });
    }
};

// Ürün performans raporu
exports.createProductReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        
        const report = new Report({
            company: req.user.company,
            type: 'ürün',
            dateRange: {
                start: new Date(startDate),
                end: new Date(endDate)
            },
            generatedBy: req.user._id,
            status: 'hazırlanıyor'
        });

        // Tamamlanan siparişleri getir
        const orders = await Order.find({
            company: req.user.company,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            },
            status: 'completed'
        }).populate('items.product');

        // Ürün bazlı satış verilerini hesapla
        const productStats = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.product._id.toString();
                if (!productStats[productId]) {
                    productStats[productId] = {
                        name: item.product.name,
                        totalQuantity: 0,
                        totalAmount: 0,
                        orderCount: 0
                    };
                }
                productStats[productId].totalQuantity += item.quantity;
                productStats[productId].totalAmount += item.quantity * item.price;
                productStats[productId].orderCount++;
            });
        });

        report.data = Object.values(productStats).map(stat => ({
            ...stat,
            averageOrderValue: stat.totalAmount / stat.orderCount
        }));

        await report.save();

        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: 'Rapor oluşturulurken bir hata oluştu' });
    }
};

// Masa doluluk raporu
exports.createTableReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        
        const report = new Report({
            company: req.user.company,
            type: 'masa',
            dateRange: {
                start: new Date(startDate),
                end: new Date(endDate)
            },
            generatedBy: req.user._id,
            status: 'hazırlanıyor'
        });

        // Masa ve sipariş verilerini getir
        const tables = await Table.find({ company: req.user.company });
        const orders = await Order.find({
            company: req.user.company,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Masa bazlı istatistikleri hesapla
        const tableStats = tables.map(table => {
            const tableOrders = orders.filter(order => 
                order.table && order.table.toString() === table._id.toString()
            );

            return {
                tableNumber: table.number,
                totalOrders: tableOrders.length,
                totalAmount: tableOrders.reduce((sum, order) => sum + order.totalAmount, 0),
                averageOrderValue: tableOrders.length > 0 
                    ? tableOrders.reduce((sum, order) => sum + order.totalAmount, 0) / tableOrders.length 
                    : 0
            };
        });

        report.data = tableStats;
        await report.save();

        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: 'Rapor oluşturulurken bir hata oluştu' });
    }
};

// Rapor listesi
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find({ 
            company: req.user.company 
        })
        .sort('-createdAt')
        .populate('generatedBy', 'name');

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Raporlar alınırken bir hata oluştu' });
    }
};

// Rapor detayı
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findOne({
            _id: req.params.id,
            company: req.user.company
        }).populate('generatedBy', 'name');

        if (!report) {
            return res.status(404).json({ message: 'Rapor bulunamadı' });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Rapor alınırken bir hata oluştu' });
    }
};

// Rapor sil
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findOneAndDelete({
            _id: req.params.id,
            company: req.user.company
        });

        if (!report) {
            return res.status(404).json({ message: 'Rapor bulunamadı' });
        }

        res.json({ message: 'Rapor başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Rapor silinirken bir hata oluştu' });
    }
}; 