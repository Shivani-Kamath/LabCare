


// const { RandomForestClassifier } = require("ml-random-forest");

// // Placeholder for trained model (in-memory)
// let model = null;

// // Train model using dataset
// function trainModel(dataset) {
//   const features = dataset.map(d => [d.ageInYears, d.faultCount, encodeCondition(d.condition)]);
//   const labels = dataset.map(d => d.faulty ? 1 : 0);

//   model = new RandomForestClassifier({
//     nEstimators: 100
//   });

//   model.train(features, labels);
//   return model;
// }

// // Predict function
// function predictFault({ ageInYears, faultCount, condition }) {
//   if (!model) {
//     // Fallback rule if model not trained
//     return ruleBasedPrediction({ ageInYears, faultCount, condition });
//   }

//   const prediction = model.predict([[ageInYears, faultCount, encodeCondition(condition)]])[0];
  
//   if (prediction === 1) {
//     return ruleBasedPrediction({ ageInYears, faultCount, condition });
//   } else {
//     return {
//       faulty: false,
//       component: null,
//       action: "Check",
//       time_to_action: "monitor",
//       priority_score: 1
//     };
//   }
// }

// // Encode condition to numeric for RF
// function encodeCondition(condition) {
//   switch(condition.toLowerCase()) {
//     case "good": return 0;
//     case "average": return 1;
//     case "poor": return 2;
//     case "working": return 0;
//     default: return 1;
//   }
// }

// // Rule-based output for faulty components
// function ruleBasedPrediction({ ageInYears, faultCount, condition }) {
//   let advice = "Check";
//   let time_to_action = "within 1 month";
//   let priority_score = faultCount + ageInYears;

//   if (faultCount > 3 || ageInYears > 3 || encodeCondition(condition) > 1) {
//     advice = "Replace";
//     time_to_action = "immediate";
//     priority_score += 5;
//   } else if (faultCount > 1 || encodeCondition(condition) === 1) {
//     advice = "Fix";
//     time_to_action = "within 1 month";
//     priority_score += 2;
//   }

//   return {
//     faulty: true,
//     action: advice,
//     time_to_action,
//     priority_score
//   };
// }

// module.exports = { trainModel, predictFault };

const { RandomForestClassifier } = require("ml-random-forest");

// In-memory trained model
let model = null;

/**
 * Train model using dataset
 * @param {Array} dataset - { ageInYears, faultCount, condition, faulty }
 */
function trainModel(dataset) {
  const features = dataset.map(d => [
    d.ageInYears,
    d.faultCount,
    encodeCondition(d.condition),
  ]);
  const labels = dataset.map(d => (d.faulty ? 1 : 0));

  model = new RandomForestClassifier({
    nEstimators: 150, // more trees = better accuracy
    maxFeatures: 2,
    replacement: true,
  });

  model.train(features, labels);
  console.log("✅ Random Forest model trained successfully");
  return model;
}

/**
 * Predict component fault and provide actionable insights
 * @param {Object} param0 - { ageInYears, faultCount, condition }
 */
function predictFault({ ageInYears, faultCount, condition }) {
  const conditionLevel = encodeCondition(condition);

  // If model not trained, use rule-based
  if (!model) {
    return advancedRulePrediction({ ageInYears, faultCount, condition });
  }

  const prediction = model.predict([
    [ageInYears, faultCount, conditionLevel],
  ])[0];

  if (prediction === 1) {
    // Predicted faulty → advanced rule-based advice
    return advancedRulePrediction({ ageInYears, faultCount, condition });
  }

  // Healthy component
  return {
    faulty: false,
    status: "✅ Healthy",
    action: "Monitor",
    time_to_action: "Regular check",
    priority_score: Math.max(1, 5 - faultCount),
    severity: "Low",
  };
}

/**
 * Encode textual condition to numeric
 */
function encodeCondition(condition) {
  switch (condition.toLowerCase()) {
    case "good":
    case "working":
      return 0;
    case "average":
      return 1;
    case "poor":
      return 2;
    default:
      return 1;
  }
}

/**
 * Advanced rule-based prediction for faulty components
 */
function advancedRulePrediction({ ageInYears = 0, faultCount = 0, condition = "average" }) {
  const conditionLevel = encodeCondition(condition);
  let advice = "Check";
  let time_to_action = "Within 1 month";
  let priority_score = faultCount + ageInYears;
  let severity = "Low";

  // Determine severity and actionable steps
  if (faultCount >= 5 || ageInYears > 5 || conditionLevel > 1) {
    advice = "Replace";
    time_to_action = "Immediate";
    priority_score += 10;
    severity = "Critical";
  } else if (faultCount >= 3 || ageInYears >= 3 || conditionLevel === 1) {
    advice = "Fix";
    time_to_action = "Within 2 weeks";
    priority_score += 5;
    severity = "High";
  } else if (faultCount >= 1) {
    advice = "Check";
    time_to_action = "Within 1 week";
    priority_score += 2;
    severity = "Medium";
  }

  // Cap priority score between 1–20
  priority_score = Math.min(Math.max(priority_score, 1), 20);

  return {
    faulty: true,
    status: "⚠️ Faulty",
    action: advice,
    time_to_action,
    priority_score,
    severity,
  };
}

module.exports = { trainModel, predictFault };
