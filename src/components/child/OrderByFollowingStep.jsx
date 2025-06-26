import React, { useState } from "react";

const OrderByFollowingStep = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  return (
    <div className='col-md-12'>
      <div className='card'>
        <div className='card-body'>
          <h6 className='mb-4 text-xl'>Add Requestor Details</h6>
          <p className='text-neutral-500'>
            Fill up all mandatory fields.
          </p>
          {/* Form Wizard Start */}
          <div className='form-wizard'>
            <form action='#' method='post'>
              <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>
                <ul className='list-unstyled form-wizard-list style-two'>
                  <li
                    className={`form-wizard-list__item
                      ${[2, 3, 4].includes(currentStep) && "activated"}
                    ${currentStep === 1 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>1</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                      Personal Details{" "}
                    </span>
                  </li>
                  <li
                    className={`form-wizard-list__item
                      ${[3, 4].includes(currentStep) && "activated"}
                    ${currentStep === 2 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>2</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                      Location Details
                    </span>
                  </li>
                  <li
                    className={`form-wizard-list__item
                      ${[4].includes(currentStep) && "activated"}
                    ${currentStep === 3 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>3</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Order Plan</span>
                  </li>
                  <li
                    className={`form-wizard-list__item

                    ${currentStep === 4 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>4</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Completed</span>
                  </li>
                </ul>
              </div>
              <fieldset
                className={`wizard-fieldset ${currentStep === 1 && "show"} `}
              >
                <h6 className='text-md text-neutral-500'>
                  Personal Information
                </h6>
                <div className='row gy-3'>
                  <div className='col-sm-6'>
                    <label className='form-label'>First Name*</label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        className='form-control wizard-required'
                        placeholder='Enter First Name'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Last Name*</label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        className='form-control wizard-required'
                        placeholder='Enter Last Name'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Email</label>
                    <div className='position-relative'>
                      <input
                        type='email'
                        className='form-control wizard-required'
                        placeholder='Enter Email'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Mobile No*</label>
                    <div className='position-relative'>
                      <input
                        type='mobile no'
                        className='form-control wizard-required'
                        placeholder='Enter Mobile No'
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Relationship to Patient*</label>
                    <div className='position-relative'>
                      <select
                        className='form-control wizard-required'
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>Select Relationship</option>
                        <option value="self">Self</option>
                        <option value="parent">Parent</option>
                        <option value="spouse">Spouse</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Patient Age*</label>
                    <div className='position-relative'>
                      <input
                        type='Age'
                        className='form-control wizard-required'
                        placeholder='Enter Patient Age'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                   <div className='col-sm-6'>
                    <label className='form-label'>Select Gender*</label>
                    <div className='position-relative'>
                      <select
                        className='form-control wizard-required'
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Patient Age*</label>
                    <div className='position-relative'>
                      <input
                        type='Age'
                        className='form-control wizard-required'
                        placeholder='Enter Patient Age'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <h6 className='text-md text-neutral-500'>
                  Blood Requirement Details
                  </h6>
                  <div className='col-sm-6'>
  <label className='form-label'>Select Blood Group*</label>
  <div className='position-relative'>
    <select
      className='form-control wizard-required'
      required
      defaultValue=""
    >
      <option value="" disabled>Select</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
    </select>
    <div className='wizard-form-error' />
  </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Unit Needed (eg.., 1-5)*</label>
                    <div className='position-relative'>
                      <input
                        type='unit'
                        className='form-control wizard-required'
                        placeholder='Enter Unit Needed'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Select Date*</label>
                    <div className='position-relative'>
                      <input
                        type='date'
                        className='form-control wizard-required'
                        required = ''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                  <label className='form-label d-block'>Is it an Emergency?*</label>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='emergencyToggle'
                    />
                    <label className='form-check-label' htmlFor='emergencyToggle'>
                      Yes / No
                    </label>
                  </div>
                </div>

                <div className='col-sm-6'>
                    <label className='form-label'>Reason*</label>
                    <div className='position-relative'>
                      <input
                        type='Reason'
                        className='form-control wizard-required'
                        placeholder='Reason For Blood Request'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>

                  <div className='col-sm-6'>
                    <label className='form-label'>Hospital / Clinic Name*</label>
                    <div className='position-relative'>
                      <input
                        type='Hospital / Clinic'
                        className='form-control wizard-required'
                        placeholder='Hospital / Clinic Name'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>

                  <div className='col-sm-6'>
                    <label className='form-label'>Contact Number*</label>
                    <div className='position-relative'>
                      <input
                        type='Contact Number'
                        className='form-control wizard-required'
                        placeholder='Contact Number'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>

                  <div className='col-sm-6'>
                    <label className='form-label'>Hospital Address*</label>
                    <div className='position-relative'>
                      <input
                        type='Hospital Address'
                        className='form-control wizard-required'
                        placeholder='Hospital Address'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>

                  <div className='col-sm-6'>
                    <label className='form-label'>Doctor / Reference Name(Optional)</label>
                    <div className='position-relative'>
                      <input
                        type='doctorname'
                        className='form-control wizard-required'
                        placeholder='Doctor / Reference Name'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>


                  <div className='form-group text-end'>
                    <button
                      onClick={nextStep}
                      type='button'
                      className='form-wizard-next-btn btn btn-primary-600 px-32'
                    >
                      Next
                    </button>
                  </div>
                </div>
              </fieldset>
              <fieldset
                className={`wizard-fieldset ${currentStep === 2 && "show"} `}
              >
                <h6 className='text-md text-neutral-500'>
                  Location Details
                </h6>

                <div className='col-sm-6'>
                    <label className='form-label'>Hospital Address*</label>
                    <div className='position-relative'>
                      <input
                        type='Hospital Address'
                        className='form-control wizard-required'
                        placeholder='Hospital Address'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Hospital Address*</label>
                    <div className='position-relative'>
                      <input
                        type='Hospital Address'
                        className='form-control wizard-required'
                        placeholder='Hospital Address'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Hospital Address*</label>
                    <div className='position-relative'>
                      <input
                        type='Hospital Address'
                        className='form-control wizard-required'
                        placeholder='Hospital Address'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Hospital Address*</label>
                    <div className='position-relative'>
                      <input
                        type='Hospital Address'
                        className='form-control wizard-required'
                        placeholder='Hospital Address'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                <div className='row gy-3'>
                  <div className='col-12'>
                    <label className='form-label'>User Name*</label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        className='form-control wizard-required'
                        placeholder='Enter User Name'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <label className='form-label'>Card Number*</label>
                    <div className='position-relative'>
                      <input
                        type='number'
                        className='form-control wizard-required'
                        placeholder='Enter Card Number '
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <label className='form-label'>
                      Card Expiration(MM/YY)*
                    </label>
                    <div className='position-relative'>
                      <input
                        type='number'
                        className='form-control wizard-required'
                        placeholder='Enter Card Expiration'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <label className='form-label'>CVV Number*</label>
                    <div className='position-relative'>
                      <input
                        type='number'
                        className='form-control wizard-required'
                        placeholder='CVV Number'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Password*</label>
                    <div className='position-relative'>
                      <input
                        type='password'
                        className='form-control wizard-required'
                        placeholder='Enter Password'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='form-group d-flex align-items-center justify-content-end gap-8'>
                    <button
                      onClick={prevStep}
                      type='button'
                      className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      type='button'
                      className='form-wizard-next-btn btn btn-primary-600 px-32'
                    >
                      Next
                    </button>
                  </div>
                </div>
              </fieldset>
              <fieldset
                className={`wizard-fieldset ${currentStep === 3 && "show"} `}
              >
                <h6 className='text-md text-neutral-500'>Bank Information</h6>
                <div className='row gy-3'>
                  <div className='col-sm-6'>
                    <label className='form-label'>Bank Name*</label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        className='form-control wizard-required'
                        placeholder='Enter Bank Name'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Branch Name*</label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        className='form-control wizard-required'
                        placeholder='Enter Branch Name'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Account Name*</label>
                    <div className='position-relative'>
                      <input
                        type='text'
                        className='form-control wizard-required'
                        placeholder='Enter Account Name'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Account Number*</label>
                    <div className='position-relative'>
                      <input
                        type='number'
                        className='form-control wizard-required'
                        placeholder='Enter Account Number'
                        required=''
                      />
                      <div className='wizard-form-error' />
                    </div>
                  </div>
                  <div className='form-group d-flex align-items-center justify-content-end gap-8'>
                    <button
                      onClick={prevStep}
                      type='button'
                      className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      type='button'
                      className='form-wizard-next-btn btn btn-primary-600 px-32'
                    >
                      Next
                    </button>
                  </div>
                </div>
              </fieldset>
              <fieldset
                className={`wizard-fieldset ${currentStep === 4 && "show"} `}
              >
                <div className='text-center mb-40'>
                  <img
                    src='assets/images/gif/success-img3.gif'
                    alt=''
                    className='gif-image mb-24'
                  />
                  <h6 className='text-md text-neutral-600'>Congratulations </h6>
                  <p className='text-neutral-400 text-sm mb-0'>
                    Well done! You have successfully completed.
                  </p>
                </div>
                <div className='form-group d-flex align-items-center justify-content-end gap-8'>
                  <button
                    onClick={prevStep}
                    type='button'
                    className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                  >
                    Back
                  </button>
                  <button
                    type='button'
                    className='form-wizard-submit btn btn-primary-600 px-32'
                  >
                    Publish
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
          {/* Form Wizard End */}
        </div>
      </div>
    </div>
  );
};

export default OrderByFollowingStep;
