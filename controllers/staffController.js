const Shift = require('../models/Shift');
const Leave = require('../models/Leave');
const User = require('../models/User');

// Vardiya işlemleri
exports.createShift = async (req, res) => {
    try {
        const shift = new Shift({
            ...req.body,
            company: req.user.company
        });
        await shift.save();
        res.status(201).json(shift);
    } catch (error) {
        res.status(400).json({ message: 'Vardiya oluşturulurken bir hata oluştu' });
    }
};

exports.getShifts = async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.query;
        const query = { company: req.user.company };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (userId) {
            query.user = userId;
        }

        const shifts = await Shift.find(query)
            .populate('user', 'name')
            .sort('date startTime');

        res.json(shifts);
    } catch (error) {
        res.status(500).json({ message: 'Vardiyalar alınırken bir hata oluştu' });
    }
};

exports.updateShift = async (req, res) => {
    try {
        const shift = await Shift.findOneAndUpdate(
            { _id: req.params.id, company: req.user.company },
            req.body,
            { new: true }
        );

        if (!shift) {
            return res.status(404).json({ message: 'Vardiya bulunamadı' });
        }

        res.json(shift);
    } catch (error) {
        res.status(400).json({ message: 'Vardiya güncellenirken bir hata oluştu' });
    }
};

exports.deleteShift = async (req, res) => {
    try {
        const shift = await Shift.findOneAndDelete({
            _id: req.params.id,
            company: req.user.company
        });

        if (!shift) {
            return res.status(404).json({ message: 'Vardiya bulunamadı' });
        }

        res.json({ message: 'Vardiya başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Vardiya silinirken bir hata oluştu' });
    }
};

// İzin işlemleri
exports.createLeave = async (req, res) => {
    try {
        const leave = new Leave({
            ...req.body,
            company: req.user.company,
            duration: req.body.duration || 
                     (new Date(req.body.endDate) - new Date(req.body.startDate)) / (1000 * 60 * 60 * 24) + 1
        });

        // İzin hakkı kontrolü
        const year = new Date(leave.startDate).getFullYear();
        const usedLeave = await Leave.checkLeaveBalance(leave.user, leave.type, year);
        
        if (leave.type === 'yıllık' && usedLeave + leave.duration > 14) {
            return res.status(400).json({ message: 'Yıllık izin hakkı yetersiz' });
        }

        await leave.save();
        res.status(201).json(leave);
    } catch (error) {
        res.status(400).json({ message: 'İzin oluşturulurken bir hata oluştu' });
    }
};

exports.getLeaves = async (req, res) => {
    try {
        const { status, userId, type } = req.query;
        const query = { company: req.user.company };

        if (status) query.status = status;
        if (userId) query.user = userId;
        if (type) query.type = type;

        const leaves = await Leave.find(query)
            .populate('user', 'name')
            .populate('approver', 'name')
            .sort('-createdAt');

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'İzinler alınırken bir hata oluştu' });
    }
};

exports.updateLeave = async (req, res) => {
    try {
        const leave = await Leave.findOne({
            _id: req.params.id,
            company: req.user.company
        });

        if (!leave) {
            return res.status(404).json({ message: 'İzin bulunamadı' });
        }

        // İzin onay/red işlemi
        if (req.body.status && req.body.status !== leave.status) {
            leave.status = req.body.status;
            leave.approver = req.user._id;
            leave.approvalDate = new Date();
        }

        Object.assign(leave, req.body);
        await leave.save();

        res.json(leave);
    } catch (error) {
        res.status(400).json({ message: 'İzin güncellenirken bir hata oluştu' });
    }
};

exports.deleteLeave = async (req, res) => {
    try {
        const leave = await Leave.findOneAndDelete({
            _id: req.params.id,
            company: req.user.company,
            status: 'beklemede' // Sadece bekleyen izinler silinebilir
        });

        if (!leave) {
            return res.status(404).json({ message: 'İzin bulunamadı veya silinemez' });
        }

        res.json({ message: 'İzin başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'İzin silinirken bir hata oluştu' });
    }
}; 