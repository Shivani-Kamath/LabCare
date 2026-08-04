const KNN = require('ml-knn');

// Sample training data
const trainingData = [
  { age: 2, faultCount: 3, type: "PC", result: "likely" },
  { age: 5, faultCount: 0, type: "Projector", result: "unlikely" },
  { age: 3, faultCount: 2, type: "Printer", result: "likely" },
];

// Convert categorical 'type' to numeric manually (basic encoding)
const typeMap = { PC: 0, Projector: 1, Printer: 2 };
const inverseResultMap = { 0: "unlikely", 1: "likely" };

// Prepare features and labels
const features = trainingData.map(item => [
  item.age,
  item.faultCount,
  typeMap[item.type]
]);
const labels = trainingData.map(item => item.result === "likely" ? 1 : 0);

// Create KNN model
const knn = new KNN(features, labels, { k: 3 }); // You can change k value

// Prediction function
const predictFaultKNN = (input) => {
  const vector = [
    input.age,
    input.faultCount,
    typeMap[input.type] ?? -1 // handle unknown types
  ];
  const [prediction] = knn.predict([vector]);
  return inverseResultMap[prediction];
};

module.exports = predictFaultKNN;
