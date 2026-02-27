import axios from "axios";

export const trainModel = async () => {
  const res = await axios.post("http://localhost:5000/api/ml/train");
  return res.data;
};

export const predictDevices = async (componentIds) => {
  const res = await axios.post("http://localhost:5000/api/ml/predict-fault", { componentIds });
  return res.data; // This will be the array of prediction results
};
