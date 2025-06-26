import React, { useEffect, useState, useRef } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const AddRequesterPage = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const tableRef = useRef(null);
    const dataTableRef = useRef(null);

    useEffect(() => {
        // Fetch requests from backend API
        setIsLoading(true);
        setError(null);
        fetch('https://blood-backend-lf52.onrender.com/api/requester')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Ensure we have the data array and map it to the expected format
                const formattedRequests = Array.isArray(data.data) ? data.data.map(request => ({
                    id: request._id,
                    hospital: request.bloodRequirementDetails.hospitalName,
                    bloodGroup: request.bloodRequirementDetails.requiredBloodGroup,
                    location: `${request.locationDetails.city}, ${request.locationDetails.state}`,
                    contact: request.bloodRequirementDetails.contactNumber,
                    requestedTime: new Date(request.bloodRequirementDetails.neededOn).toLocaleString(),
                    urgency: request.bloodRequirementDetails.isEmergency ? 'High' : 'Medium',
                    details: {
                        critical: request.bloodRequirementDetails.isEmergency ? 'CRITICAL EMERGENCY' : null,
                        bloodNeeded: request.bloodRequirementDetails.requiredBloodGroup,
                        amountNeeded: `${request.bloodRequirementDetails.unitsNeeded} units`,
                        requestedTime: new Date(request.bloodRequirementDetails.neededOn).toLocaleString(),
                        hospital: request.bloodRequirementDetails.hospitalName,
                        hospitalLocation: request.bloodRequirementDetails.hospitalAddress,
                        distance: '5 km', // You might want to calculate this
                        contact: request.bloodRequirementDetails.contactNumber,
                        fullName: request.personalDetails.fullName,
                        mobileNumber: request.personalDetails.mobileNumber,
                        email: request.personalDetails.emailAddress,
                        relationship: request.personalDetails.relationshipToPatient,
                        patientAge: request.personalDetails.patientAge,
                        gender: request.personalDetails.gender,
                        reason: request.bloodRequirementDetails.reasonForRequest,
                        doctor: request.bloodRequirementDetails.doctorReferenceName
                    }
                })) : [];
                setRequests(formattedRequests);
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
                <div className="card-header">
                    <h5 className="card-title mb-0 text-sm">Blood Request Alerts</h5>
                </div>
                <div className="card-body" style={{ position: 'relative' }}>
                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
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
                                    <th>ID</th>
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
                                {requests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="text-xs">{request.id.substring(0, 8)}...</td>
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
        </MasterLayout>
    );
};

export default AddRequesterPage;