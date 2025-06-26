import React, { useEffect, useRef, useState } from 'react';
import Calendar from './child/Calendar';
import { Icon } from '@iconify/react/dist/iconify.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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

const CalendarMainLayer = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        startDate: "",
        endDate: "",
        location: "",
        contact: "",
        email: "",
        description: ""
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://blood-backend-lf52.onrender.com/api/camps');
                if (!response.ok) {
                    throw new Error('Failed to fetch camps');
                }
                const data = await response.json();
                const formattedEvents = data.camps.map(camp => ({
                    id: camp._id,
                    title: camp.title,
                    time: `${camp.time}`,
                    location: camp.location,
                    startDate: `${camp.date} ${camp.time.split(' - ')[0]}`,
                    endDate: `${camp.date} ${camp.time.split(' - ')[1]}`,
                    contact: camp.contact,
                    email: '',
                    description: camp.organizer
                }));
                setEvents(formattedEvents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            // Format the date and time for the API
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            const formattedDate = startDate.toISOString().split('T')[0];
            const formattedStartTime = startDate.toTimeString().substring(0, 5);
            const formattedEndTime = endDate.toTimeString().substring(0, 5);

            const response = await fetch('https://blood-backend-lf52.onrender.com/api/camps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.title,
                    date: formattedDate,
                    time: `${formattedStartTime} - ${formattedEndTime}`,
                    location: formData.location,
                    contact: formData.contact,
                    organizer: formData.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create camp');
            }

            const newCamp = await response.json();
            setEvents([...events, {
                id: newCamp._id,
                title: newCamp.title,
                time: newCamp.time,
                location: newCamp.location,
                startDate: `${newCamp.date} ${newCamp.time.split(' - ')[0]}`,
                endDate: `${newCamp.date} ${newCamp.time.split(' - ')[1]}`,
                contact: newCamp.contact,
                email: '',
                description: newCamp.organizer
            }]);

            // Reset form
            setFormData({
                title: "",
                startDate: "",
                endDate: "",
                location: "",
                contact: "",
                email: "",
                description: ""
            });

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

            const formattedDate = startDate.toISOString().split('T')[0];
            const formattedStartTime = startDate.toTimeString().substring(0, 5);
            const formattedEndTime = endDate.toTimeString().substring(0, 5);

            const response = await fetch(`https://blood-backend-lf52.onrender.com/api/camps/${currentEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    date: formattedDate,
                    time: `${formattedStartTime} - ${formattedEndTime}`,
                    location: formData.location,
                    contact: formData.contact,
                    organizer: formData.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update camp');
            }

            const updatedCamp = await response.json();
            const updatedEvents = events.map(event =>
                event.id === currentEvent.id ? {
                    ...event,
                    title: updatedCamp.title,
                    time: updatedCamp.time,
                    location: updatedCamp.location,
                    startDate: `${updatedCamp.date} ${updatedCamp.time.split(' - ')[0]}`,
                    endDate: `${updatedCamp.date} ${updatedCamp.time.split(' - ')[1]}`,
                    contact: updatedCamp.contact,
                    email: '',
                    description: updatedCamp.organizer
                } : event
            );
            setEvents(updatedEvents);
            document.getElementById('closeEditModal').click();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            const response = await fetch(`https://blood-backend-lf52.onrender.com/api/camps/${currentEvent.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete camp');
            }

            setEvents(events.filter(event => event.id !== currentEvent.id));
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
                                                id="endDate"
                                                name="endDate"
                                                placeholder="Select end date and time"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                            />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon icon="solar:calendar-linear" className="icon text-lg"></Icon>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rest of your form fields remain the same */}
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
                                    <div className="mb-12">
                                        <span className="text-secondary-light txt-sm fw-medium">Title</span>
                                        <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                            {currentEvent.title}
                                        </h6>
                                    </div>
                                    <div className="mb-12">
                                        <span className="text-secondary-light txt-sm fw-medium">
                                            Start Date
                                        </span>
                                        <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                            {currentEvent.startDate}
                                        </h6>
                                    </div>
                                    <div className="mb-12">
                                        <span className="text-secondary-light txt-sm fw-medium">
                                            End Date
                                        </span>
                                        <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                            {currentEvent.endDate}
                                        </h6>
                                    </div>
                                    <div className="mb-12">
                                        <span className="text-secondary-light txt-sm fw-medium">
                                            Location
                                        </span>
                                        <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                            {currentEvent.location}
                                        </h6>
                                    </div>
                                    <div className="mb-12">
                                        <span className="text-secondary-light txt-sm fw-medium">
                                            Contact
                                        </span>
                                        <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                            {currentEvent.contact}
                                        </h6>
                                    </div>
                                    <div className="mb-12">
                                        <span className="text-secondary-light txt-sm fw-medium">
                                            Email
                                        </span>
                                        <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                            {currentEvent.email}
                                        </h6>
                                    </div>
                                    <div className="mb-12">
                                        <span className="text-secondary-light txt-sm fw-medium">
                                            Description
                                        </span>
                                        <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                            {currentEvent.description}
                                        </h6>
                                    </div>
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
    );
};

export default CalendarMainLayer;