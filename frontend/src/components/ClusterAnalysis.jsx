// src/components/ClusterAnalysis.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const ClusterAnalysis = () => {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await axios.get("/api/kmeans/analyze");
        setClusters(res.data.clusters || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClusters();
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-2">Fault Clustering by Lab</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Lab</th>
            <th className="p-2">Cluster ID</th>
          </tr>
        </thead>
        <tbody>
          {clusters.map((item, idx) => (
            <tr key={idx}>
              <td className="p-2">{item.lab}</td>
              <td className="p-2">{item.cluster}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClusterAnalysis;
