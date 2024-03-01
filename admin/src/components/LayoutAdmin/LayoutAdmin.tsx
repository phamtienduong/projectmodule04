import React from 'react';
import './LayoutAdmin.scss';
import { Link } from 'react-router-dom';
import AdminProduct from '../AdminProduct/AdminProduct';

interface LayoutAdminProps {
  children: React.ReactNode;
}

export default function LayoutAdmin({ children }: LayoutAdminProps) {
  const handleLogOut = () => {
    localStorage.clear();
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('admin_token');
    return !!token; // Trả về true nếu có token, ngược lại là false
  };

  if (!isAuthenticated()) {
    window.location.href = '/';
    return null;
  }

  return (
    <div>
      <header role="banner">
        <h1 className="text-3xl "></h1>
        <ul className="utilities">
          <li className="users">
            <a href="#">My Account</a>
          </li>
          <li className="logout warn">
            <a onClick={handleLogOut} href="/">
              Log Out
            </a>
          </li>
        </ul>
      </header>

      <nav role="navigation">
        <ul className="main">
          <li className="dashboard">
            <Link to="user">Users</Link>
          </li>
          <li className="write">
            <Link to="category">Category</Link>
          </li>
          <li className="write">
            <Link to="product">Products</Link>
          </li>
          <li className="edit">
            <Link to="bill">Bills</Link>
          </li>
        </ul>
      </nav>

      <main role="main">{children}</main>

      <footer role="contentinfo">Easy Admin Style by Melissa Cabral</footer>
    </div>
  );
}

