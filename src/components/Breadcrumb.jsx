import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
const Breadcrumb = ({ title }) => {
  return (
    <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24'>
      <h6 className='fw-semibold mb-0'>BOSS Donation Dashboard</h6>
      <ul className='d-flex align-items-center gap-2'>
        <li className='fw-medium'>{title}</li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
