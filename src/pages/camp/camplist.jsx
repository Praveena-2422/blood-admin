import React, { useRef, useState, useEffect } from "react";
import { apiClient } from '../../network/apiClient';
import MasterLayout from "../../masterLayout/MasterLayout";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import campApiProvider from "../../apiProvider/campApiProvider";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Calendar from '../../components/child/Calendar';

const DatePicker = ({ id, name, placeholder, value, onChange }) => {
  const datePickerRef = useRef(null);

  useEffect(() => {
      const fp = flatpickr(datePickerRef.current, {
          enableTime: true,
          dateFormat: "Y-m-d H:i",
          onChange: function (selectedDates, dateStr) {
              // Create a proper event object that matches what handleInputChange expects
              const syntheticEvent = {
                  target: {
                      name: name,
                      value: dateStr
                  }
              };
              onChange(syntheticEvent);
          }
      });

      return () => {
          fp.destroy();
      };
  }, [name, onChange]);

  return (
      <input
          ref={datePickerRef}
          id={id}
          name={name}
          type="text"
          className="form-control radius-8 bg-base"
          placeholder={placeholder}
          value={value || ''}
          readOnly // Make it readOnly since flatpickr handles the input
      />
  );
};

const CalendarMainPage = () => {
  // Country/State/City Dropdown State
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [camps, setCamps] = useState([]);
// All camp fields
const [formData, setFormData] = useState({
    campId: '',
    title: '',
    organizer: '',
    fromdate: '',
    todate: '',
    time: '',
    units: 0,
    donors: 0,
    location: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    contact: '',
    email: '',
    status: 'planned',
});


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

   const [events, setEvents] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);


    // Fetch states for India on mount
    useEffect(() => {
        fetchStates("India");
    }, []);

    // Fetch cities when state changes
    useEffect(() => {
        if(selectedState) {
            fetchCities("India", selectedState);
        } else {
            setCities([]);
            setSelectedCity("");
        }
    }, [selectedState]);

    // Fetch states API
    const fetchStates = async (countryName) => {
        setIsLoadingStates(true);
        try {
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/states/q?country=${encodeURIComponent(countryName)}`);
            if (!response.ok) throw new Error("Failed to fetch states");
            const data = await response.json();
            if (data.error === false) {
                setStates(data.data.states.map(s => s.name));
                setSelectedState("");
                setCities([]);
                setSelectedCity("");
            } else {
                setStates([]);
            }
        } catch (e) {
            setStates([]);
        } finally {
            setIsLoadingStates(false);
        }
    };

    // Fetch cities API
    const fetchCities = async (countryName, stateName) => {
        setIsLoadingCities(true);
        try {
            const response = await fetch(`https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${encodeURIComponent(countryName)}&state=${encodeURIComponent(stateName)}`);
            if (!response.ok) throw new Error("Failed to fetch cities");
            const data = await response.json();
            if (data.error === false) {
                setCities(data.data);
                setSelectedCity("");
            } else {
                setCities([]);
            }
        } catch (e) {
            setCities([]);
        } finally {
            setIsLoadingCities(false);
        }
    };

    useEffect(() => {
      fetchEvents();
    }, []);
    const fetchEvents = async () => {
      try {
          const response = await apiClient.get('/camps');
          console.log('API Response:', response); // Debug log
          const data = response.data;
          if (!data.camps) {
              throw new Error('Invalid response format');
          }
          const formattedEvents = data.camps.map(camp => ({
              id: camp._id,
              campId: camp.campId,
              title: camp.title,
              organizer: camp.organizer,
              fromdate: camp.fromdate,
              todate: camp.todate,
              time: camp.time,
              units: camp.units,
              donors: camp.donors,
              location: camp.location,
              address: camp.address,
              state: camp.state,
              city: camp.city,
              pincode: camp.pincode,
              contact: camp.contact,
              email: camp.email,
              status: camp.status
          }));
          setEvents(formattedEvents);
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
      }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Special handling for state/city dropdowns
        if (name === "state") {
            setSelectedState(value);
            setFormData(prev => ({ ...prev, state: value, location: "" }));
        } else if (name === "city") {
            setSelectedCity(value);
            setFormData(prev => ({ ...prev, city: value, location: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            // Format the date and time for the API
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            const formattedFromDate = startDate.toISOString().split('T')[0];
            const formattedToDate = endDate.toISOString().split('T')[0];
            const formattedTime = formData.time || `${startDate.toTimeString().substring(0, 5)} - ${endDate.toTimeString().substring(0, 5)}`;

            const payload = {
                campId: formData.campId,
                title: formData.title,
                organizer: formData.organizer,
                fromdate: formattedFromDate,
                todate: formattedToDate,
                time: formattedTime,
                units: formData.units === '' ? 0 : Number(formData.units),
                donors: formData.donors === '' ? 0 : Number(formData.donors),
                location: formData.location,
                address: formData.address,
                state: formData.state,
                city: formData.city,
                pincode: formData.pincode,
                contact: formData.contact,
                email: formData.email,
                status: formData.status
            };
console.log(payload,"ytyydtf");
            const response = await apiClient.post('/camps/addcamp', payload);
            console.log(response);
            

            // Reset form
            setFormData({
                title: "",
                startDate: "",
                endDate: "",
                location: "",
                pincode: "",
                contact: "",
                time: "",
                units: "",
                donors: "",
                status: "",
                organizer: "",
                fromdate: "",
                todate: "",
                campId: "",
                title: "",
                email: "",
                description: ""
            });

            await fetchEvents(); // Reload camp list after add
            document.getElementById('closeAddModal').click();
        } catch (err) {
            setError(err.message);
        }
    };
    

    const handleEditEvent = async (e) => {
        e.preventDefault();
        try {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            const formattedStartTime = startDate.toTimeString().substring(0, 5);
            const formattedEndTime = endDate.toTimeString().substring(0, 5);

            const response = await apiClient.put(`/camps/updatecamp/${currentEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    fromdate: startDate,
                    todate: endDate,
                    units: formData.units,
                    donors: formData.donors,
                    time: `${formattedStartTime} - ${formattedEndTime}`,
                    location: formData.location,
                    address: formData.address,
                    state: formData.state,
                    city: formData.city,
                    pincode: formData.pincode,
                    contact: formData.contact,
                    email: formData.email,
                    organizer: formData.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update camp');
            }

            const updatedCamp = await response.json();
            const updatedEvents = camps.map(camp =>
                camp.id === currentEvent.id ? {
                    ...camp,
                    title: updatedCamp.title,
                    time: updatedCamp.time,
                    fromdate: updatedCamp.fromdate,
                    todate: updatedCamp.todate, 
                    units: updatedCamp.units,
                    donors: updatedCamp.donors,
                    location: updatedCamp.location,
                    address: updatedCamp.address,
                    state: updatedCamp.state,
                    city: updatedCamp.city,
                    pincode: updatedCamp.pincode,
                    contact: updatedCamp.contact,
                    email: updatedCamp.email,
                    organizer: updatedCamp.organizer,
                    startDate: `${updatedCamp.date} ${updatedCamp.time.split(' - ')[0]}`,
                    endDate: `${updatedCamp.date} ${updatedCamp.time.split(' - ')[1]}`,
                } : camp
            );
            setCamps(updatedEvents);
            await fetchEvents(); // Reload camp list after update
            document.getElementById('closeEditModal').click();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            const response = await apiClient.delete(`/camps/deletecamp/${currentEvent.id}`);

            if (!response.ok) {
                throw new Error('Failed to delete camp');
            }

            await fetchEvents(); // Reload camp list after delete
            document.getElementById('closeDeleteModal').click();
        } catch (err) {
            setError(err.message);
        }
    };

    const openEditModal = (event) => {
        setCurrentEvent(event);
        setFormData({
            title: event.title,
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location,
            fromdate: event.fromdate,
            todate: event.todate,
            units: event.units,
            donors: event.donors,
            time: event.time,
            location: event.location,
            address: event.address,
            state: event.state,
            city: event.city,
            pincode: event.pincode,
            contact: event.contact,
            email: event.email,
            description: event.description
        });
    };

    const openViewModal = (event) => {
        setCurrentEvent(event);
    };

    const openDeleteModal = (event) => {
        setCurrentEvent(event);
    };

    console.log(formData, "formData");
  return (
    <MasterLayout>
        <>
            <div className="container-fluid">
                <p>
                    <h6>Camp Details</h6>
                </p>
                <div className="row gy-4">
                    <div className="col-xxl-3 col-lg-4">
                        <div className="card h-100 p-0">
                            <div className="card-body p-24">
                                <button
                                    type="button"
                                    className="btn btn-primary-p text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-32"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                >
                                    <Icon
                                        icon="fa6-regular:square-plus"
                                        className="icon text-lg line-height-1"
                                    />
                                    Add Camp
                                </button>
                                <div className="mt-32">
                                    {events.map((event) => (
                                        <div key={event.id} className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0">
                                            <div className="">
                                                <span className="text-primary-light fw-semibold text-sm mt-6">
                                                    {event.title}
                                                </span>
                                                <div className="d-flex align-items-center gap-10">
                                                    <span className="text-secondary-light text-sm">
                                                        {event.time}
                                                    </span>
                                                </div>
                                                <span className="text-primary-light fw-medium text-sm mt-6">
                                                    {event.location}
                                                </span>
                                            </div>
                                            <div className="dropdown">
                                                <button
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <Icon
                                                        icon="entypo:dots-three-vertical"
                                                        className="icon text-secondary-light"
                                                    />
                                                </button>
                                                <ul className="dropdown-menu p-12 border bg-base shadow">
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#exampleModalView"
                                                            onClick={() => openViewModal(event)}
                                                        >
                                                            <Icon
                                                                icon="hugeicons:view"
                                                                className="icon text-lg line-height-1"
                                                            />
                                                            View
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#exampleModalEdit"
                                                            onClick={() => openEditModal(event)}
                                                        >
                                                            <Icon
                                                                icon="lucide:edit"
                                                                className="icon text-lg line-height-1"
                                                            />
                                                            Edit
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#exampleModalDelete"
                                                            onClick={() => openDeleteModal(event)}
                                                        >
                                                            <Icon
                                                                icon="fluent:delete-24-regular"
                                                                className="icon text-lg line-height-1"
                                                            />
                                                            Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-9 col-lg-8">
                        <div className="card h-100 p-0">
                            <div className="card-body p-24">
                                <div id="wrap">
                                    <div id="calendar" />
                                    <div style={{ clear: "both" }} />
                                    <Calendar events={events} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Add Event */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Add Camp Details
                            </h1>
                            <button
                                id="closeAddModal"
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            <form onSubmit={handleAddEvent}>
    {/* CampId (read-only, only for edit/view) */}
    {formData.campId && (
        <div className="col-12 mb-20">
            <label className="form-label fw-semibold text-primary-light text-sm mb-8">Camp ID</label>
            <input type="text" className="form-control radius-8" value={formData.campId} readOnly />
        </div>
    )}
    {/* Organizer */}
    <div className="col-12 mb-20">
        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Organizer</label>
        <input type="text" name="organizer" className="form-control radius-8" placeholder="Enter Organizer" value={formData.organizer} onChange={handleInputChange} required />
    </div>
    {/* Units */}
    <div className="col-6 mb-20">
        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Units</label>
        <input type="number" name="units" className="form-control radius-8" placeholder="Enter Units" value={formData.units} onChange={handleInputChange} min="0" />
    </div>
    {/* Donors */}
    <div className="col-6 mb-20">
        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Donors</label>
        <input type="number" name="donors" className="form-control radius-8" placeholder="Enter Donors" value={formData.donors} onChange={handleInputChange} min="0" />
    </div>
    {/* Address */}
    <div className="col-12 mb-20">
        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Address</label>
        <input type="text" name="address" className="form-control radius-8" placeholder="Enter Address" value={formData.address} onChange={handleInputChange} />
    </div>
    {/* Status */}
    <div className="col-12 mb-20">
        <label className="form-label fw-semibold text-primary-light text-sm mb-8">Status</label>
        <select name="status" className="form-control radius-8" value={formData.status} onChange={handleInputChange} required>
            <option value="planned">Planned</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
        </select>
    </div>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Event Title :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control radius-8"
                                            placeholder="Enter Event Title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Start Date
                                        </label>
                                        <div className="position-relative">
                                            <DatePicker
                                                id="startDate"
                                                name="startDate"
                                                placeholder="Select start date and time"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                            />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon
                                                    icon="solar:calendar-linear"
                                                    className="icon text-lg"></Icon>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            End Date
                                        </label>
                                        <div className="position-relative">
                                            <DatePicker
                                                id="endDate"
                                                name="endDate"
                                                placeholder="Select end date and time"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                            />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon
                                                    icon="solar:calendar-linear"
                                                    className="icon text-lg"></Icon>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Add State
                                        </label>
                                        <select
                                            className="form-control radius-8"
                                            name="state"
                                            value={selectedState}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoadingStates || states.length === 0}
                                        >
                                            <option value="">{isLoadingStates ? 'Loading states...' : 'Select State'}</option>
                                            {states.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Add City
                                        </label>
                                        <select
                                            className="form-control radius-8"
                                            name="city"
                                            value={selectedCity}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoadingCities || cities.length === 0 || !selectedState}
                                        >
                                            <option value="">{isLoadingCities ? 'Loading cities...' : 'Select City'}</option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Add Address :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control radius-8"
                                            placeholder="Enter Address"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            className="form-control radius-8"
                                            placeholder="Enter Pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Contact No :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="contact"
                                            className="form-control radius-8"
                                            placeholder="Enter Contact No"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Contact Mail Id :{" "}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control radius-8"
                                            placeholder="Enter Contact Mail Id"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows={4}
                                            placeholder="Write some text"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                        <button
                                            type="reset"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                            onClick={() => setFormData({
                                                title: "",
                                                startDate: "",
                                                endDate: "",
                                                location: "",
                                                pincode: "",
                                                contact: "",
                                                email: "",
                                                description: ""
                                            })}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal View Event */}
            <div
                className="modal fade"
                id="exampleModalView"
                tabIndex={-1}
                aria-labelledby="exampleModalViewLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalViewLabel">
                                View Details
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            {currentEvent && (
    <>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Camp ID</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.campId}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Title</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.title}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Organizer</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.organizer}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">From Date</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.fromdate}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">To Date</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.todate}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Time</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.time}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Units</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.units}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Donors</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.donors}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Location</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.location}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Address</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.address}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">State</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.state}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">City</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.city}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Pincode</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.pincode}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Contact</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.contact}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Email</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.email}</h6></div>
        <div className="mb-12"><span className="text-secondary-light txt-sm fw-medium">Status</span><h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">{currentEvent.status}</h6></div>
    </>
)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit Event */}
            <div
                className="modal fade"
                id="exampleModalEdit"
                tabIndex={-1}
                aria-labelledby="exampleModalEditLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                                Edit Event
                            </h1>
                            <button
                                id="closeEditModal"
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            <form onSubmit={handleEditEvent}>
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Event Title :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-control radius-8"
                                            placeholder="Enter Event Title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Start Date
                                        </label>
                                        <div className="position-relative">
                                            <DatePicker
                                                id="editStartDate"
                                                placeholder="Select start date and time"
                                                value={formData.startDate}
                                                onChange={(value) => setFormData({ ...formData, startDate: value })}
                                            />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon icon="solar:calendar-linear" className="icon text-lg"></Icon>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            End Date
                                        </label>
                                        <div className="position-relative">
                                            <DatePicker
                                                id="editEndDate"
                                                placeholder="Select end date and time"
                                                value={formData.endDate}
                                                onChange={(value) => setFormData({ ...formData, endDate: value })}
                                            />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon icon="solar:calendar-linear" className="icon text-lg"></Icon>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Add State
                                        </label>
                                        <select
                                            className="form-control radius-8"
                                            name="state"
                                            value={selectedState}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoadingStates || states.length === 0}
                                        >
                                            <option value="">{isLoadingStates ? 'Loading states...' : 'Select State'}</option>
                                            {states.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Add City
                                        </label>
                                        <select
                                            className="form-control radius-8"
                                            name="city"
                                            value={selectedCity}
                                            onChange={handleInputChange}
                                            required
                                            disabled={isLoadingCities || cities.length === 0 || !selectedState}
                                        >
                                            <option value="">{isLoadingCities ? 'Loading cities...' : 'Select City'}</option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Add Address :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control radius-8"
                                            placeholder="Enter Address"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            className="form-control radius-8"
                                            placeholder="Enter Pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Contact No :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            name="contact"
                                            className="form-control radius-8"
                                            placeholder="Enter Contact No"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Contact Mail Id :{" "}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control radius-8"
                                            placeholder="Enter Contact Mail Id"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows={4}
                                            placeholder="Write some text"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Delete Event */}
            <div
                className="modal fade"
                id="exampleModalDelete"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-sm modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-body p-24 text-center">
                            <span className="mb-16 fs-1 line-height-1 text-danger">
                                <Icon
                                    icon="fluent:delete-24-regular"
                                    className="menu-icon"
                                />
                            </span>
                            <h6 className="text-lg fw-semibold text-primary-light mb-0">
                                Are you sure you want to delete this event?
                            </h6>
                            <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                <button
                                    id="closeDeleteModal"
                                    type="button"
                                    className="w-50 border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="w-50 btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                    onClick={handleDeleteEvent}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        <p></p>
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