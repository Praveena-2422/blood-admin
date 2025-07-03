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
                        address: `${donor.area}, ${donor.city}`
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
    }, []);

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
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
            }
            dataTableRef.current = $(tableRef.current).DataTable({
                pageLength: 10,
                responsive: true,
                scrollX: false
            });
        }

        // Cleanup function
        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, [filteredDonors, loading, error]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                <div className="card-header">
                    <h5 className="card-title mb-0 text-sm">Donor List</h5>
                </div>
                <div className="card-body" style={{ position: 'relative' }}>
                    {loading && <div>Loading...</div>}
                    {error && <div>Error: {error}</div>}
                    <table
                        ref={tableRef}
                        className="table bordered-table mb-0 text-xs"
                        id="dataTable"
                        
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
                                            <Link
                                                to="#"
                                                className="w-24-px h-24-px me-4 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                                            >
                                                <Icon icon="iconamoon:eye-light" width="12" />
                                            </Link>
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
        </MasterLayout>
    );
};

export default DonorListPage;