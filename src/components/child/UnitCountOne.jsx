import React from 'react';
import { Icon } from '@iconify/react';

const UnitCountOne = () => {
    // Data for all cards
    const statsData = [
        { 
            title: "Total Donors", 
            value: "2,100", 
            icon: "healthicons:blood-donation-outline" 
        },
        { 
            title: "City Covered", 
            value: "2,100", 
            icon: "healthicons:city" 
        },
        { 
            title: "Camp Organized", 
            value: "2,100", 
            icon: "healthicons:medical-tent" 
        },
        { 
            title: "People Helped", 
            value: "2,100", 
            icon: "healthicons:people" 
        },
    ];

    return (
        <div className="row row-cols-xxxl-5 row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4">
            {statsData.map((stat, index) => (
                <div className="col" key={index}>
                    <div className="card shadow-none border bg-gradient-start-p h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-white mb-1">
                                        {stat.title}
                                    </p>
                                    <h6 className="mb-0 text-white">{stat.value}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-white rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon={stat.icon}
                                        className="text-2xl mb-0"
                                        style={{ color: 'var(--primary-color)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UnitCountOne;