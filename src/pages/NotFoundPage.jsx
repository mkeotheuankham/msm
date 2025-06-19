import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - ບໍ່ພົບໜ້າທີ່ຕ້ອງການ</h1>
      <p>ໜ້າທີ່ທ່ານຄົ້ນຫາບໍ່ມີຢູ່</p>
      <Link to="/" style={{ color: '#0066cc' }}>
        ກັບຄືນໜ້າຫຼັກ
      </Link>
    </div>
  );
};

export default NotFoundPage;