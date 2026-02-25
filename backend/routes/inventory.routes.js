const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');
const Equipment = require('../models/equipment');

router.get('/', async (req, res) => {
  try {
    const { category, lowStock, sortBy = 'name', order = 'asc' } = req.query;
    const query = {};
    if (category) query.category = category;
    let items = await Inventory.find(query).sort({ [sortBy]: order === 'desc' ? -1 : 1 });
    if (lowStock === 'true') items = items.filter(i => i.isLowStock);
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Inventory item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, quantity = 1 } = req.body;
    if (!['add', 'remove', 'set'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action. Use: add, remove, or set' });
    }
    const item = await Inventory.findById(id);
    if (!item) return res.status(404).json({ success: false, error: 'Inventory item not found' });
    let newQuantity = item.quantity;
    if (action === 'add') newQuantity = item.quantity + quantity;
    if (action === 'remove') newQuantity = Math.max(0, item.quantity - quantity);
    if (action === 'set') newQuantity = Math.max(0, quantity);
    const updatedItem = await Inventory.findOneAndUpdate(
      { _id: id, quantity: { $gte: 0 } },
      { $set: { quantity: newQuantity < 0 ? 0 : newQuantity } },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updatedItem, message: 'Quantity updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, message: 'Inventory item created successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'An item with this name already exists' });
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedItem) return res.status(404).json({ success: false, error: 'Inventory item not found' });
    res.json({ success: true, data: updatedItem, message: 'Inventory item updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ success: false, error: 'Inventory item not found' });
    res.json({ success: true, message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

// --------------------------- LAB ALLOCATION ---------------------------

// Allocate inventory items to a lab (Lab Incharge limited control)
router.post('/allocate', async (req, res) => {
  try {
    const { inventoryId, labName, quantity = 1, purchaseDate, condition = 'good' } = req.body;
    if (!inventoryId || !labName) {
      return res.status(400).json({ success: false, error: 'inventoryId and labName are required' });
    }
    const qty = Math.max(1, Number(quantity));
    const item = await Inventory.findById(inventoryId);
    if (!item) return res.status(404).json({ success: false, error: 'Inventory item not found' });
    if (item.quantity < qty) return res.status(400).json({ success: false, error: 'Insufficient stock' });

    // Decrement global stock
    item.quantity -= qty;
    await item.save();

    // Create equipment entries tagged to lab
    const today = purchaseDate || new Date().toISOString().slice(0, 10);
    const toCreate = Array.from({ length: qty }).map(() => ({
      name: item.name,
      labName,
      purchaseDate: today,
      condition,
    }));
    await Equipment.insertMany(toCreate);

    res.json({ success: true, message: `Allocated ${qty} ${item.name} to ${labName}`, remaining: item.quantity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Release equipment from a lab back to inventory (increase stock)
router.post('/release', async (req, res) => {
  try {
    const { name, labName, quantity = 1 } = req.body;
    if (!name || !labName) return res.status(400).json({ success: false, error: 'name and labName are required' });
    const qty = Math.max(1, Number(quantity));

    // Find equipment documents to delete
    const equipments = await Equipment.find({ name, labName }).sort({ _id: -1 }).limit(qty);
    if (equipments.length === 0) return res.status(404).json({ success: false, error: 'No equipment found to release' });

    const ids = equipments.map(e => e._id);
    await Equipment.deleteMany({ _id: { $in: ids } });

    // Increment inventory stock for the item name
    const updated = await Inventory.findOneAndUpdate(
      { name },
      { $inc: { quantity: equipments.length } },
      { new: true }
    );

    res.json({ success: true, message: `Released ${equipments.length} ${name} from ${labName}`, currentStock: updated?.quantity ?? null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});