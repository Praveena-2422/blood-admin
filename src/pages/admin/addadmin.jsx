import React from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import { apiClient } from "../../network/apiClient";
import { toast, ToastContainer } from "react-toastify";

const AddAdmin = () => {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ name, email, phone, address });
        const data = { name, email, phone, address };
        try {
            const response = await apiClient.post('user/addadmin', data);
            const result = response.data;
            console.log(result);
            if (result.success) {
                toast.success(result.message);
                setName('');
                setEmail('');
                setPhone('');
                setAddress('');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('API Error:', error);
            if (error.response) {
                const { data } = error.response;
                toast.error(data.message || 'Something went wrong');
            } else {
                toast.error('Network error occurred');
            }
        }
    };
const handleNameChange = (e) => {
    setName(e.target.value);
};

const handleEmailChange = (e) => {
    setEmail(e.target.value);
};

const handlePhoneChange = (e) => {
    setPhone(e.target.value);
};

const handleAddressChange = (e) => {
    setAddress(e.target.value);
};


  return (
    <>
      <ToastContainer />
      {/* MasterLayout */}
      <MasterLayout>

      <div className="card h-100 p-0 radius-12 overflow-hidden">
            <div className="card-body p-40">
                <form action="#">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="mb-20">
                                <label
                                    htmlFor="name"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Full Name <span className="text-danger-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="name"
                                    placeholder="Enter Full Name"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-20">
                                <label
                                    htmlFor="email"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Email <span className="text-danger-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-control radius-8"
                                    id="email"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-20">
                                <label
                                    htmlFor="number"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Phone Number <span className="text-danger-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control radius-8"
                                    id="number"
                                    placeholder="Enter phone number"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                />
                            </div>  
                        </div>
                        <div className="col-sm-12">
                            <div className="mb-20">
                                <label
                                    htmlFor="address"
                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                >
                                    Address <span className="text-danger-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control radius-8"
                                    id="address"
                                    placeholder="Enter Your Address"
                                    value={address}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                            <button
                                type="reset"
                                className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                            >
                                Save Change
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

      </MasterLayout>
    </>
  );
};

export default AddAdmin;

// Add ToastContainer outside of the component
const ToastContainerComponent = () => <ToastContainer />;
export { ToastContainerComponent };
