import React from 'react';
import { Icon } from '@iconify/react';

const UnitBloodGroup = () => {
    // Blood group data with count, color, and progress percentage
    const bloodGroups = [
        { type: 'O+', count: 245, color: '#e6ffe6', barColor: '#28a745', progress: 90 },
        { type: 'A+', count: 189, color: '#e6f0ff', barColor: '#007bff', progress: 70 },
        { type: 'B+', count: 156, color: '#f0e6ff', barColor: '#6f42c1', progress: 60 },
        { type: 'AB+', count: 78, color: '#ffe6e6', barColor: '#dc3545', progress: 30 },
        { type: 'O-', count: 134, color: '#ffe6e6', barColor: '#dc3545', progress: 50 },
        { type: 'A-', count: 23, color: '#fff3e6', barColor: '#fd7e14', progress: 10 },
        { type: 'B-', count: 67, color: '#e6ffe6', barColor: '#28a745', progress: 25 },
        { type: 'AB-', count: 12, color: '#ffe6e6', barColor: '#dc3545', progress: 5 },
    ];

    // Recent activities data
    const recentActivities = [
        { icon: 'mdi:check', color: '#28a745', text: 'New donation completed', detail: 'John Smith, O+ - 2 min ago' },
        { icon: 'mdi:account-plus', color: '#007bff', text: 'New donor registered', detail: 'Sarah Johnson, A+ - 15 min ago' },
        { icon: 'mdi:calendar', color: '#fd7e14', text: 'Appointment scheduled', detail: 'Mike Davis, B+ - 1 hour ago' },
        { icon: 'mdi:alert', color: '#dc3545', text: 'Low stock alert', detail: 'A- blood type - 2 hours ago' },
    ];

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8">
                    <div className="card" style={{ border: '1px solid #ddd' }}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h6 style={{ fontSize: '12px' }}>Blood Type Inventory</h6>
                            </div>
                            <br></br>
                            <div className="row row-cols-4 g-4">
                                {bloodGroups.map((group) => (
                                    <div className="col" key={group.type}>
                                        <div
                                            className="card h-100"
                                            style={{ backgroundColor: group.color, border: '1px solid #ddd' }}
                                        >
                                            <div className="card-body p-3 text-center">
                                                <h6 style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>
                                                    {group.type}
                                                </h6>
                                                <h6 style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>
                                                    {group.count}
                                                </h6>
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