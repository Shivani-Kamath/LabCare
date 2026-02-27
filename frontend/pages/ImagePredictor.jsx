// import { useState } from "react";
// import axios from "axios";

// const ImagePredictor = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//     setPrediction("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       alert("Please select an image!");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("image", selectedFile);

//     try {
//       const res = await axios.post("http://127.0.0.1:5001/predict", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setPrediction(res.data.predicted_class);
//     } catch (err) {
//       console.error("Prediction error:", err);
//       alert("Failed to predict. Check console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
//       <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl">
//         <h2 className="text-2xl font-bold mb-4">🖼️ Image Fault Predictor</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
//                        file:rounded-full file:border-0
//                        file:text-sm file:font-semibold
//                        file:bg-purple-600 file:text-white
//                        hover:file:bg-purple-700"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg"
//           >
//             {loading ? "Predicting..." : "Predict Fault"}
//           </button>
//         </form>

//         {prediction && (
//           <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-800 font-semibold">
//             Predicted Fault: {prediction}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // export default ImagePredictor;
// import { useState } from "react";
// import axios from "axios";

// const ImagePredictor = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//     setPrediction("");
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       alert("Please select an image!");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const formData = new FormData();
//     formData.append("image", selectedFile);

//     try {
//       const res = await axios.post("http://127.0.0.1:5002/predict", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setPrediction(res.data.predicted_class);
//     } catch (err) {
//       console.error("Prediction error:", err);
//       setError("Failed to predict. Please check backend logs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
//       <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl">
//         <h2 className="text-2xl font-bold mb-4">🖼️ Image Fault Predictor</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
//                        file:rounded-full file:border-0
//                        file:text-sm file:font-semibold
//                        file:bg-purple-600 file:text-white
//                        hover:file:bg-purple-700"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg"
//           >
//             {loading ? "Predicting..." : "Predict Fault"}
//           </button>
//         </form>

//         {error && (
//           <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         {prediction && (
//           <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-800 font-semibold">
//             ✅ Predicted Fault: {prediction}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImagePredictor;



// import { useState } from "react";
// import axios from "axios";

// const ImagePredictor = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//     setPrediction("");
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       alert("Please select an image!");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const formData = new FormData();
//     formData.append("file", selectedFile); // ✅ backend expects "file"

//     try {
//       const res = await axios.post("http://127.0.0.1:5002/predict", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setPrediction(res.data.predicted_class); // ✅ now shows class name
//     } catch (err) {
//       console.error("Prediction error:", err);
//       setError("Failed to predict. Please check backend logs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
//       <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-xl">
//         <h2 className="text-2xl font-bold mb-4">🖼️ Image Fault Predictor</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
//                        file:rounded-full file:border-0
//                        file:text-sm file:font-semibold
//                        file:bg-purple-600 file:text-white
//                        hover:file:bg-purple-700"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg"
//           >
//             {loading ? "Predicting..." : "Predict Fault"}
//           </button>
//         </form>

//         {error && (
//           <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
//             {error}
//           </div>
//         )}

//         {prediction && (
//           <div className="mt-6 p-4 bg-green-100 rounded-lg text-green-800 font-semibold">
//             ✅ Predicted Fault: {prediction}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImagePredictor;


import { useState } from "react";
import axios from "axios";
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LogoutButton from '../components/ui/LogoutButton';

const ImagePredictor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image!");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://127.0.0.1:5002/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data); // ✅ now stores status + type
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to predict. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas to-neutral-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">🖼️ AI Fault Predictor</h1>
            <p className="text-neutral-600 mt-2">Upload an image to automatically detect equipment faults using AI</p>
          </div>
          <LogoutButton />
        </div>

        {/* Upload Section */}
        <Card>
          <h3 className="text-xl font-semibold text-ink mb-4">📤 Upload Equipment Image</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="lc-label">Select Image</label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-neutral-500 file:mr-4 file:py-3 file:px-6
                             file:rounded-lg file:border-0
                             file:text-sm file:font-medium
                             file:bg-brand-600 file:text-white
                             hover:file:bg-brand-700 file:cursor-pointer
                             cursor-pointer"
                />
              </div>
              {selectedFile && (
                <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium">Selected:</span> {selectedFile.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={loading || !selectedFile}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 px-8 py-3"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing...
                  </div>
                ) : (
                  "🔍 Analyze Image"
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <div className="text-red-600 text-xl">❌</div>
              <div>
                <h4 className="font-semibold text-red-800">Prediction Failed</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Results Display */}
        {result && (
          <Card className="border-green-200 bg-green-50">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Analysis Complete!</h3>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-neutral-600 mb-1">Status</div>
                  <div className="text-lg font-semibold text-ink">{result.status}</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-neutral-600 mb-1">Fault Type</div>
                  <div className="text-lg font-semibold text-brand-600">🔧 {result.type}</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-neutral-600">
                  This AI prediction can help technicians quickly identify and prioritize equipment issues.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <h3 className="text-lg font-semibold text-ink mb-4">📋 How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">📷</div>
              <h4 className="font-medium text-ink mb-1">1. Take Photo</h4>
              <p className="text-sm text-neutral-600">Capture a clear image of the faulty equipment</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⬆️</div>
              <h4 className="font-medium text-ink mb-1">2. Upload Image</h4>
              <p className="text-sm text-neutral-600">Select and upload the image file</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h4 className="font-medium text-ink mb-1">3. Get Results</h4>
              <p className="text-sm text-neutral-600">AI analyzes and provides fault prediction</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImagePredictor;
