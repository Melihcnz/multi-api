const KitchenOrder = require('../models/KitchenOrder');
const Order = require('../models/Order');

// Yeni mutfak siparişi oluştur
exports.createKitchenOrder = async (req, res) => {
    try {
        const { orderId, items } = req.body;
        
        // Ana siparişi kontrol et
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }

        const kitchenOrder = new KitchenOrder({
            orderId: order._id,
            tableId: order.tableId,
            items: items.map(item => ({
                ...item,
                status: 'beklemede'
            }))
        });

        await kitchenOrder.save();
        res.status(201).json(kitchenOrder);
    } catch (error) {
        res.status(500).json({ message: 'Mutfak siparişi oluşturulurken hata oluştu', error: error.message });
    }
};

// Tüm mutfak siparişlerini getir
exports.getAllKitchenOrders = async (req, res) => {
    try {
        const orders = await KitchenOrder.find()
            .populate('orderId')
            .populate('tableId')
            .populate('items.productId')
            .populate('assignedTo')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Siparişler getirilirken hata oluştu', error: error.message });
    }
};

// Aktif mutfak siparişlerini getir
exports.getActiveKitchenOrders = async (req, res) => {
    try {
        const orders = await KitchenOrder.find({
            status: { $in: ['beklemede', 'hazırlanıyor'] }
        })
            .populate('orderId')
            .populate('tableId')
            .populate('items.productId')
            .populate('assignedTo')
            .sort({ priority: -1, createdAt: 1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Aktif siparişler getirilirken hata oluştu', error: error.message });
    }
};

// Sipariş durumunu güncelle
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, itemIndex } = req.body;

        const kitchenOrder = await KitchenOrder.findById(orderId);
        if (!kitchenOrder) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }

        await kitchenOrder.updateStatus(status, itemIndex);
        
        // Tüm ürünler hazır ise otomatik olarak siparişi hazır durumuna getir
        if (itemIndex !== null && status === 'hazır') {
            const allItemsReady = kitchenOrder.items.every(item => item.status === 'hazır');
            if (allItemsReady) {
                await kitchenOrder.updateStatus('hazır');
            }
        }

        res.json(kitchenOrder);
    } catch (error) {
        res.status(500).json({ message: 'Sipariş durumu güncellenirken hata oluştu', error: error.message });
    }
};

// Sipariş önceliğini güncelle
exports.updateOrderPriority = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { priority } = req.body;

        const kitchenOrder = await KitchenOrder.findById(orderId);
        if (!kitchenOrder) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }

        await kitchenOrder.updatePriority(priority);
        res.json(kitchenOrder);
    } catch (error) {
        res.status(500).json({ message: 'Sipariş önceliği güncellenirken hata oluştu', error: error.message });
    }
};

// Personele sipariş ata
exports.assignOrderToStaff = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { staffId } = req.body;

        const kitchenOrder = await KitchenOrder.findById(orderId);
        if (!kitchenOrder) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }

        kitchenOrder.assignedTo = staffId;
        await kitchenOrder.save();

        res.json(kitchenOrder);
    } catch (error) {
        res.status(500).json({ message: 'Sipariş personele atanırken hata oluştu', error: error.message });
    }
}; 