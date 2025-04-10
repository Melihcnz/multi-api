const Stock = require('../models/Stock');
const StockHistory = require('../models/StockHistory');
const Product = require('../models/Product');

// Tüm stokları getir
exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({ company: req.user.company })
            .populate('product', 'name price');
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: 'Stoklar alınırken bir hata oluştu' });
    }
};

// Yeni stok oluştur
exports.createStock = async (req, res) => {
    try {
        const stock = new Stock({
            ...req.body,
            company: req.user.company
        });
        await stock.save();
        res.status(201).json(stock);
    } catch (error) {
        res.status(400).json({ message: 'Stok oluşturulurken bir hata oluştu' });
    }
};

// Stok güncelle
exports.updateStock = async (req, res) => {
    try {
        const stock = await Stock.findOne({ 
            _id: req.params.id, 
            company: req.user.company 
        });

        if (!stock) {
            return res.status(404).json({ message: 'Stok bulunamadı' });
        }

        const previousQuantity = stock.quantity;
        const updates = req.body;

        // Stok hareketi kaydı
        if (updates.quantity !== undefined && updates.quantity !== previousQuantity) {
            const stockHistory = new StockHistory({
                stock: stock._id,
                company: req.user.company,
                previousQuantity,
                newQuantity: updates.quantity,
                type: updates.quantity > previousQuantity ? 'giriş' : 'çıkış',
                reason: updates.reason || 'diğer',
                notes: updates.notes,
                user: req.user._id
            });
            await stockHistory.save();
        }

        Object.assign(stock, updates);
        await stock.save();

        res.json(stock);
    } catch (error) {
        res.status(400).json({ message: 'Stok güncellenirken bir hata oluştu' });
    }
};

// Stok sil
exports.deleteStock = async (req, res) => {
    try {
        const stock = await Stock.findOneAndDelete({
            _id: req.params.id,
            company: req.user.company
        });

        if (!stock) {
            return res.status(404).json({ message: 'Stok bulunamadı' });
        }

        res.json({ message: 'Stok başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Stok silinirken bir hata oluştu' });
    }
};

// Stok geçmişini getir
exports.getStockHistory = async (req, res) => {
    try {
        const history = await StockHistory.find({
            stock: req.params.id,
            company: req.user.company
        })
        .populate('user', 'name')
        .populate('order', 'orderNumber')
        .sort('-createdAt');

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Stok geçmişi alınırken bir hata oluştu' });
    }
};

// Stok hareketi ekle
exports.addStockMovement = async (req, res) => {
    try {
        const stock = await Stock.findOne({
            _id: req.params.id,
            company: req.user.company
        });

        if (!stock) {
            return res.status(404).json({ message: 'Stok bulunamadı' });
        }

        const { quantity, type, reason, notes, order } = req.body;
        const previousQuantity = stock.quantity;
        
        // Stok miktarını güncelle
        if (type === 'giriş') {
            stock.quantity += quantity;
        } else if (type === 'çıkış') {
            if (stock.quantity < quantity) {
                return res.status(400).json({ message: 'Yetersiz stok miktarı' });
            }
            stock.quantity -= quantity;
        }

        // Stok hareketi kaydet
        const stockHistory = new StockHistory({
            stock: stock._id,
            company: req.user.company,
            previousQuantity,
            newQuantity: stock.quantity,
            type,
            reason,
            notes,
            user: req.user._id,
            order
        });

        await Promise.all([
            stock.save(),
            stockHistory.save()
        ]);

        res.json({ stock, stockHistory });
    } catch (error) {
        res.status(400).json({ message: 'Stok hareketi eklenirken bir hata oluştu' });
    }
}; 