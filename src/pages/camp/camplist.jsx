import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import CalendarMainLayer from "../../components/CalendarMainLayer";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';

const CalendarMainPage = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const response = await fetch('https://blood-backend-lf52.onrender.com/api/camps');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch camps');
        }

        const data = await response.json();
        if (!data.camps) {
          throw new Error('Invalid response format');
        }
        setCamps(data.camps);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching camps:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCamps();
  }, []);

  useEffect(() => {
    if (camps.length > 0) {
      const table = $('#dataTable').DataTable({
        pageLength: 10,
        scrollX: true,
        responsive: true
      });

      return () => {
        table.destroy(true);
      };
    }
  }, [camps]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">Error: {error}</div>;

  return (
    <MasterLayout>
      <CalendarMainLayer />

      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0 text-sm">Blood Camp History</h5>
        </div>
        <div className="card-body">
          <table
            className="table bordered-table mb-0 text-xs"
            id="dataTable"
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
                <th scope="col" className="text-xs">Date</th>
                <th scope="col" className="text-xs">Time</th>
                <th scope="col" className="text-xs">Donors</th>
                <th scope="col" className="text-xs">Location</th>
                <th scope="col" className="text-xs">Action</th>
              </tr>
            </thead>
            <tbody>
              {camps && camps.map((camp, index) => (
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
                      <span className="fw-medium flex-grow-1">
                        {camp.title}
                      </span>
                    </div>
                  </td>
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
  );
}

export default CalendarMainPage;