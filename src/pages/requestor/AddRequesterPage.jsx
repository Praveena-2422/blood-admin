import React, { useEffect, useState, useRef } from "react";
import { apiClient } from '../../network/apiClient';
import MasterLayout from "../../masterLayout/MasterLayout";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import LottieLoader from "../../components/LottieLoader";

const AddRequesterPage = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const tableRef = useRef(null);
    const dataTableRef = useRef(null);

    // New request modal state
    const [showNewRequestModal, setShowNewRequestModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form data state
    const [requestFormData, setRequestFormData] = useState({
        requesterId: '', // New field for requester
        userIds: [], // Changed to array for multiple selection
        bloodGroup: '',
        state: '',
        city: '',
        hospitalName: '',
        hospitalAddress: '',
        contactNumber: '',
        unitsNeeded: '',
        reasonForRequest: '',
        neededOn: '',
        isEmergency: false
    });

    // Dropdown data state
    const [users, setUsers] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    
    // Requester search state
    const [requesterSearchTerm, setRequesterSearchTerm] = useState('');
    const [showRequesterDropdown, setShowRequesterDropdown] = useState(false);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showRequesterDropdown && !event.target.closest('.position-relative')) {
                setShowRequesterDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRequesterDropdown]);

    useEffect(() => {
        // Fetch requests from backend API
        setIsLoading(true);
        setError(null);
        apiClient.get('/requester')
            .then(response => {
                const data = response.data;
                if (data && data.success && data.data) {
                    const formattedRequests = data.data.map(request => ({
                        id: request._id,
                        hospital: request.bloodRequirementDetails?.hospitalName || 'N/A',
                        bloodGroup: request.bloodRequirementDetails?.requiredBloodGroup || 'N/A',
                        location: `${request.locationDetails?.city || 'N/A'}, ${request.locationDetails?.state || 'N/A'}`,
                        contact: request.bloodRequirementDetails?.contactNumber || 'N/A',
                        requestedTime: request.bloodRequirementDetails?.neededOn ? new Date(request.bloodRequirementDetails.neededOn).toLocaleString() : 'N/A',
                        urgency: request.bloodRequirementDetails?.isEmergency ? 'High' : 'Medium',
                        requester: request.requesterDetails?.requesterName || 'N/A',
                        details: {
                            critical: request.bloodRequirementDetails?.isEmergency ? 'CRITICAL EMERGENCY' : null,
                            bloodNeeded: request.bloodRequirementDetails?.requiredBloodGroup || 'N/A',
                            amountNeeded: request.bloodRequirementDetails?.unitsNeeded ? `${request.bloodRequirementDetails.unitsNeeded} units` : 'N/A',
                            requestedTime: request.bloodRequirementDetails?.neededOn ? new Date(request.bloodRequirementDetails.neededOn).toLocaleString() : 'N/A',
                            hospital: request.bloodRequirementDetails?.hospitalName || 'N/A',
                            hospitalLocation: request.bloodRequirementDetails?.hospitalAddress || 'N/A',
                            distance: '5 km', // You might want to calculate this
                            contact: request.bloodRequirementDetails?.contactNumber || 'N/A',
                            fullName: request.personalDetails?.fullName || 'N/A',
                            mobileNumber: request.personalDetails?.mobileNumber || 'N/A',
                            email: request.personalDetails?.emailAddress || 'N/A',
                            relationship: request.personalDetails?.relationshipToPatient || 'N/A',
                            patientAge: request.personalDetails?.patientAge || 'N/A',
                            gender: request.personalDetails?.gender || 'N/A',
                            reason: request.bloodRequirementDetails?.reasonForRequest || 'N/A',
                            doctor: request.bloodRequirementDetails?.doctorReferenceName || 'N/A',
                            requester: request.requesterDetails?.requesterName || 'N/A',
                            requesterMobile: request.requesterDetails?.requesterMobile || 'N/A',
                            requesterEmail: request.requesterDetails?.requesterEmail || 'N/A'
                        }
                    }));
                    setRequests(formattedRequests);
                } else {
                    setRequests([]);
                }
            })
            .catch(error => {
                console.error('Error fetching requests:', error);
                setError(error.message);
                setRequests([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        // Initialize DataTable only when requests are loaded and tableRef is set
        if (requests.length > 0 && tableRef.current && !dataTableRef.current) {
            dataTableRef.current = $(tableRef.current).DataTable({
                pageLength: 10,
                responsive: true,
                scrollX: true
            });
        }

        // Cleanup function
        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, [requests]);

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedRequest(null);
    };

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/user/getAllUser');
            if (response.data && response.data.data) {
                setUsers(response.data.data.map(user => ({
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    mobile: user.mobileNumber,
                    bloodGroup: user.bloodGroup,
                    state: user.state,
                    city: user.city
                })));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Get filtered users based on selected blood group, state, and city
    const getFilteredUsers = () => {
        let filteredUsers = users;

        // Filter by blood group
        if (requestFormData.bloodGroup) {
            filteredUsers = filteredUsers.filter(user => user.bloodGroup === requestFormData.bloodGroup);
        }

        // Filter by state
        if (requestFormData.state) {
            filteredUsers = filteredUsers.filter(user => user.state === requestFormData.state);
        }

        // Filter by city
        if (requestFormData.city) {
            filteredUsers = filteredUsers.filter(user => user.city === requestFormData.city);
        }

        return filteredUsers;
    };

    // Get filtered requesters based on search term
    const getFilteredRequesters = () => {
        if (!requesterSearchTerm) {
            return users;
        }
        const searchLower = requesterSearchTerm.toLowerCase();
        return users.filter(user => 
            user.name.toLowerCase().includes(searchLower) ||
            user.mobile.toLowerCase().includes(searchLower)
        );
    };

    // Fetch states for India
    const fetchStates = async () => {
        setIsLoadingStates(true);
        try {
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/states/q?country=India`);
            if (!response.ok) throw new Error("Failed to fetch states");
            const data = await response.json();
            if (data.error === false) {
                setStates(data.data.states.map(s => s.name));
            } else {
                setStates([]);
            }
        } catch (e) {
            setStates([]);
        } finally {
            setIsLoadingStates(false);
        }
    };

    // Fetch cities when state changes
    const fetchCities = async (stateName) => {
        setIsLoadingCities(true);
        try {
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/state/cities/q?country=India&state=${encodeURIComponent(stateName)}`);
            if (!response.ok) throw new Error("Failed to fetch cities");
            const data = await response.json();
            if (data.error === false) { 
                setCities(data.data);
            } else {
                setCities([]);
            }
        } catch (e) {
            setCities([]);
        } finally {
            setIsLoadingCities(false);
        }
    };

    // Handle form field changes
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === "state") {
            setSelectedState(value);
            setRequestFormData(prev => ({ ...prev, state: value, city: "" }));
            if (value) {
                fetchCities(value);
            } else {
                setCities([]);
            }
        } else if (name === "bloodGroup" || name === "state" || name === "city") {
            // Reset user selection when any filter criteria changes
            setRequestFormData(prev => ({
                ...prev,
                [name]: value,
                userIds: [] // Reset user selection
            }));
        } else if (name === "userIds") {
            // Handle multiple user selection
            const userId = value;
            setRequestFormData(prev => {
                const currentUserIds = prev.userIds || [];
                if (currentUserIds.includes(userId)) {
                    // Remove user if already selected
                    return {
                        ...prev,
                        userIds: currentUserIds.filter(id => id !== userId)
                    };
                } else {
                    // Add user if not selected
                    return {
                        ...prev,
                        userIds: [...currentUserIds, userId]
                    };
                }
            });
        } else {
            setRequestFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Handle requester selection
    const handleRequesterSelect = (user) => {
        setRequestFormData(prev => ({
            ...prev,
            requesterId: user.id
        }));
        setRequesterSearchTerm(user.name);
        setShowRequesterDropdown(false);
    };

    // Handle requester search input
    const handleRequesterSearchChange = (e) => {
        const value = e.target.value;
        setRequesterSearchTerm(value);
        setShowRequesterDropdown(true);
        
        // Clear requester if search is cleared
        if (!value) {
            setRequestFormData(prev => ({
                ...prev,
                requesterId: ''
            }));
        }
    };

    // Handle new request modal open
    const handleOpenNewRequestModal = () => {
        setShowNewRequestModal(true);
        fetchUsers();
        fetchStates();
    };

    // Handle new request modal close
    const handleCloseNewRequestModal = () => {
        setShowNewRequestModal(false);
        setRequestFormData({
            requesterId: '',
            userIds: [],
            bloodGroup: '',
            state: '',
            city: '',
            hospitalName: '',
            hospitalAddress: '',
            contactNumber: '',
            unitsNeeded: '',
            reasonForRequest: '',
            neededOn: '',
            isEmergency: false
        });
        setSelectedState('');
        setCities([]);
        setSuccessMessage('');
        setRequesterSearchTerm('');
        setShowRequesterDropdown(false);
    };

    // Handle form submission
    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            // Validate required fields
            if (!requestFormData.requesterId || !requestFormData.userIds || requestFormData.userIds.length === 0 || !requestFormData.bloodGroup || 
                !requestFormData.hospitalName || !requestFormData.contactNumber || 
                !requestFormData.unitsNeeded || !requestFormData.reasonForRequest || !requestFormData.neededOn) {
                setError('Please fill all required fields');
                return;
            }

            // Get selected users and requester
            const selectedUsers = users.filter(u => requestFormData.userIds.includes(u.id));
            const requester = users.find(u => u.id === requestFormData.requesterId);
            
            const payload = {
                personalDetails: {
                    fullName: selectedUsers.map(u => u.name).join(', '),
                    mobileNumber: selectedUsers.map(u => u.mobile).join(', '),
                    emailAddress: selectedUsers.map(u => u.email).join(', '),
                    relationshipToPatient: 'Self',
                    patientAge: 25,
                    gender: 'Male'
                },
                requesterDetails: {
                    requesterId: requestFormData.requesterId,
                    requesterName: requester?.name || '',
                    requesterMobile: requester?.mobile || '',
                    requesterEmail: requester?.email || ''
                },
                bloodRequirementDetails: {
                    requiredBloodGroup: requestFormData.bloodGroup,
                    unitsNeeded: parseInt(requestFormData.unitsNeeded),
                    reasonForRequest: requestFormData.reasonForRequest,
                    neededOn: requestFormData.neededOn,
                    isEmergency: requestFormData.isEmergency,
                    hospitalName: requestFormData.hospitalName,
                    hospitalAddress: requestFormData.hospitalAddress,
                    contactNumber: requestFormData.contactNumber,
                    doctorReferenceName: 'Dr. Smith'
                },
                locationDetails: {
                    state: requestFormData.state || 'Not specified',
                    city: requestFormData.city || 'Not specified',
                    area: requestFormData.hospitalAddress || 'Not specified',
                    pinCode: '000000',
                    currentLocation: `${requestFormData.city || 'Not specified'}, ${requestFormData.state || 'Not specified'}`
                },
                additionalInformation: {
                    patientId: 'N/A',
                    ongoingTreatment: false,
                    uploadDoctorNote: '',
                    termsAccepted: true
                }
            };

            console.log('Submitting request:', payload);

            // Submit to API
            const response = await apiClient.post('/requester/add', payload);
            console.log('Submit response:', response.data);

            if (response.data.success) {
                setSuccessMessage('Blood request submitted successfully!');
                setError('');
                
                // Close modal after success
                setTimeout(() => {
                    handleCloseNewRequestModal();
                    // Refresh the requests list
                    window.location.reload();
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to submit request');
            }

        } catch (err) {
            console.error('Error submitting request:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message || 'Failed to submit request');
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
                    .urgency-high {
                        color: #dc3545;
                        font-weight: bold;
                    }
                    .urgency-medium {
                        color: #fd7e14;
                        font-weight: bold;
                    }
                    .urgency-low {
                        color: #28a745;
                        font-weight: bold;
                    }
                    .details-modal .modal-header {
                        background-color: #f8f9fa;
                        border-bottom: 1px solid #dee2e6;
                    }
                    .details-modal .modal-title {
                        font-weight: 600;
                    }
                    .details-section {
                        margin-bottom: 1rem;
                    }
                    .details-section h5 {
                        font-size: 1rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    }
                    .details-section p {
                        margin-bottom: 0.25rem;
                    }
                    .critical-badge {
                        background-color: #dc3545;
                        color: white;
                        padding: 0.25rem 0.5rem;
                        border-radius: 0.25rem;
                        font-size: 0.75rem;
                        font-weight: bold;
                    }
                    .loading-spinner {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 200px;
                    }
                `}
            </style>
            <div className="card basic-data-table">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="card-title mb-0 text-sm">Blood Request Alerts</h5>
                    <button
                        type="button"
                        className="btn btn-primary-p text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                        onClick={handleOpenNewRequestModal}
                    >
                        <Icon
                            icon="fa6-regular:square-plus"
                            className="icon text-lg line-height-1"
                        />
                        Add New Request
                    </button>
                </div>
                <div className="card-body" style={{ position: 'relative' }}>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                            <LottieLoader width={80} height={80} />
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <table
                            ref={tableRef}
                            className="table bordered-table mb-0 text-xs"
                            id="dataTable"
                            data-page-length={10}
                        >
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th className="text-xs">Requester</th>
                                    <th className="text-xs">Hospital</th>
                                    <th className="text-xs">Blood Group</th>
                                    <th className="text-xs">Location</th>
                                    <th className="text-xs">Contact</th>
                                    <th className="text-xs">Requested</th>
                                    <th className="text-xs">Urgency</th>
                                    <th className="text-xs">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request, index) => (
                                    <tr key={request.id}>
                                        <td className="text-xs">{index + 1}</td>
                                        <td className="text-xs">{request.requester}</td>
                                        <td className="text-xs">{request.hospital}</td>
                                        <td className="text-xs">{request.bloodGroup}</td>
                                        <td className="text-xs">{request.location}</td>
                                        <td className="text-xs">{request.contact}</td>
                                        <td className="text-xs">{request.requestedTime}</td>
                                        <td className={`text-xs urgency-${request.urgency.toLowerCase()}`}>
                                            {request.urgency}
                                        </td>
                                        <td className="text-xs">
                                            <button
                                                onClick={() => handleViewDetails(request)}
                                                className="w-24-px h-24-px me-4 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center border-0"
                                            >
                                                <Icon icon="iconamoon:eye-light" width="12" />
                                            </button>
                                            <button className="w-24-px h-24-px me-4 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center border-0">
                                                <Icon icon="fluent-mdl2:accept" width="12" />
                                            </button>
                                            <button className="w-24-px h-24-px me-4 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center border-0">
                                                <Icon icon="material-symbols:cancel" width="12" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            <Modal show={showDetails} onHide={handleCloseDetails} size="lg" className="details-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Blood Request Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <div>
                            <div className="details-section">
                                {selectedRequest.details.critical && (
                                    <span className="critical-badge">{selectedRequest.details.critical}</span>
                                )}
                                <p><strong>Reason:</strong> {selectedRequest.details.reason}</p>
                            </div>

                            <div className="details-section">
                                <h5>Blood Needed</h5>
                                <p><strong>Blood Type:</strong> {selectedRequest.details.bloodNeeded}</p>
                                <p><strong>Amount Needed:</strong> {selectedRequest.details.amountNeeded}</p>
                                <p><strong>Requested Time:</strong> {selectedRequest.details.requestedTime}</p>
                            </div>

                            <div className="details-section">
                                <h5>Hospital Details</h5>
                                <p><strong>Hospital:</strong> {selectedRequest.details.hospital}</p>
                                <p><strong>Location:</strong> {selectedRequest.details.hospitalLocation}</p>
                                <p><strong>Distance:</strong> {selectedRequest.details.distance}</p>
                                <p><strong>Contact:</strong> {selectedRequest.details.contact}</p>
                                <p><strong>Doctor:</strong> {selectedRequest.details.doctor}</p>
                            </div>

                            <div className="details-section">
                                <h5>Requester Details</h5>
                                <p><strong>Requester Name:</strong> {selectedRequest.details.requester}</p>
                                <p><strong>Requester Mobile:</strong> {selectedRequest.details.requesterMobile}</p>
                                <p><strong>Requester Email:</strong> {selectedRequest.details.requesterEmail}</p>
                            </div>
                            <div className="details-section">
                                <h5>Personal Details</h5>
                                <p><strong>Full Name:</strong> {selectedRequest.details.fullName}</p>
                                <p><strong>Mobile Number:</strong> {selectedRequest.details.mobileNumber}</p>
                                <p><strong>Email Address:</strong> {selectedRequest.details.email}</p>
                                <p><strong>Relationship to Patient:</strong> {selectedRequest.details.relationship}</p>
                                <p><strong>Patient's Age:</strong> {selectedRequest.details.patientAge}</p>
                                <p><strong>Gender:</strong> {selectedRequest.details.gender}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleCloseDetails}>
                        Accept
                    </Button>
                    <Button variant="danger" onClick={handleCloseDetails}>
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* New Request Modal */}
            <Modal show={showNewRequestModal} onHide={handleCloseNewRequestModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Blood Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    <form onSubmit={handleSubmitRequest}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Requester *
                                </label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control radius-8"
                                        placeholder="Search by name or phone number..."
                                        value={requesterSearchTerm}
                                        onChange={handleRequesterSearchChange}
                                        onFocus={() => setShowRequesterDropdown(true)}
                                        required={!requestFormData.requesterId}
                                    />
                                    {showRequesterDropdown && (
                                        <div className="position-absolute w-100 bg-white border rounded mt-1" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                            {getFilteredRequesters().length === 0 ? (
                                                <div className="p-2 text-muted text-center">
                                                    No users found
                                                </div>
                                            ) : (
                                                getFilteredRequesters().map((user) => (
                                                    <div
                                                        key={user.id}
                                                        className="p-2 cursor-pointer hover-bg-light"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleRequesterSelect(user)}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                    >
                                                        <div className="fw-semibold">{user.name}</div>
                                                        <small className="text-muted">{user.mobile}</small>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                                {requestFormData.requesterId && (
                                    <small className="text-success">
                                        Selected: {users.find(u => u.id === requestFormData.requesterId)?.name}
                                    </small>
                                )}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Blood Group *
                                </label>
                                <select
                                    name="bloodGroup"
                                    className="form-control radius-8"
                                    value={requestFormData.bloodGroup}
                                    onChange={handleFormChange}
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
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Select Users * ({requestFormData.userIds.length} selected)
                                </label>
                                <div className="border radius-8 p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {!requestFormData.bloodGroup ? (
                                        <div className="text-muted text-center py-3">
                                            Please select blood group first
                                        </div>
                                    ) : getFilteredUsers().length === 0 ? (
                                        <div className="text-danger text-center py-3">
                                            <div>No users found matching the criteria:</div>
                                            <div className="mt-1">
                                                <small>
                                                    Blood Group: {requestFormData.bloodGroup}
                                                    {requestFormData.state && ` | State: ${requestFormData.state}`}
                                                    {requestFormData.city && ` | City: ${requestFormData.city}`}
                                                </small>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-2 p-2 bg-light rounded">
                                                <small className="text-muted">
                                                    <strong>Filter Criteria:</strong> Blood Group: {requestFormData.bloodGroup}
                                                    {requestFormData.state && ` | State: ${requestFormData.state}`}
                                                    {requestFormData.city && ` | City: ${requestFormData.city}`}
                                                </small>
                                            </div>
                                            {getFilteredUsers().map((user) => (
                                                <div key={user.id} className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`user-${user.id}`}
                                                        name="userIds"
                                                        value={user.id}
                                                        checked={requestFormData.userIds.includes(user.id)}
                                                        onChange={handleFormChange}
                                                    />
                                                    <label className="form-check-label text-sm" htmlFor={`user-${user.id}`}>
                                                        {user.name} - {user.mobile} ({user.bloodGroup})
                                                        <br />
                                                        <small className="text-muted">
                                                            {user.city}, {user.state}
                                                        </small>
                                                    </label>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                {requestFormData.userIds.length > 0 && (
                                    <small className="text-success">
                                        {requestFormData.userIds.length} user(s) selected
                                    </small>
                                )}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    State *
                                </label>
                                <select
                                    name="state"
                                    className="form-control radius-8"
                                    value={selectedState}
                                    onChange={handleFormChange}
                                    required
                                    disabled={isLoadingStates}
                                >
                                    <option value="">{isLoadingStates ? <LottieLoader width={20} height={20} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> : 'Select State'}</option>
                                    {states.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    City *
                                </label>
                                <select
                                    name="city"
                                    className="form-control radius-8"
                                    value={requestFormData.city}
                                    onChange={handleFormChange}
                                    required
                                    disabled={isLoadingCities || cities.length === 0 || !selectedState}
                                >
                                    <option value="">{isLoadingCities ? <LottieLoader width={20} height={20} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> : 'Select City'}</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Hospital Name *
                                </label>
                                <input
                                    type="text"
                                    name="hospitalName"
                                    className="form-control radius-8"
                                    placeholder="Enter hospital name"
                                    value={requestFormData.hospitalName}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Hospital Address
                                </label>
                                <input
                                    type="text"
                                    name="hospitalAddress"
                                    className="form-control radius-8"
                                    placeholder="Enter hospital address"
                                    value={requestFormData.hospitalAddress}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Contact Number *
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    className="form-control radius-8"
                                    placeholder="Enter contact number"
                                    value={requestFormData.contactNumber}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Units Needed *
                                </label>
                                <input
                                    type="number"
                                    name="unitsNeeded"
                                    className="form-control radius-8"
                                    placeholder="Enter units needed"
                                    value={requestFormData.unitsNeeded}
                                    onChange={handleFormChange}
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Needed On *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="neededOn"
                                    className="form-control radius-8"
                                    value={requestFormData.neededOn}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Emergency Request
                                </label>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isEmergency"
                                        name="isEmergency"
                                        checked={requestFormData.isEmergency}
                                        onChange={handleFormChange}
                                    />
                                    <label className="form-check-label text-sm" htmlFor="isEmergency">
                                        {requestFormData.isEmergency ? 'Emergency' : 'Regular'}
                                    </label>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label fw-semibold text-primary-light text-sm mb-2">
                                    Reason for Request *
                                </label>
                                <textarea
                                    name="reasonForRequest"
                                    className="form-control radius-8"
                                    placeholder="Enter reason for blood request"
                                    value={requestFormData.reasonForRequest}
                                    onChange={handleFormChange}
                                    required
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCloseNewRequestModal}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </MasterLayout>
    );
};

export default AddRequesterPage;