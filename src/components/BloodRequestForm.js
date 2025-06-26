import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    personalDetails: {
      fullName: '',
      mobileNumber: '',
      emailAddress: '',
      relationshipToPatient: '',
      patientAge: '',
      gender: 'Male'
    },
    bloodRequirementDetails: {
      requiredBloodGroup: '',
      unitsNeeded: '',
      neededOn: '',
      isEmergency: false,
      reasonForRequest: '',
      hospitalName: '',
      contactNumber: '',
      hospitalAddress: '',
      doctorReferenceName: ''
    },
    locationDetails: {
      state: '',
      city: '',
      area: '',
      pinCode: '',
      currentLocation: ''
    },
    additionalInformation: {
      patientId: '',
      ongoingTreatment: false,
      uploadDoctorNote: '',
      termsAccepted: false
    }
  });

  const handleChange = (e, section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value
      }
    }));
  };

  const handleCheckboxChange = (e, section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/requester', formData);
      toast.success('Blood request submitted successfully!');
      // Reset form after successful submission
      setFormData({
        personalDetails: {
          fullName: '',
          mobileNumber: '',
          emailAddress: '',
          relationshipToPatient: '',
          patientAge: '',
          gender: 'Male'
        },
        bloodRequirementDetails: {
          requiredBloodGroup: '',
          unitsNeeded: '',
          neededOn: '',
          isEmergency: false,
          reasonForRequest: '',
          hospitalName: '',
          contactNumber: '',
          hospitalAddress: '',
          doctorReferenceName: ''
        },
        locationDetails: {
          state: '',
          city: '',
          area: '',
          pinCode: '',
          currentLocation: ''
        },
        additionalInformation: {
          patientId: '',
          ongoingTreatment: false,
          uploadDoctorNote: '',
          termsAccepted: false
        }
      });
    } catch (error) {
      toast.error('Error submitting blood request: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blood Request Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.personalDetails.fullName}
                onChange={(e) => handleChange(e, 'personalDetails', 'fullName')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.personalDetails.mobileNumber}
                onChange={(e) => handleChange(e, 'personalDetails', 'mobileNumber')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.personalDetails.emailAddress}
                onChange={(e) => handleChange(e, 'personalDetails', 'emailAddress')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Relationship to Patient</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.personalDetails.relationshipToPatient}
                onChange={(e) => handleChange(e, 'personalDetails', 'relationshipToPatient')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Age</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.personalDetails.patientAge}
                onChange={(e) => handleChange(e, 'personalDetails', 'patientAge')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.personalDetails.gender}
                onChange={(e) => handleChange(e, 'personalDetails', 'gender')}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blood Requirement Details Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Blood Requirement Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Required Blood Group</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.bloodRequirementDetails.requiredBloodGroup}
                onChange={(e) => handleChange(e, 'bloodRequirementDetails', 'requiredBloodGroup')}
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Units Needed</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.bloodRequirementDetails.unitsNeeded}
                onChange={(e) => handleChange(e, 'bloodRequirementDetails', 'unitsNeeded')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Needed On</label>
              <input
                type="datetime-local"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.bloodRequirementDetails.neededOn}
                onChange={(e) => handleChange(e, 'bloodRequirementDetails', 'neededOn')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Is Emergency?</label>
              <input
                type="checkbox"
                className="mt-2"
                checked={formData.bloodRequirementDetails.isEmergency}
                onChange={(e) => handleCheckboxChange(e, 'bloodRequirementDetails', 'isEmergency')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason for Request</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.bloodRequirementDetails.reasonForRequest}
                onChange={(e) => handleChange(e, 'bloodRequirementDetails', 'reasonForRequest')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.bloodRequirementDetails.hospitalName}
                onChange={(e) => handleChange(e, 'bloodRequirementDetails', 'hospitalName')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.bloodRequirementDetails.contactNumber}
                onChange={(e) => handleChange(e, 'bloodRequirementDetails', 'contactNumber')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hospital Address</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.bloodRequirementDetails.hospitalAddress}
                onChange={(e) => handleChange(e, 'bloodRequirementDetails', 'hospitalAddress')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor Reference Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.bloodRequirementDetails.doctorReferenceName}
                onChange={(e) => handleChange(e, 'bloodRequirementDetails', 'doctorReferenceName')}
              />
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.locationDetails.state}
                onChange={(e) => handleChange(e, 'locationDetails', 'state')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.locationDetails.city}
                onChange={(e) => handleChange(e, 'locationDetails', 'city')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.locationDetails.area}
                onChange={(e) => handleChange(e, 'locationDetails', 'area')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pin Code</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.locationDetails.pinCode}
                onChange={(e) => handleChange(e, 'locationDetails', 'pinCode')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Location</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.locationDetails.currentLocation}
                onChange={(e) => handleChange(e, 'locationDetails', 'currentLocation')}
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient ID</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.additionalInformation.patientId}
                onChange={(e) => handleChange(e, 'additionalInformation', 'patientId')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ongoing Treatment?</label>
              <input
                type="checkbox"
                className="mt-2"
                checked={formData.additionalInformation.ongoingTreatment}
                onChange={(e) => handleCheckboxChange(e, 'additionalInformation', 'ongoingTreatment')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Doctor Note</label>
              <input
                type="file"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    additionalInformation: {
                      ...prev.additionalInformation,
                      uploadDoctorNote: e.target.files[0]
                    }
                  }));
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Accept Terms</label>
              <input
                type="checkbox"
                className="mt-2"
                checked={formData.additionalInformation.termsAccepted}
                onChange={(e) => handleCheckboxChange(e, 'additionalInformation', 'termsAccepted')}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default BloodRequestForm;
