import React, { useState, useEffect } from 'react';
import { FaIdCard, FaPassport, FaFile, FaCheck, FaTimes } from 'react-icons/fa';
import DocumentVerificationMessageForm from './DocumentVerificationMessageForm';
import { getDriver, getAccessToken } from "../../services/AuthService";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../../assets/logo.png";
 

const DocumentUploadForm = () => {
  const [formData, setFormData] = useState({
    identity_document: null,
    driver_licence: null,
    criminal_record_check: null,
    vehicle_registration: null,
  });

  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const token = getAccessToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverId = async () => {
      try {
        if (token) {
          const driver = await getDriver();
          console.log('Driver ID:', driver.id);
        }
      } catch (error) {
        console.error('Error fetching driver ID:', error);
      }
    };

    fetchDriverId();
  }, [token]);

  useEffect(() => {
    const checkDriverVerification = async () => {
      if (token) {
        const driver = await getDriver();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/driver/verification-check/${driver.id}/`, config);
          if (response.data.verified === true) {
            navigate('/dashboard/driver');
          }
          console.log(response.data.verified === true);
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkDriverVerification();
  }, [token]);

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [fileType]: file });
  };

  const handleRemoveFile = (fileType) => {
    setFormData({ ...formData, [fileType]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (!formData[key]) {
        alert('All documents are required');
        return;
      }
    }

    try {
      const driver = await getDriver();
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/driver/profile/${driver.id}/`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);

      if (response.status === 200) {
        setSubmissionSuccess(true);
        navigate('/dashboard/driver');
      } else {
        console.error('Failed to upload documents');
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#404042] px-4">
      <div className="bg-white rounded shadow-md w-full max-w-lg p-6">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Toota Logo" className="w-24 h-24" />
        </div>
        {!submissionSuccess ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-[#f89f1b] text-center">Driver Document Verification</h2>
            <p className="text-gray-700 mb-4 text-center">
              To verify your identity and ensure compliance, we require you to upload the following documents:
            </p>
            <p className="text-sm text-gray-700 mb-6 text-center">
              Please upload a clear image or scanned copy of your National ID Card or Passport, along with your Driver's License. Ensure the documents are legible and contain all required details.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="idDocument">
                  <FaIdCard className="inline-block mr-2" />
                  National ID Card or Passport <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  {formData.identity_document ? (
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="text-gray-700">{formData.identity_document.name}</span>
                      <FaTimes className="text-red-500 ml-2 cursor-pointer" onClick={() => handleRemoveFile('identity_document')} />
                    </div>
                  ) : (
                    <input
                      type="file"
                      id="idDocument"
                      name="idDocument"
                      onChange={(e) => handleFileChange(e, 'identity_document')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
                      required
                    />
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="driverLicense">
                  <FaFile className="inline-block mr-2" />
                  Driver's License <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  {formData.driver_licence ? (
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="text-gray-700">{formData.driver_licence.name}</span>
                      <FaTimes className="text-red-500 ml-2 cursor-pointer" onClick={() => handleRemoveFile('driver_licence')} />
                    </div>
                  ) : (
                    <input
                      type="file"
                      id="driverLicense"
                      name="driverLicense"
                      onChange={(e) => handleFileChange(e, 'driver_licence')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
                      required
                    />
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="criminalRecordCheck">
                  <FaFile className="inline-block mr-2" />
                  Criminal Record Check <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  {formData.criminal_record_check ? (
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="text-gray-700">{formData.criminal_record_check.name}</span>
                      <FaTimes className="text-red-500 ml-2 cursor-pointer" onClick={() => handleRemoveFile('criminal_record_check')} />
                    </div>
                  ) : (
                    <input
                      type="file"
                      id="criminalRecordCheck"
                      name="criminalRecordCheck"
                      onChange={(e) => handleFileChange(e, 'criminal_record_check')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
                      required
                    />
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2" htmlFor="vehicleRegistration">
                  <FaFile className="inline-block mr-2" />
                  Vehicle Registration <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  {formData.vehicle_registration ? (
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className="text-gray-700">{formData.vehicle_registration.name}</span>
                      <FaTimes className="text-red-500 ml-2 cursor-pointer" onClick={() => handleRemoveFile('vehicle_registration')} />
                    </div>
                  ) : (
                    <input
                      type="file"
                      id="vehicleRegistration"
                      name="vehicleRegistration"
                      onChange={(e) => handleFileChange(e, 'vehicle_registration')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-[#f89f1b]"
                      required
                    />
                  )}
                </div>
              </div>
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-[#f89f1b] text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-200 focus:outline-none focus:shadow-outline"
                >
                  Submit Documents
                </button>
              </div>
            </form>
          </>
        ) : (
          <DocumentVerificationMessageForm />
        )}
      </div>
    </div>
  );
};

export default DocumentUploadForm;

