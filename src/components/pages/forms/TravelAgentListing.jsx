import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { BASE_URL } from '../../../Api/urls';

const TravelAgentList = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    // Fetch Travel Agent submissions from API
    const fetchData = async()=>{
      const resp = await  axios.get(`${BASE_URL}travel-agents`)
       setAgents(resp.data.data)
    }
    fetchData()
  
  }, []);

  const openModal = (agent) => {
    setSelectedAgent(agent);
  };

  const closeModal = () => {
    setSelectedAgent(null);
  };

  return (
    <div className="p-8 bg-slate-300 min-h-[89%]">
      <h1 className="text-3xl font-bold text-[#F26337] mb-6">Travel Agent Submissions</h1>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-2">Name</th>
            <th className="border border-black p-2">Email</th>
            <th className="border border-black p-2">Phone</th>
            <th className="border border-black p-2">Description</th>
            <th className="border border-black p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents?.map((agent) => (
            <tr key={agent._id} className='text-center'>
              <td className="border border-black p-2">{agent?.name}</td>
              <td className="border border-black p-2">{agent?.email}</td>
              <td className="border border-black p-2">{agent?.phoneNumber}</td>
              <td className="border border-black p-2">{agent?.description}</td>
              <td className="border border-black p-2">
                <button onClick={() => openModal(agent)}>
                  <FaEye className="text-xl text-[#F26337]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAgent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Agent Details</h2>
            <p><strong>Name:</strong> {selectedAgent.name}</p>
            <p><strong>Email:</strong> {selectedAgent.email}</p>
            <p><strong>Phone:</strong> {selectedAgent.phoneNumber}</p>
            <p><strong>Description:</strong> {selectedAgent.description}</p>
            <button className="mt-4 bg-[#F26337] text-white p-2 rounded" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelAgentList;
