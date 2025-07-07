import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../network/apiClient';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const UnitBloodGroup = () => {
    const [bloodGroups, setBloodGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const { adminToken } = useAuth();

    useEffect(() => {
        const fetchBloodGroups = async () => {
            try {
                if (!adminToken) {
                    console.log('No admin token available');
                    return;
                }

                console.log('Fetching blood groups with token:', adminToken);
                const response = await apiClient.get('/user/blood-groups');
                console.log('Blood groups response:', response.data);
                
                // Extract data from the API response
                const bloodGroupData = response.data.data || [];
                
                // Transform API data to match our component's expected format
                const formattedGroups = bloodGroupData.map(group => ({
                    type: group.bloodGroup,
                    count: group.count,
                    color: getColorForBloodGroup(group.bloodGroup),
                    barColor: getBarColorForBloodGroup(group.bloodGroup),
                    progress: 0 // Will be calculated after all groups are loaded
                }));
                
                // Calculate progress after all groups are loaded
                const maxCount = Math.max(...formattedGroups.map(g => g.count), 1);
                const finalGroups = formattedGroups.map(group => ({
                    ...group,
                    progress: group.count > 0 ? (group.count / maxCount) * 100 : 0
                }));
                
                setBloodGroups(finalGroups);
            } catch (error) {
                console.error('Error fetching blood groups:', error);
                console.error('Error details:', {
                    message: error.message,
                    status: error.status,
                    data: error.data
                });
                toast.error(`Error fetching blood groups: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchBloodGroups();
    }, [adminToken]);

    // Helper functions to get colors based on blood group
    const getColorForBloodGroup = (group) => {
        const colors = {
            'O+': '#e6ffe6',
            'A+': '#e6f0ff',
            'B+': '#f0e6ff',
            'AB+': '#ffe6e6',
            'O-': '#ffe6e6',
            'A-': '#fff3e6',
            'B-': '#e6ffe6',
            'AB-': '#ffe6e6'
        };
        return colors[group] || '#e6e6e6';
    };

    const getBarColorForBloodGroup = (group) => {
        const colors = {
            'O+': '#28a745',
            'A+': '#007bff',
            'B+': '#6f42c1',
            'AB+': '#dc3545',
            'O-': '#dc3545',
            'A-': '#fd7e14',
            'B-': '#28a745',
            'AB-': '#dc3545'
        };
        return colors[group] || '#6c757d';
    };



    // Recent activities data
    const recentActivities = [
        { icon: 'mdi:check', color: '#28a745', text: 'New donation completed', detail: 'John Smith, O+ - 2 min ago' },
        { icon: 'mdi:account-plus', color: '#007bff', text: 'New donor registered', detail: 'Sarah Johnson, A+ - 15 min ago' },
        { icon: 'mdi:calendar', color: '#fd7e14', text: 'Appointment scheduled', detail: 'Mike Davis, B+ - 1 hour ago' },
        { icon: 'mdi:alert', color: '#dc3545', text: 'Low stock alert', detail: 'A- blood type - 2 hours ago' },
    ];

    return (
        <div className="container">
            <ToastContainer />
            <div className="row">
                <div className="col-md-8">
                    <div className="card" style={{ border: '1px solid #ddd' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h6 style={{ fontSize: '12px' }}>Blood Type Inventory</h6>
                            </div>
                            <br></br>
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading blood group data...</p>
                                </div>
                            ) : (
                                <div className="row row-cols-4 g-4">
                                    {bloodGroups.map((group) => (
                                    <div className="col" key={group.type} style={{
                                        marginBottom: '1rem'
                                    }}>
                                        <div
                                            className="card h-100"
                                            style={{ 
                                                backgroundColor: group.color, 
                                                border: '1px solid #ddd',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.2s'
                                            }}
                                        >
                                            <div className="card-body p-3 text-center" style={{
                                                padding: '1.5rem'
                                            }}>
                                                <div className="mb-2">
                                                    <h6 style={{ 
                                                        fontSize: '14px', 
                                                        color: '#333', 
                                                        fontWeight: '600',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        {group.type}
                                                    </h6>
                                                    <h6 style={{ 
                                                        fontSize: '18px', 
                                                        color: '#2c3e50', 
                                                        fontWeight: 'bold',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        {group.count}
                                                    </h6>
                                                </div>
                                                <div className="progress" style={{ height: '8px' }}>
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${group.progress}%`,
                                                            backgroundColor: group.barColor,
                                                        }}
                                                        aria-valuenow={group.progress}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card" style={{ border: '1px solid #ddd' }}>
                        <div className="card-body">
                            <h6 style={{ fontSize: '14px' }}>Recent Activities</h6>
                            <p className="text-muted" style={{ fontSize: '12px' }}>Latest donation and system activities</p>
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="d-flex align-items-center mb-3">
                                    <Icon
                                        icon={activity.icon}
                                        style={{ color: activity.color, marginRight: '10px' }}
                                    />
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#333', margin: '0' }}>{activity.text}</p>
                                        <small className="text-muted" style={{ fontSize: '10px' }}>{activity.detail}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitBloodGroup;