import React from 'react'
import GeneratedContent from './child/GeneratedContent';
import UnitCountOne from './child/UnitCountOne';
import UnitBloodGroup from './bloodgroup';
import { Link } from 'react-router-dom';
import DefaultTable from './child/DefaultTable'
import BorderedTables from './child/BorderedTables'

const DashBoardLayerOne = () => {

    return (
        <>
            <UnitCountOne />
            <p></p>


            <UnitBloodGroup />

            <br></br>
            <br></br>
            <div className="row gy-4">

                {/* DefaultTable */}

                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Upcoming Camps</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table basic-border-table  mb-0">
                                    <thead>
                                        <tr>
                                            <th>Camp title </th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">Blood Donation Camp</Link>
                                            </td>
                                            <td>05 Jul 2024</td>
                                            <td>10:00 AM - 2:00 PM</td>
                                            <td>Community Hall, Chennai</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">Health Checkup Drive</Link>
                                            </td>
                                            <td>12 Jul 2024</td>
                                            <td>09:00 AM - 1:00 PM</td>
                                            <td>City Hospital, Coimbatore</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">Eye Camp</Link>
                                            </td>
                                            <td>20 Jul 2024</td>
                                            <td>11:00 AM - 3:00 PM</td>
                                            <td>Govt School, Madurai</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">Dental Camp</Link>
                                            </td>
                                            <td>01 Aug 2024</td>
                                            <td>08:30 AM - 12:30 PM</td>
                                            <td>Urban Clinic, Trichy</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">Vaccination Camp</Link>
                                            </td>
                                            <td>10 Aug 2024</td>
                                            <td>10:00 AM - 1:00 PM</td>
                                            <td>PHC Center, Salem</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>


                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Recent Donations</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table basic-border-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Name </th>
                                            <th>Blood group</th>
                                            <th>Date</th>
                                            <th>Camp name</th>
                                            <th>Location</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">John Doe</Link>
                                            </td>
                                            <td>O+</td>
                                            <td>25 Jan 2024</td>
                                            <td>Blood Donation Camp</td>
                                            <td>Chennai General Hospital</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">Asha Ramesh</Link>
                                            </td>
                                            <td>B-</td>
                                            <td>28 Jan 2024</td>
                                            <td>Health Awareness Drive</td>
                                            <td>Urban PHC, Coimbatore</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">Rahul Singh</Link>
                                            </td>
                                            <td>A+</td>
                                            <td>10 Feb 2024</td>
                                            <td>Red Cross Camp</td>
                                            <td>Madurai Red Cross Center</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">Meera Patel</Link>
                                            </td>
                                            <td>AB+</td>
                                            <td>18 Feb 2024</td>
                                            <td>Community Health Camp</td>
                                            <td>Trichy Welfare Center</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Link to="#" className="text-primary-600">David Kumar</Link>
                                            </td>
                                            <td>O-</td>
                                            <td>15 Mar 2024</td>
                                            <td>Mobile Blood Unit</td>
                                            <td>Salem Government Hospital</td>
                                            <td>
                                                <Link to="#" className="text-primary-600">View More &gt;</Link>
                                            </td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>

            </div>
        </>


    )
}

export default DashBoardLayerOne