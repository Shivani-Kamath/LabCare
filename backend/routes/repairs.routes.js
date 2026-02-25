const express = require('express');
const router = express.Router();
const Repair = require('../models/repair');
const Inventory = require('../models/inventory');

router.get('/', async (req, res) => {
  try {
    const { status, sortBy = 'dateSent', order = 'desc' } = req.query;
    const query = {};
    if (status) query.status = status;
    const repairs = await Repair.find(query).sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    res.json({ success: true, count: repairs.length, data: repairs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);
    if (!repair) return res.status(404).json({ success: false, error: 'Repair entry not found' });
    res.json({ success: true, data: repair });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { componentName } = req.body;
    const updatedInventory = await Inventory.findOneAndUpdate(
      { name: componentName, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { new: true }
    );
    const decremented = Boolean(updatedInventory);
    const payload = {
      componentName: req.body.componentName,
      dateSent: req.body.dateSent,
      description: req.body.description,
      repairShop: req.body.repairShop,
      status: req.body.status,
      notes: req.body.notes,
      warrantyExpiry: req.body.warrantyExpiry,
      labName: req.body.labName,
      faultId: req.body.faultId,
      equipmentId: req.body.equipmentId,
      technicianId: req.body.technicianId,
      repairDate: req.body.repairDate,
      // numeric coercion
      cost: req.body.cost !== undefined && req.body.cost !== '' ? Number(req.body.cost) : 0,
      technicianAmount: req.body.technicianAmount !== undefined && req.body.technicianAmount !== '' ? Number(req.body.technicianAmount) : 0,
    };
    const repair = new Repair(payload);
    await repair.save();
    res.status(201).json({
      success: true,
      data: repair,
      warning: !decremented,
      message: decremented
        ? `Repair entry created. Inventory decremented for ${componentName}.`
        : `Repair entry created. Warning: ${componentName} is out of stock; inventory not decremented.`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, cost, technicianAmount, notes, warrantyExpiry } = req.body;
    const repair = await Repair.findById(req.params.id);
    if (!repair) return res.status(404).json({ success: false, error: 'Repair entry not found' });
    if (typeof status === 'string') repair.status = status;
    if (cost !== undefined) repair.cost = cost;
    if (technicianAmount !== undefined) repair.technicianAmount = technicianAmount;
    if (notes !== undefined) repair.notes = notes;
    if (warrantyExpiry) repair.warrantyExpiry = warrantyExpiry;
    if (status === 'received') {
      const now = new Date();
      repair.dateReceived = now < repair.dateSent ? repair.dateSent : now;
    }
    await repair.save();
    res.json({ success: true, data: repair, message: `Repair status updated to ${status}` });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch('/:id/receive', async (req, res) => {
  try {
    const { cost, technicianAmount, notes, warrantyExpiry } = req.body;
    const repair = await Repair.findById(req.params.id);
    if (!repair) return res.status(404).json({ success: false, error: 'Repair entry not found' });
    const now = new Date();
    const safeReceived = now < repair.dateSent ? repair.dateSent : now;
    repair.status = 'received';
    repair.dateReceived = safeReceived;
    if (cost !== undefined) repair.cost = cost;
    if (technicianAmount !== undefined) repair.technicianAmount = technicianAmount;
    if (notes) repair.notes = notes;
    if (warrantyExpiry) repair.warrantyExpiry = warrantyExpiry;
    await repair.save();
    const inventoryItem = await Inventory.findOne({ name: repair.componentName });
    if (inventoryItem) {
      await Inventory.findByIdAndUpdate(inventoryItem._id, { $inc: { quantity: 1 } });
    }
    res.json({ success: true, data: repair, message: 'Repair marked as received and inventory updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedRepair = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRepair) return res.status(404).json({ success: false, error: 'Repair entry not found' });
    res.json({ success: true, data: updatedRepair, message: 'Repair entry updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedRepair = await Repair.findByIdAndDelete(req.params.id);
    if (!deletedRepair) return res.status(404).json({ success: false, error: 'Repair entry not found' });
    res.json({ success: true, message: 'Repair entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;