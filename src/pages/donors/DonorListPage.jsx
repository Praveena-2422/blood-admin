import React, { useEffect, useState, useRef } from "react";
import { apiClient } from '../../network/apiClient';
import MasterLayout from "../../masterLayout/MasterLayout";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';


const DonorListPage = () => {
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const tableRef = useRef(null);
    const dataTableRef = useRef(null);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State/City Dropdown State
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    // Donor form state
    const [donorFormData, setDonorFormData] = useState({
        fullName: '',
        mobileNumber: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        heightCm: '',
        weightKg: '',
        lastDonationDate: '',
        eligibleToDonate: true,
        state: '',
        city: '',
        area: '',
        pinCode: '',
        emergencyContactNumber: '',
        existingHealthIssues: '',
        agreedToTerms: false
    });

    // Success message state
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // View donor details state
    const [selectedDonor, setSelectedDonor] = useState(null);

    // Cleanup function for modal state
    const resetModalState = () => {
        setDonorFormData({
            fullName: '',
            mobileNumber: '',
            email: '',
            dateOfBirth: '',
            gender: '',
            bloodGroup: '',
            heightCm: '',
            weightKg: '',
            lastDonationDate: '',
            eligibleToDonate: true,
            state: '',
            city: '',
            area: '',
            pinCode: '',
            emergencyContactNumber: '',
            existingHealthIssues: '',
            agreedToTerms: false
        });
        setSelectedState("");
        setSelectedCity("");
        setError('');
        setSuccessMessage('');
        setIsSubmitting(false);
    };

    // Fetch states for India on mount
    useEffect(() => {
        fetchStates("India");
    }, []);

    // Fetch cities when state changes
    useEffect(() => {
        if(selectedState) {
            fetchCities("India", selectedState);
        } else {
            setCities([]);
            setSelectedCity("");
        }
    }, [selectedState]);

    // Handle modal cleanup
    useEffect(() => {
        const modal = document.getElementById('addDonorModal');
        if (modal) {
            const handleModalHidden = () => {
                resetModalState();
            };
            
            modal.addEventListener('hidden.bs.modal', handleModalHidden);
            
            return () => {
                modal.removeEventListener('hidden.bs.modal', handleModalHidden);
            };
        }
    }, []);

    // Fetch states API
    const fetchStates = async (countryName) => {
        setIsLoadingStates(true);
        try {
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/states/q?country=${encodeURIComponent(countryName)}`);
            if (!response.ok) throw new Error("Failed to fetch states");
            const data = await response.json();
            if (data.error === false) {
                setStates(data.data.states.map(s => s.name));
                setSelectedState("");
                setCities([]);
                setSelectedCity("");
            } else {
                setStates([]);
            }
        } catch (e) {
            setStates([]);
        } finally {
            setIsLoadingStates(false);
        }
    };

    // Fetch cities API
    const fetchCities = async (countryName, stateName) => {
        setIsLoadingCities(true);
        try {
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}`);
            if (!response.ok) throw new Error("Failed to fetch cities");
            const data = await response.json();
            if (data.error === false) {
                setCities(data.data);
                setSelectedCity("");
            } else {
                setCities([]);
            }
        } catch (e) {
            setCities([]);
        } finally {
            setIsLoadingCities(false);
        }
    };

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                // Fetch from the new backend endpoint
                const response = await apiClient.get('/user/getAllUser');
                console.log('API Response:', response.data); // Debug log
                const data = response.data;
                if (data && data.data) {
                    setDonors(data.data.map(donor => ({
                        name: donor.fullName,
                        bloodGroup: donor.bloodGroup,
                        mobileNo: donor.mobileNumber,
                        lastDate: donor.lastDonationDate,
                        address: `${donor.area}, ${donor.city}`,
                        email: donor.email,
                        dateOfBirth: donor.dateOfBirth,
                        gender: donor.gender,
                        heightCm: donor.heightCm,
                        weightKg: donor.weightKg,
                        eligibleToDonate: donor.eligibleToDonate,
                        emergencyContactNumber: donor.emergencyContactNumber,
                        existingHealthIssues: donor.existingHealthIssues,
                        state: donor.state,
                        city: donor.city,
                        area: donor.area,
                        pinCode: donor.pinCode
                    })));
                } else {
                    setError('Invalid API response format');
                    console.error('Invalid API response format', data);
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch donors');
                console.error('Error fetching donors:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonors();
    }, [refreshTrigger]);

    const isAvailable = (lastDate) => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return new Date(lastDate) < threeMonthsAgo;
    };

    const filteredDonors = availabilityFilter === 'all'
        ? donors
        : donors.filter(donor => {
            const available = isAvailable(donor.lastDate);
            return availabilityFilter === 'available' ? available : !available;
        });

    useEffect(() => {
        // Only initialize DataTable when data is loaded and rendered
        if (!loading && !error && tableRef.current) {
            // Destroy existing DataTable if it exists
            if (dataTableRef.current) {
                try {
                    dataTableRef.current.destroy();
                } catch (e) {
                    console.log('DataTable destroy error:', e);
                }
                dataTableRef.current = null;
            }

            // Small delay to ensure DOM is ready
            setTimeout(() => {
                if (tableRef.current) {
                    try {
                        dataTableRef.current = $(tableRef.current).DataTable({
                            pageLength: 10,
                            responsive: true,
                            scrollX: false,
                            destroy: true // Allow table to be destroyed and recreated
                        });
                    } catch (e) {
                        console.log('DataTable initialization error:', e);
                    }
                }
            }, 100);
        }

        // Cleanup function
        return () => {
            if (dataTableRef.current) {
                try {
                    dataTableRef.current.destroy();
                } catch (e) {
                    console.log('DataTable cleanup error:', e);
                }
                dataTableRef.current = null;
            }
        };
    }, [filteredDonors, loading, error]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDonorFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Special handling for state/city dropdowns
        if (name === "state") {
            setSelectedState(value);
            setDonorFormData(prev => ({ ...prev, state: value, city: "" }));
        } else if (name === "city") {
            setSelectedCity(value);
            setDonorFormData(prev => ({ ...prev, city: value }));
        } else {
            setDonorFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleViewDonorDetails = (donor) => {
        setSelectedDonor(donor);
        // Open the view donor modal using data-bs-toggle
        const modalElement = document.getElementById('viewDonorModal');
        if (modalElement) {
            // Try using Bootstrap Modal if available
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();
            } else {
                // Fallback: manually show the modal
                modalElement.classList.add('show');
                modalElement.style.display = 'block';
                modalElement.setAttribute('aria-hidden', 'false');
                
                // Add backdrop
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show';
                document.body.appendChild(backdrop);
                
                // Handle close on backdrop click
                backdrop.addEventListener('click', () => {
                    handleCloseViewModal();
                });
            }
        }
    };

    const handleCloseViewModal = () => {
        const modalElement = document.getElementById('viewDonorModal');
        if (modalElement) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            } else {
                // Fallback: manually hide the modal
                modalElement.classList.remove('show');
                modalElement.style.display = 'none';
                modalElement.setAttribute('aria-hidden', 'true');
                
                // Remove backdrop
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }
        }
        setSelectedDonor(null);
    };

    const handleAddDonor = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');
        
        try {
            // Validate required fields
            if (!donorFormData.fullName || !donorFormData.mobileNumber || !donorFormData.dateOfBirth || 
                !donorFormData.gender || !donorFormData.bloodGroup || !donorFormData.heightCm || 
                !donorFormData.weightKg || !donorFormData.lastDonationDate || !donorFormData.state || 
                !donorFormData.city || !donorFormData.area || !donorFormData.pinCode || 
                !donorFormData.emergencyContactNumber || !donorFormData.existingHealthIssues || 
                !donorFormData.agreedToTerms) {
                setError('Please fill all required fields');
                return;
            }

            const payload = {
                fullName: donorFormData.fullName,
                mobileNumber: donorFormData.mobileNumber,
                email: donorFormData.email || '',
                dateOfBirth: donorFormData.dateOfBirth,
                gender: donorFormData.gender,
                bloodGroup: donorFormData.bloodGroup,
                heightCm: Number(donorFormData.heightCm),
                weightKg: Number(donorFormData.weightKg),
                lastDonationDate: donorFormData.lastDonationDate || null,
                eligibleToDonate: donorFormData.eligibleToDonate,
                state: donorFormData.state,
                city: donorFormData.city,
                area: donorFormData.area,
                pinCode: donorFormData.pinCode,
                existingHealthIssues: donorFormData.existingHealthIssues,
                emergencyContactNumber: donorFormData.emergencyContactNumber,
                agreedToTerms: donorFormData.agreedToTerms
            };
            
            console.log('Adding donor:', payload);
            
            // Call the register API
            const response = await apiClient.post('/user/register', payload);
            console.log('Register response:', response.data);
            
            if (response.data.success) {
                // Show success message
                setSuccessMessage('Donor registered successfully!');
                setError(''); // Clear any previous errors
                
                // Reset form
                resetModalState();
                
                // Close modal safely
                setTimeout(() => {
                    const modal = document.getElementById('addDonorModal');
                    if (modal) {
                        const modalInstance = window.bootstrap?.Modal?.getInstance(modal);
                        if (modalInstance) {
                            modalInstance.hide();
                        } else {
                            // Fallback: use data-bs-dismiss
                            const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
                            if (closeButton) {
                                closeButton.click();
                            }
                        }
                    }
                    
                    // Refresh donors list after modal is closed
                    setTimeout(() => {
                        setRefreshTrigger(prev => prev + 1);
                    }, 300);
                }, 500);
                
            } else {
                setError(response.data.message || 'Failed to register donor');
            }
            
        } catch (err) {
            console.error('Error adding donor:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message || 'Failed to add donor');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MasterLayout>
            <style>
                {`
                    .dataTables_wrapper .dataTables_scrollBody {
                        overflow: visible !important;
                        position: relative;
                        z-index: 1;
                    }
                    .dataTables_wrapper {
                        overflow: visible !important;
                        position: relative;
                    }
                    table.dataTable td, table.dataTable th {
                        overflow: visible !important;
                        position: relative;
                        z-index: 1;
                    }
                `}
            </style>
            <div className="card basic-data-table">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="card-title mb-0 text-sm">Donor List</h5>
                    <button
                        type="button"
                        className="btn btn-primary-p text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                        data-bs-toggle="modal"
                        data-bs-target="#addDonorModal"
                    >
                        <Icon
                            icon="fa6-regular:square-plus"
                            className="icon text-lg line-height-1"
                        />
                        Add Donor
                    </button>
                </div>
                <div className="card-body" style={{ position: 'relative' }}>
                    {loading && <div>Loading...</div>}
                    {error && <div>Error: {error}</div>}
                    <table
                        ref={tableRef}
                        className="table bordered-table mb-0 text-xs"
                        id="dataTable"
                        key={`donor-table-${donors.length}-${loading}`}
                        data-page-length={10}
                    >
                        <thead>
                            <tr>
                                <th className="text-xs">S No</th>
                                <th className="text-xs">Name</th>
                                <th className="text-xs">Blood Group</th>
                                <th className="text-xs">Mobile No</th>
                                <th className="text-xs">Last Donation</th>
                                <th className="text-xs">Availability</th>
                                <th className="text-xs">Address</th>
                                <th className="text-xs">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonors.map((donor, idx) => {
                                const available = isAvailable(donor.lastDate);
                                return (
                                    <tr key={idx}>
                                        <td className="text-xs">{idx + 1}</td>
                                        <td className="text-xs">{donor.name}</td>
                                        <td className="text-xs">{donor.bloodGroup}</td>
                                        <td className="text-xs">{donor.mobileNo}</td>
                                        <td className="text-xs">{formatDate(donor.lastDate)}</td>
                                        <td className="text-xs">
                                            <span className={`badge ${available ? 'bg-success' : 'bg-danger'}`}>
                                                {available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="text-xs">{donor.address}</td>
                                        <td className="text-xs">
                                            <button
                                                type="button"
                                                onClick={() => handleViewDonorDetails(donor)}
                                                className="w-24-px h-24-px me-4 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center border-0"
                                                title="View Details"
                                            >
                                                <Icon icon="iconamoon:eye-light" width="12" />
                                            </button>
                                            <Link
                                                to="#"
                                                className="w-24-px h-24-px me-4 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                            >
                                                <Icon icon="fluent-mdl2:accept" width="12" />
                                            </Link>
                                            <Link
                                                to="#"
                                                className="w-24-px h-24-px me-4 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                            >
                                                <Icon icon="material-symbols:cancel" width="12" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Donor Modal */}
            <div
                className="modal fade"
                id="addDonorModal"
                tabIndex={-1}
                aria-labelledby="addDonorModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="addDonorModalLabel">
                                Add New Donor
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            {successMessage && (
                                <div className="alert alert-success mb-3" role="alert">
                                    {successMessage}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger mb-3" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleAddDonor}>
                                <div className="row">
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-control radius-8"
                                            placeholder="Enter full name"
                                            value={donorFormData.fullName}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobileNumber"
                                            className="form-control radius-8"
                                            placeholder="Enter mobile number"
                                            value={donorFormData.mobileNumber}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control radius-8"
                                            placeholder="Enter email address"
                                            value={donorFormData.email}
                                            onChange={handleDonorFormChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            className="form-control radius-8"
                                            value={donorFormData.dateOfBirth}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Gender
                                        </label>
                                        <select 
                                            name="gender"
                                            className="form-control radius-8" 
                                            value={donorFormData.gender}
                                            onChange={handleDonorFormChange}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Blood Group
                                        </label>
                                        <select 
                                            name="bloodGroup"
                                            className="form-control radius-8" 
                                            value={donorFormData.bloodGroup}
                                            onChange={handleDonorFormChange}
                                            required
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Height (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="heightCm"
                                            className="form-control radius-8"
                                            placeholder="Enter height in cm"
                                            value={donorFormData.heightCm}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weightKg"
                                            className="form-control radius-8"
                                            placeholder="Enter weight in kg"
                                            value={donorFormData.weightKg}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Last Donation Date
                                        </label>
                                    
                                        <input
                                            type="date"
                                            name="lastDonationDate"
                                            className="form-control radius-8"
                                            value={donorFormData.lastDonationDate}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Eligible to Donate
                                        </label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="eligibleToDonate"
                                                name="eligibleToDonate"
                                                checked={donorFormData.eligibleToDonate}
                                                onChange={handleDonorFormChange}
                                            />
                                            <label className="form-check-label text-sm" htmlFor="eligibleToDonate">
                                                {donorFormData.eligibleToDonate ? 'Eligible' : 'Not Eligible'}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            State
                                        </label>
                                        <select
                                            className="form-control radius-8"
                                            name="state"
                                            value={selectedState}
                                            onChange={handleDonorFormChange}
                                            required
                                            disabled={isLoadingStates || states.length === 0}
                                        >
                                            <option value="">{isLoadingStates ? 'Loading states...' : 'Select State'}</option>
                                            {states.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            City
                                        </label>
                                        <select
                                            className="form-control radius-8"
                                            name="city"
                                            value={selectedCity}
                                            onChange={handleDonorFormChange}
                                            required
                                            disabled={isLoadingCities || cities.length === 0 || !selectedState}
                                        >
                                            <option value="">{isLoadingCities ? 'Loading cities...' : 'Select City'}</option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Area
                                        </label>
                                        <input
                                            type="text"
                                            name="area"
                                            className="form-control radius-8"
                                            placeholder="Enter area"
                                            value={donorFormData.area}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Pin Code
                                        </label>
                                        <input
                                            type="text"
                                            name="pinCode"
                                            className="form-control radius-8"
                                            placeholder="Enter pin code"
                                            value={donorFormData.pinCode}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Emergency Contact
                                        </label>
                                        <input
                                            type="tel"
                                            name="emergencyContactNumber"
                                            className="form-control radius-8"
                                            placeholder="Enter emergency contact"
                                            value={donorFormData.emergencyContactNumber}
                                            onChange={handleDonorFormChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Existing Health Issues
                                        </label>
                                        <select 
                                            name="existingHealthIssues"
                                            className="form-control radius-8" 
                                            value={donorFormData.existingHealthIssues}
                                            onChange={handleDonorFormChange}
                                            required
                                        >
                                            <option value="">Select Option</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="agreeTerms"
                                                name="agreedToTerms"
                                                checked={donorFormData.agreedToTerms}
                                                onChange={handleDonorFormChange}
                                                required
                                            />
                                            <label className="form-check-label text-sm" htmlFor="agreeTerms">
                                                I agree to the terms and conditions
                                            </label>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Adding...
                                                </>
                                            ) : (
                                                'Add Donor'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Donor Details Modal */}
            <div
                className="modal fade"
                id="viewDonorModal"
                tabIndex={-1}
                aria-labelledby="viewDonorModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="viewDonorModalLabel">
                                Donor Details
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseViewModal}
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            {selectedDonor ? (
                                <div className="row">
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Full Name
                                        </label>
                                        <div className="form-control-plaintext radius-8 bg-light p-3">
                                            {selectedDonor.name}
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Mobile Number
                                        </label>
                                        <div className="form-control-plaintext radius-8 bg-light p-3">
                                            {selectedDonor.mobileNo}
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Blood Group
                                        </label>
                                        <div className="form-control-plaintext radius-8 bg-light p-3">
                                            {selectedDonor.bloodGroup}
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Last Donation Date
                                        </label>
                                        <div className="form-control-plaintext radius-8 bg-light p-3">
                                            {formatDate(selectedDonor.lastDate)}
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Availability Status
                                        </label>
                                        <div className="form-control-plaintext radius-8 bg-light p-3">
                                            <span className={`badge ${isAvailable(selectedDonor.lastDate) ? 'bg-success' : 'bg-danger'}`}>
                                                {isAvailable(selectedDonor.lastDate) ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Address
                                        </label>
                                        <div className="form-control-plaintext radius-8 bg-light p-3">
                                            {selectedDonor.address}
                                        </div>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Additional Information
                                        </label>
                                        <div className="form-control-plaintext radius-8 bg-light p-3">
                                            <p className="mb-2"><strong>Email:</strong> {selectedDonor.email || 'Not provided'}</p>
                                            <p className="mb-2"><strong>Date of Birth:</strong> {selectedDonor.dateOfBirth || 'Not provided'}</p>
                                            <p className="mb-2"><strong>Gender:</strong> {selectedDonor.gender || 'Not provided'}</p>
                                            <p className="mb-2"><strong>Height:</strong> {selectedDonor.heightCm ? `${selectedDonor.heightCm} cm` : 'Not provided'}</p>
                                            <p className="mb-2"><strong>Weight:</strong> {selectedDonor.weightKg ? `${selectedDonor.weightKg} kg` : 'Not provided'}</p>
                                            <p className="mb-2"><strong>Emergency Contact:</strong> {selectedDonor.emergencyContactNumber || 'Not provided'}</p>
                                            <p className="mb-2"><strong>Health Issues:</strong> {selectedDonor.existingHealthIssues || 'Not provided'}</p>
                                            <p className="mb-0"><strong>Eligible to Donate:</strong> {selectedDonor.eligibleToDonate ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p>No donor details available.</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer border border-bottom-0 border-start-0 border-end-0">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default DonorListPage;