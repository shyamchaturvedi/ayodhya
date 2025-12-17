import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin');
    };

    // Mock Data
    const stats = [
        { title: 'Total Registrations', value: '1,245', color: '#4CAF50' },
        { title: 'Total Donations', value: '₹ 25,40,000', color: '#FF9800' },
        { title: 'Sankalp Taken', value: '10,500+', color: '#2196F3' },
        { title: 'Pending Queries', value: '45', color: '#F44336' },
    ];

    const recentRegistrations = [
        { id: 1, name: 'Rahul Verma', city: 'Lucknow', type: 'Family', date: '17 Dec 2025' },
        { id: 2, name: 'Sita Devi', city: 'Ayodhya', type: 'Individual', date: '17 Dec 2025' },
        { id: 3, name: 'Amit Singh', city: 'Delhi', type: 'Vishesh Yajman', date: '16 Dec 2025' },
        { id: 4, name: 'Priya Sharma', city: 'Varanasi', type: 'Family', date: '16 Dec 2025' },
        { id: 5, name: 'Vikram Das', city: 'Mathura', type: 'Individual', date: '15 Dec 2025' },
    ];

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h2>Admin Dashboard</h2>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </header>

            <div className="dashboard-content container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div className="stat-card" key={index} style={{ borderTopColor: stat.color }}>
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    ))}
                </div>

                <div className="data-section">
                    <h3>Recent Registrations</h3>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>City</th>
                                    <th>Participation Type</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRegistrations.map((row) => (
                                    <tr key={row.id}>
                                        <td>#{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.city}</td>
                                        <td><span className="badge">{row.type}</span></td>
                                        <td>{row.date}</td>
                                        <td>
                                            <button className="btn-sm">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
