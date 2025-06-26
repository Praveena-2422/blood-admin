import React, { useEffect } from 'react'
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';

const TableDataLayer = () => {
    // Sample data array
    const bloodRequesters = [
        {
            id: 1,
            requesterId: "#526534",
            name: "Kathryn Murphy",
            image: "assets/images/user-list/user-list1.png",
            issuedDate: "25 Jan 2024",
            unit: 1,
            mobileNo: "8987655674",
            place: "Chennai",
            status: "success"
        },
        {
            id: 2,
            requesterId: "#696589",
            name: "Annette Black",
            image: "assets/images/user-list/user-list2.png",
            issuedDate: "25 Jan 2024",
            unit: 2,
            mobileNo: "8987655675",
            place: "Mumbai",
            status: "success"
        },
        {
            id: 3,
            requesterId: "#256584",
            name: "Ronald Richards",
            image: "assets/images/user-list/user-list3.png",
            issuedDate: "10 Feb 2024",
            unit: 1,
            mobileNo: "8987655676",
            place: "Vellore",
            status: "success"
        },
        {
            id: 4,
            requesterId: "#526587",
            name: "Eleanor Pena",
            image: "assets/images/user-list/user-list4.png",
            issuedDate: "10 Feb 2024",
            unit: 3,
            mobileNo: "8987655677",
            place: "Coimbatore",
            status: "success"
        },
        {
            id: 5,
            requesterId: "#105986",
            name: "Leslie Alexander",
            image: "assets/images/user-list/user-list5.png",
            issuedDate: "15 March 2024",
            unit: 2,
            mobileNo: "8987655678",
            place: "Erode",
            status: "warning"
        },
        {
            id: 6,
            requesterId: "#526589",
            name: "Albert Flores",
            image: "assets/images/user-list/user-list6.png",
            issuedDate: "15 March 2024",
            unit: 1,
            mobileNo: "8987655679",
            place: "T-Nagar",
            status: "success"
        },
        {
            id: 7,
            requesterId: "#526520",
            name: "Jacob Jones",
            image: "assets/images/user-list/user-list7.png",
            issuedDate: "27 April 2024",
            unit: 4,
            mobileNo: "8987655680",
            place: "Madurai",
            status: "success"
        },
        {
            id: 8,
            requesterId: "#256584",
            name: "Jerome Bell",
            image: "assets/images/user-list/user-list8.png",
            issuedDate: "27 April 2024",
            unit: 2,
            mobileNo: "8987655681",
            place: "Madurai",
            status: "warning"
        },
        {
            id: 9,
            requesterId: "#200257",
            name: "Marvin McKinney",
            image: "assets/images/user-list/user-list9.png",
            issuedDate: "30 April 2024",
            unit: 3,
            mobileNo: "8987655682",
            place: "Chennai",
            status: "success"
        },
        {
            id: 10,
            requesterId: "#526525",
            name: "Cameron Williamson",
            image: "assets/images/user-list/user-list10.png",
            issuedDate: "30 April 2024",
            unit: 2,
            mobileNo: "8987655683",
            place: "Chennai",
            status: "success"
        }
    ];

       useEffect(() => {
        const table = $('#dataTable').DataTable({
            pageLength: 10,
        });
        return () => {
            table.destroy(true);
        };
    }, []);

    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0 text-sm">Blood Requester List</h5>
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
                            <th scope="col" className="text-xs">ID</th>
                            <th scope="col" className="text-xs">Name</th>
                            <th scope="col" className="text-xs">Issued Date</th>
                            <th scope="col" className="text-xs">Unit</th>
                            <th scope="col" className="text-xs">Mobile No</th>
                            <th scope="col" className="text-xs">Place</th>
                            <th scope="col" className="text-xs">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bloodRequesters.map((requester, index) => (
                            <tr key={requester.id}>
                                <td>
                                    <div className="form-check style-check d-flex align-items-center">
                                        <input className="form-check-input" type="checkbox" />
                                        <label className="form-check-label text-xs">{index + 1}</label>
                                    </div>
                                </td>
                                <td className="text-xs">
                                    <Link to="#" className="text-primary-600">
                                        {requester.requesterId}
                                    </Link>
                                </td>
                                <td className="text-xs">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={requester.image}
                                            alt=""
                                            className="flex-shrink-0 me-8 radius-6"
                                            width="24"
                                            height="24"
                                        />
                                        <span className="fw-medium flex-grow-1">
                                            {requester.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="text-xs">{requester.issuedDate}</td>
                                <td className="text-xs">{requester.unit}</td>
                                <td className="text-xs">{requester.mobileNo}</td>
                               <td className="text-xs">{requester.place}</td>
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
    )
}

export default TableDataLayer