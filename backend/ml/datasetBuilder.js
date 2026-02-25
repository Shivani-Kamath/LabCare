const Equipment = require("../models/equipment");
const Fault = require("../models/fault");

const conditionMap = { good: 0, average: 1, poor: 2 };

const buildDataset = async () => {
  try {
    const equipmentList = await Equipment.find({});
    const dataset = [];

    for (const eq of equipmentList) {
      const purchaseDate = new Date(eq.purchaseDate);
      const ageInYears = Math.max(
        0,
        Math.round((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365))
      );

      const faultCount = await Fault.countDocuments({ equipmentId: eq._id });

      // Label: 1 → faulty / needs attention
      const label = faultCount > 2 || eq.condition.toLowerCase() !== "good" || ageInYears > 3 ? 1 : 0;

      dataset.push({
        features: [ageInYears, faultCount, conditionMap[eq.condition.toLowerCase()] || 0],
        label
      });
    }

    return dataset;
  } catch (err) {
    console.error("Error building dataset:", err);
    return [];
  }
};

module.exports = { buildDataset };
