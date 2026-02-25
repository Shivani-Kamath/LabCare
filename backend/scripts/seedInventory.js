const mongoose = require('mongoose');
const path = require('path');

const dbConfig = require(path.join(__dirname, '..', 'config', 'db.config.js'));
const Inventory = require(path.join(__dirname, '..', 'models', 'inventory.js'));

async function run() {
  try {
    await mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });

    const items = [
      { name: 'RAM 8GB DDR4', category: 'Hardware', quantity: 15, minThreshold: 3, description: 'DDR4 2666MHz' },
      { name: 'SSD 256GB', category: 'Hardware', quantity: 10, minThreshold: 2, description: 'SATA SSD' },
      { name: 'Keyboard USB', category: 'Peripherals', quantity: 25, minThreshold: 5 },
      { name: 'Mouse USB', category: 'Peripherals', quantity: 30, minThreshold: 5 },
      { name: 'HDMI Cable', category: 'Accessories', quantity: 20, minThreshold: 5 },
      { name: 'Power Cable', category: 'Accessories', quantity: 18, minThreshold: 4 }
    ];

    for (const item of items) {
      await Inventory.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true });
    }

    const count = await Inventory.countDocuments();
    console.log(`Seed complete. Inventory items: ${count}`);
  } catch (e) {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();


