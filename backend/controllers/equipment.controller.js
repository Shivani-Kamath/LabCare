const Equipment = require("../models/equipment");
const Inventory = require("../models/inventory");

// ➕ Add new equipment
exports.addEquipment = async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    res.status(201).json({ message: "Equipment added", equipment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📃 Get all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.status(200).json({ equipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get equipment by ID
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ equipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Equipment updated", updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ❌ Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Equipment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get equipment by lab number
exports.getEquipmentByLab = async (req, res) => {
  try {
    const labNumber = String(req.params.labNumber).toLowerCase();
    const list = await Equipment.find({ labNumber });
    res.json({ equipment: list });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Add equipment to a lab and update inventory
exports.addEquipmentToLab = async (req, res) => {
  try {
    const labNumber = String(req.params.labNumber).toLowerCase();
    const { name, quantity = 1, condition = 'good', purchaseDate } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const qty = Math.max(1, Number(quantity));

    // decrement inventory by item name
    const inv = await Inventory.findOne({ name });
    if (!inv || inv.quantity < qty) return res.status(400).json({ error: 'Insufficient stock' });
    await Inventory.updateOne({ _id: inv._id }, { $inc: { quantity: -qty } });

    // create equipment docs for the lab
    const pd = purchaseDate || new Date().toISOString().slice(0, 10);
    const toCreate = Array.from({ length: qty }).map(() => ({ name, labName: labNumber.toUpperCase(), labNumber, condition, purchaseDate: pd }));
    const created = await Equipment.insertMany(toCreate);

    res.status(201).json({ message: `Added ${qty} ${name} to ${labNumber}`, equipment: created });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
