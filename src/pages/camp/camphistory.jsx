import React, { useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';

const CampHistoryMainPage = () => {

    const bloodCamps = [
        {
            id: 1,
            campId: "#CAMP001",
            title: "New Blood Donation Club",
            organizer: "Red Cross Society",
            image: "assets/images/user-list/user-list1.png",
            date: "03/12/2024",
            time: "10:30 AM - 02:30 PM",
            unit: 1,
            donors: "234",
            location: "T-Nagar, Chennai",
            contact: "9876543210",
            status: "completed"
        },
        {
            id: 2,
            campId: "#CAMP002",
            title: "Community Blood Drive",
            organizer: "Local Health Foundation",
            image: "assets/images/user-list/user-list2.png",
            date: "05/12/2024",
            time: "09:00 AM - 03:00 PM",
            unit: 2,
            donors: "187",
            location: "Mumbai Central",
            contact: "9876543211",
            status: "completed"
        },
        {
            id: 3,
            campId: "#CAMP003",
            title: "Annual Blood Donation Camp",
            organizer: "Rotary Club",
            image: "assets/images/user-list/user-list3.png",
            date: "10/12/2024",
            time: "08:00 AM - 04:00 PM",
            unit: 3,
            donors: "312",
            location: "Vellore Medical College",
            contact: "9876543212",
            status: "completed"
        },
        {
            id: 4,
            campId: "#CAMP004",
            title: "Corporate Blood Donation",
            organizer: "Tech Solutions Inc.",
            image: "assets/images/user-list/user-list4.png",
            date: "15/12/2024",
            time: "10:00 AM - 02:00 PM",
            unit: 1,
            donors: "156",
            location: "Coimbatore IT Park",
            contact: "9876543213",
            status: "completed"
        },
        {
            id: 5,
            campId: "#CAMP005",
            title: "University Blood Drive",
            organizer: "Student Welfare Association",
            image: "assets/images/user-list/user-list5.png",
            date: "20/12/2024",
            time: "09:30 AM - 03:30 PM",
            unit: 2,
            donors: "278",
            location: "Erode Campus",
            contact: "9876543214",
            status: "completed"
        },
        {
            id: 6,
            campId: "#CAMP006",
            title: "Emergency Blood Collection",
            organizer: "Government Hospital",
            image: "assets/images/user-list/user-list6.png",
            date: "25/12/2024",
            time: "08:00 AM - 06:00 PM",
            unit: 4,
            donors: "421",
            location: "Madurai Medical Center",
            contact: "9876543215",
            status: "completed"
        },
        {
            id: 7,
            campId: "#CAMP007",
            title: "Festival Blood Donation",
            organizer: "Cultural Association",
            image: "assets/images/user-list/user-list7.png",
            date: "30/12/2024",
            time: "10:00 AM - 05:00 PM",
            unit: 3,
            donors: "198",
            location: "Chennai Town Hall",
            contact: "9876543216",
            status: "completed"
        }
    ];

    useEffect(() => {
        const table = $('#dataTable').DataTable({
            pageLength: 10,
            scrollX: true, // Enable horizontal scrolling
            responsive: true // Enable responsive features
        });
        return () => {
            table.destroy(true);
        };
    }, []);

    return (
        <>
            <MasterLayout>
                <div className="card basic-data-table">
                    <div className="card-header">
                        <h5 className="card-title mb-0 text-sm">Blood Camp History</h5>
                    </div>
                    <div className="card-body">
                        <table
                            className="table bordered-table mb-0 text-xs"
                            id="dataTable"
                            data-page-length={10}
                        >
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <div className="form-check style-check d-flex align-items-center">
                                            <input className="form-check-input" type="checkbox" />
                                            <label className="form-check-label text-xs">S.L</label>
                                        </div>
                                    </th>
                                    <th scope="col" className="text-xs">Camp ID</th>
                                    <th scope="col" className="text-xs">Camp Title</th>
                                    <th scope="col" className="text-xs">Organizer</th>
                                    <th scope="col" className="text-xs">Date</th>
                                    <th scope="col" className="text-xs">Time</th>
                                    <th scope="col" className="text-xs">Donors</th>
                                    <th scope="col" className="text-xs">Location</th>
                                    <th scope="col" className="text-xs">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bloodCamps.map((camp, index) => (
                                    <tr key={camp.id}>
                                        <td>
                                            <div className="form-check style-check d-flex align-items-center">
                                                <input className="form-check-input" type="checkbox" />
                                                <label className="form-check-label text-xs">{index + 1}</label>
                                            </div>
                                        </td>
                                        <td className="text-xs">
                                            <Link to="#" className="text-primary-600">
                                                {camp.campId}
                                            </Link>
                                        </td>
                                        <td className="text-xs">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={camp.image}
                                                    alt=""
                                                    className="flex-shrink-0 me-8 radius-6"
                                                    width="24"
                                                    height="24"
                                                />
                                                <span className="fw-medium flex-grow-1">
                                                    {camp.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-xs">{camp.organizer}</td>
                                        <td className="text-xs">{camp.date}</td>
                                        <td className="text-xs">{camp.time}</td>
                                        <td className="text-xs">{camp.donors}</td>
                                        <td className="text-xs">{camp.location}</td>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </MasterLayout>
        </>
    );
};

export default CampHistoryMainPage;