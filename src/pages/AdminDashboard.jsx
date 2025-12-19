import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { supabase } from '../supabaseClient';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        totalDonations: 0,
        pendingPayments: 0,
        todayRegistrations: 0,
        totalContacts: 0
    });
    const [registrations, setRegistrations] = useState([]);
    const [donations, setDonations] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [savingSettings, setSavingSettings] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Settings state - will be loaded from database
    const [settings, setSettings] = useState({
        upiId: '',
        adminUsername: '',
        adminPassword: '',
        contactEmail: ''
    });

    // Check admin login and load settings
    useEffect(() => {
        const user = localStorage.getItem('adminUser');
        if (!user) {
            navigate('/admin');
        } else {
            fetchAllData();
            fetchSettings();
        }
    }, [navigate]);

    // Fetch settings from Supabase
    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('key, value');

            if (error) {
                console.error('Error fetching settings:', error);
                return;
            }

            if (data && data.length > 0) {
                const settingsObj = {};
                data.forEach(item => {
                    if (item.key === 'upi_id') settingsObj.upiId = item.value;
                    if (item.key === 'admin_username') settingsObj.adminUsername = item.value;
                    if (item.key === 'admin_password') settingsObj.adminPassword = item.value;
                    if (item.key === 'contact_email') settingsObj.contactEmail = item.value;
                });
                setSettings(prev => ({ ...prev, ...settingsObj }));
            }
        } catch (err) {
            console.error('Settings fetch error:', err);
        }
    };

    // Save setting to database and show success notification
    const saveSetting = async (key, value, successText) => {
        setSavingSettings(true);
        setSuccessMessage('');
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

            if (error) {
                setSuccessMessage('❌ Error: ' + error.message);
                setTimeout(() => setSuccessMessage(''), 4000);
                return false;
            }

            setSuccessMessage(successText || '✅ Saved to database!');
            setTimeout(() => setSuccessMessage(''), 3000);
            return true;
        } catch (err) {
            setSuccessMessage('❌ Error: ' + err.message);
            setTimeout(() => setSuccessMessage(''), 4000);
            return false;
        } finally {
            setSavingSettings(false);
        }
    };

    // Fetch tab-specific data
    useEffect(() => {
        if (activeTab === 'donations') {
            fetchDonations();
        } else if (activeTab === 'contacts') {
            fetchContacts();
        }
    }, [activeTab, selectedDate]);

    // ==================== FETCH FUNCTIONS ====================

    const fetchAllData = async () => {
        try {
            setLoading(true);

            // Fetch registrations
            const { data: regData, error: regError } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (regError) throw regError;

            // Fetch contacts count
            const { count: contactsCount } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true });

            // Fetch actual donations total
            const { data: donationsData } = await supabase
                .from('donations')
                .select('amount');

            const actualDonations = donationsData?.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0) || 0;

            // Calculate stats
            const totalReg = regData?.length || 0;
            const pending = regData?.filter(r => r.payment_status === 'pending' && r.transaction_id).length || 0;
            const today = new Date().toDateString();
            const todayReg = regData?.filter(r => new Date(r.created_at).toDateString() === today).length || 0;

            setStats({
                totalRegistrations: totalReg,
                totalDonations: actualDonations,
                pendingPayments: pending,
                todayRegistrations: todayReg,
                totalContacts: contactsCount || 0
            });

            setRegistrations(regData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonations = async () => {
        try {
            let query = supabase
                .from('donations')
                .select('*')
                .order('created_at', { ascending: false });

            if (selectedDate) {
                const startDate = new Date(selectedDate);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(selectedDate);
                endDate.setHours(23, 59, 59, 999);

                query = query
                    .gte('created_at', startDate.toISOString())
                    .lte('created_at', endDate.toISOString());
            }

            const { data, error } = await query;
            if (error) throw error;
            setDonations(data || []);

        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const fetchContacts = async () => {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setContacts(data || []);

        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    // ==================== ACTION FUNCTIONS ====================

    const verifyPayment = async (id) => {
        console.log('Verify clicked for ID:', id);

        try {
            const { data, error } = await supabase
                .from('registrations')
                .update({ payment_status: 'verified' })
                .eq('id', id)
                .select();

            console.log('Update result:', data, error);

            if (error) {
                console.error('Supabase error:', error);
                alert('❌ Error: ' + error.message);
                return;
            }

            setRegistrations(prev => prev.map(r =>
                r.id === id ? { ...r, payment_status: 'verified' } : r
            ));

            // Only update pending count - donations come from donations table
            setStats(prev => ({
                ...prev,
                pendingPayments: Math.max(0, prev.pendingPayments - 1)
            }));
            alert('✅ Payment verified successfully!');

        } catch (error) {
            console.error('Catch Error:', error);
            alert('❌ Verification failed: ' + error.message);
        }
    };

    const rejectPayment = async (id) => {
        console.log('Reject clicked for ID:', id);

        try {
            const { error } = await supabase
                .from('registrations')
                .update({ payment_status: 'rejected', transaction_id: null })
                .eq('id', id);

            if (error) {
                alert('❌ Error: ' + error.message);
                return;
            }

            setRegistrations(prev => prev.map(r =>
                r.id === id ? { ...r, payment_status: 'rejected', transaction_id: null } : r
            ));
            alert('Payment rejected.');

        } catch (error) {
            console.error('Error:', error);
            alert('❌ Operation failed!');
        }
    };

    const deleteEntry = async (id, table = 'registrations') => {
        console.log('Delete clicked for ID:', id, 'table:', table);

        try {
            const { error } = await supabase.from(table).delete().eq('id', id);

            if (error) {
                alert('❌ Delete Error: ' + error.message);
                return;
            }

            if (table === 'registrations') {
                setRegistrations(prev => prev.filter(r => r.id !== id));
                setStats(prev => ({ ...prev, totalRegistrations: prev.totalRegistrations - 1 }));
            } else if (table === 'contacts') {
                setContacts(prev => prev.filter(c => c.id !== id));
            } else if (table === 'donations') {
                setDonations(prev => prev.filter(d => d.id !== id));
            }
            alert('✅ Deleted successfully!');

        } catch (error) {
            console.error('Error:', error);
            alert('❌ Delete failed! Check RLS policies.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        navigate('/admin');
    };

    const handlePrint = (type = 'registrations') => {
        const printWindow = window.open('', '_blank');
        const today = new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        let content = '';
        let title = '';

        if (type === 'registrations' || activeTab === 'registrations') {
            title = 'Registration Report';
            const data = filteredRegistrations;
            content = `
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Member ID</th>
                            <th>Mobile</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Gotra</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((r, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                                <td><strong>${r.name}</strong></td>
                                <td>${r.member_id || '-'}</td>
                                <td>${r.phone}</td>
                                <td>${r.city || '-'}</td>
                                <td>${r.state || '-'}</td>
                                <td>${r.gotra || '-'}</td>
                                <td class="status-${r.payment_status}">${r.payment_status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="summary">
                    <p><strong>Total Registrations:</strong> ${data.length}</p>
                    <p><strong>Verified:</strong> ${data.filter(r => r.payment_status === 'verified').length}</p>
                    <p><strong>Pending:</strong> ${data.filter(r => r.payment_status === 'pending').length}</p>
                </div>
            `;
        } else if (type === 'donations' || activeTab === 'donations') {
            title = `Daily Donation Report - ${new Date(selectedDate).toDateString()}`;
            const total = donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
            content = `
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Time</th>
                            <th>Donor Name</th>
                            <th>Phone</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Transaction ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${donations.map((d, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${new Date(d.created_at).toLocaleTimeString('en-IN')}</td>
                                <td><strong>${d.donor_name || '-'}</strong></td>
                                <td>${d.phone || '-'}</td>
                                <td class="amount">₹ ${parseFloat(d.amount || 0).toLocaleString()}</td>
                                <td>${d.payment_method || '-'}</td>
                                <td>${d.transaction_id || '-'}</td>
                                <td class="status-verified">${d.status || 'Received'}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td colspan="4" style="text-align:right;"><strong>TOTAL:</strong></td>
                            <td colspan="4" class="total-amount">₹ ${total.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title} - श्री राम राज्य महायज्ञ</title>
                <style>
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Segoe UI', 'Nirmala UI', sans-serif;
                        font-size: 11pt;
                        color: #333;
                        padding: 20px;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 15px;
                        border-bottom: 3px solid #C73E2C;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        color: #C73E2C;
                        font-size: 20pt;
                        margin: 0 0 5px;
                    }
                    .header h2 {
                        color: #FF8F00;
                        font-size: 14pt;
                        font-weight: normal;
                        margin: 0 0 5px;
                    }
                    .header p {
                        color: #666;
                        font-size: 10pt;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                        font-size: 10pt;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px 10px;
                        text-align: left;
                    }
                    th {
                        background: #C73E2C;
                        color: white;
                        font-weight: 600;
                    }
                    tr:nth-child(even) {
                        background: #f9f9f9;
                    }
                    .status-verified {
                        color: #2E7D32;
                        font-weight: 600;
                    }
                    .status-pending {
                        color: #F57C00;
                        font-weight: 600;
                    }
                    .status-rejected {
                        color: #D32F2F;
                        font-weight: 600;
                    }
                    .amount {
                        font-weight: 600;
                        color: #2E7D32;
                    }
                    .total-row {
                        background: #FFF8E1 !important;
                        font-weight: bold;
                    }
                    .total-amount {
                        font-size: 14pt;
                        color: #C73E2C;
                    }
                    .summary {
                        background: #f5f5f5;
                        padding: 15px;
                        border-radius: 8px;
                        margin-top: 20px;
                    }
                    .summary p {
                        margin: 5px 0;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 2px dashed #FFD700;
                        text-align: center;
                        font-size: 10pt;
                        color: #666;
                    }
                    .footer .blessing {
                        color: #C73E2C;
                        font-weight: bold;
                        font-size: 12pt;
                        margin-bottom: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>॥ श्री राम राज्य महायज्ञ ॥</h1>
                    <h2>${title}</h2>
                    <p>Report Generated: ${today}</p>
                </div>
                ${content}
                <div class="footer">
                    <div class="blessing">॥ जय श्री राम ॥</div>
                    <p>श्री राम जन्मभूमि, अयोध्या धाम | 11-21 मई 2026</p>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 500);
                    }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) {
            alert('No data to export!');
            return;
        }

        const headers = Object.keys(data[0]);
        const rows = data.map(item =>
            headers.map(h => {
                let val = item[h] || '';
                if (typeof val === 'string' && val.includes(',')) {
                    val = `"${val}"`;
                }
                return val;
            }).join(',')
        );

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    // ==================== FILTER FUNCTIONS ====================

    const filteredRegistrations = registrations.filter(r => {
        const matchesSearch =
            r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.phone?.includes(searchTerm) ||
            r.member_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.city?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || r.payment_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // ==================== RENDER ====================

    if (loading && activeTab === 'dashboard') {
        return (
            <div className="admin-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', color: '#5D3A1A' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
                    <h2>Loading Dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="sidebar no-print">
                <div className="sidebar-header">
                    <h3>Admin Panel</h3>
                </div>
                <ul className="sidebar-menu">
                    <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        📊 Dashboard
                    </li>
                    <li className={activeTab === 'registrations' ? 'active' : ''} onClick={() => setActiveTab('registrations')}>
                        👥 Registrations
                    </li>
                    <li className={activeTab === 'donations' ? 'active' : ''} onClick={() => setActiveTab('donations')}>
                        💰 Donations
                    </li>
                    <li className={activeTab === 'contacts' ? 'active' : ''} onClick={() => setActiveTab('contacts')}>
                        📩 Contacts ({stats.totalContacts})
                    </li>
                    <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                        ⚙️ Settings
                    </li>
                    <li onClick={handleLogout} className="logout-btn">⏻ Logout</li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="dashboard-header no-print">
                    <h2>
                        {activeTab === 'dashboard' && '📊 Dashboard Overview'}
                        {activeTab === 'registrations' && '👥 Registration Management'}
                        {activeTab === 'donations' && '💰 Donation Management'}
                        {activeTab === 'contacts' && '📩 Contact Requests'}
                        {activeTab === 'settings' && '⚙️ Settings'}
                    </h2>
                    <div className="admin-profile">
                        <span>👤 Admin</span>
                    </div>
                </header>

                {/* ==================== DASHBOARD TAB ==================== */}
                {activeTab === 'dashboard' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card" onClick={() => setActiveTab('registrations')}>
                                <h3>📊 Total Registrations</h3>
                                <p className="stat-value">{stats.totalRegistrations}</p>
                            </div>
                            <div className="stat-card">
                                <h3>💰 Verified Donations</h3>
                                <p className="stat-value">₹ {stats.totalDonations.toLocaleString()}</p>
                            </div>
                            <div className="stat-card" style={{ borderTopColor: '#FF6B00' }}>
                                <h3>⏳ Pending Verifications</h3>
                                <p className="stat-value" style={{ color: '#FF6B00' }}>{stats.pendingPayments}</p>
                            </div>
                            <div className="stat-card">
                                <h3>📅 Today's Registrations</h3>
                                <p className="stat-value">{stats.todayRegistrations}</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button onClick={() => { setActiveTab('registrations'); setStatusFilter('pending'); }}>
                                    ⏳ View Pending ({stats.pendingPayments})
                                </button>
                                <button onClick={() => setActiveTab('contacts')}>
                                    📩 View Contacts ({stats.totalContacts})
                                </button>
                                <button onClick={() => exportToCSV(registrations, 'registrations')}>
                                    📥 Export All Data
                                </button>
                            </div>
                        </div>

                        {/* Recent Registrations */}
                        <div className="recent-section">
                            <h3>Recent Registrations (Last 10)</h3>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Name / Member ID</th>
                                            <th>Mobile</th>
                                            <th>City</th>
                                            <th>Transaction</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrations.slice(0, 10).map((reg) => (
                                            <tr key={reg.id}>
                                                <td>{new Date(reg.created_at).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <strong>{reg.name}</strong>
                                                    <br /><small>{reg.member_id}</small>
                                                </td>
                                                <td>{reg.phone}</td>
                                                <td>{reg.city}</td>
                                                <td>{reg.transaction_id || '-'}</td>
                                                <td><span className={`status-badge ${reg.payment_status}`}>{reg.payment_status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* ==================== REGISTRATIONS TAB ==================== */}
                {activeTab === 'registrations' && (
                    <div className="recent-section">
                        {/* Filters */}
                        <div className="filter-bar no-print">
                            <div className="filter-row">
                                <input
                                    type="text"
                                    placeholder="🔍 Search name, phone, city, member ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="status-select"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="verified">✅ Verified</option>
                                    <option value="rejected">❌ Rejected</option>
                                </select>
                            </div>
                            <div className="action-row">
                                <button className="btn-primary" onClick={() => exportToCSV(filteredRegistrations, 'registrations')}>
                                    📥 Export CSV
                                </button>
                                <button className="btn-primary" onClick={handlePrint}>
                                    🖨️ Print
                                </button>
                                <button className="btn-secondary" onClick={fetchAllData}>
                                    🔄 Refresh
                                </button>
                            </div>
                        </div>

                        <h3>All Registrations ({filteredRegistrations.length})</h3>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name / Member ID</th>
                                        <th>Mobile</th>
                                        <th>City, State</th>
                                        <th>Gotra</th>
                                        <th>Transaction ID</th>
                                        <th>Status</th>
                                        <th className="no-print">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRegistrations.map((reg) => (
                                        <tr key={reg.id}>
                                            <td>{new Date(reg.created_at).toLocaleDateString('en-IN')}</td>
                                            <td>
                                                <strong>{reg.name}</strong>
                                                <br /><small style={{ color: '#888' }}>{reg.member_id}</small>
                                            </td>
                                            <td>
                                                <a href={`tel:${reg.phone}`} style={{ color: '#5D3A1A' }}>{reg.phone}</a>
                                            </td>
                                            <td>{reg.city}, {reg.state}</td>
                                            <td>{reg.gotra || '-'}</td>
                                            <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {reg.transaction_id || '-'}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${reg.payment_status}`}>
                                                    {reg.payment_status}
                                                </span>
                                            </td>
                                            <td className="no-print action-cell">
                                                {reg.payment_status === 'pending' && (
                                                    <>
                                                        <button className="btn-verify" onClick={() => verifyPayment(reg.id)} title="Verify">✓</button>
                                                        <button className="btn-reject" onClick={() => rejectPayment(reg.id)} title="Reject">✕</button>
                                                    </>
                                                )}
                                                <button className="btn-delete" onClick={() => deleteEntry(reg.id)} title="Delete">🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ==================== DONATIONS TAB ==================== */}
                {activeTab === 'donations' && (
                    <div className="recent-section">
                        <div className="filter-bar no-print">
                            <div className="filter-row">
                                <label><strong>📅 Select Date:</strong></label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>
                            <div className="action-row">
                                <button className="btn-primary" onClick={handlePrint}>🖨️ Print Summary</button>
                            </div>
                        </div>

                        <div className="print-header only-print" style={{ display: 'none', textAlign: 'center', marginBottom: '20px' }}>
                            <h2>श्री राम राज्य महायज्ञ - Daily Donation Report</h2>
                            <p>Date: {new Date(selectedDate).toDateString()}</p>
                            <hr />
                        </div>

                        <h3>Donations for {new Date(selectedDate).toDateString()}</h3>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Donor Name</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Transaction ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No donations found for this date.</td></tr>
                                    ) : (
                                        donations.map((d) => (
                                            <tr key={d.id}>
                                                <td>{new Date(d.created_at).toLocaleTimeString('en-IN')}</td>
                                                <td>{d.donor_name}</td>
                                                <td style={{ fontWeight: 'bold', color: '#2E7D32' }}>₹ {d.amount}</td>
                                                <td>{d.payment_method}</td>
                                                <td>{d.transaction_id || '-'}</td>
                                                <td><span className="status-badge verified">{d.status || 'Received'}</span></td>
                                            </tr>
                                        ))
                                    )}
                                    {donations.length > 0 && (
                                        <tr style={{ backgroundColor: '#FFF8E1', fontWeight: 'bold' }}>
                                            <td colSpan="2" style={{ textAlign: 'right' }}>Total:</td>
                                            <td colSpan="4" style={{ fontSize: '1.2rem', color: '#C73E2C' }}>
                                                ₹ {donations.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ==================== CONTACTS TAB ==================== */}
                {activeTab === 'contacts' && (
                    <div className="recent-section">
                        <div className="filter-bar no-print">
                            <div></div>
                            <div className="action-row">
                                <button className="btn-primary" onClick={() => exportToCSV(contacts, 'contacts')}>📥 Export CSV</button>
                                <button className="btn-secondary" onClick={fetchContacts}>🔄 Refresh</button>
                            </div>
                        </div>

                        <h3>Contact Requests ({contacts.length})</h3>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Type</th>
                                        <th>Message</th>
                                        <th className="no-print">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.length === 0 ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No contact requests found.</td></tr>
                                    ) : (
                                        contacts.map((c) => (
                                            <tr key={c.id}>
                                                <td>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                                                <td><strong>{c.name}</strong></td>
                                                <td>{c.email || '-'}</td>
                                                <td>
                                                    <a href={`tel:${c.phone}`} style={{ color: '#5D3A1A' }}>{c.phone}</a>
                                                </td>
                                                <td><span className={`status-badge ${c.type}`}>{c.type}</span></td>
                                                <td style={{ maxWidth: '250px' }}>{c.message}</td>
                                                <td className="no-print">
                                                    <a href={`tel:${c.phone}`} className="btn-call" title="Call">📞</a>
                                                    <button className="btn-delete" onClick={() => deleteEntry(c.id, 'contacts')} title="Delete">🗑️</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ==================== SETTINGS TAB ==================== */}
                {activeTab === 'settings' && (
                    <div className="recent-section">
                        <h3>⚙️ Admin Settings</h3>

                        {/* Success/Error Notification Banner */}
                        {successMessage && (
                            <div style={{
                                padding: '15px 20px',
                                marginBottom: '20px',
                                borderRadius: '10px',
                                background: successMessage.includes('❌') ? '#FFEBEE' : '#E8F5E9',
                                color: successMessage.includes('❌') ? '#C62828' : '#2E7D32',
                                border: `1px solid ${successMessage.includes('❌') ? '#EF9A9A' : '#A5D6A7'}`,
                                fontWeight: '600',
                                textAlign: 'center',
                                animation: 'fadeIn 0.3s ease'
                            }}>
                                {successMessage}
                            </div>
                        )}

                        <div className="settings-grid">
                            {/* UPI ID Setting */}
                            <div className="settings-card">
                                <h4>💳 UPI ID for Donations</h4>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        value={settings.upiId}
                                        onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                                        placeholder="Enter UPI ID"
                                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '2px solid #E8D5C4' }}
                                    />
                                    <button
                                        className="btn-primary"
                                        style={{ width: '100%' }}
                                        disabled={savingSettings}
                                        onClick={() => saveSetting('upi_id', settings.upiId, '✅ UPI ID saved to database!')}
                                    >
                                        {savingSettings ? '⏳ Saving...' : '💾 Save UPI ID'}
                                    </button>
                                </div>
                            </div>

                            {/* Admin Credentials */}
                            <div className="settings-card">
                                <h4>🔐 Admin Credentials</h4>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.85rem', color: '#666' }}>Username</label>
                                    <input
                                        type="text"
                                        value={settings.adminUsername}
                                        onChange={(e) => setSettings({ ...settings, adminUsername: e.target.value })}
                                        placeholder="Admin Username"
                                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '2px solid #E8D5C4' }}
                                    />
                                    <label style={{ fontSize: '0.85rem', color: '#666' }}>Password</label>
                                    <input
                                        type="password"
                                        value={settings.adminPassword}
                                        onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
                                        placeholder="Admin Password"
                                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '2px solid #E8D5C4' }}
                                    />
                                    <button
                                        className="btn-primary"
                                        style={{ width: '100%' }}
                                        disabled={savingSettings}
                                        onClick={async () => {
                                            await saveSetting('admin_username', settings.adminUsername);
                                            await saveSetting('admin_password', settings.adminPassword, '✅ Admin credentials saved! New login: ' + settings.adminUsername);
                                        }}
                                    >
                                        {savingSettings ? '⏳ Saving...' : '💾 Save Credentials'}
                                    </button>
                                </div>
                            </div>

                            {/* Contact Email */}
                            <div className="settings-card">
                                <h4>📧 Contact Email</h4>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        value={settings.contactEmail}
                                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                        placeholder="Contact Email"
                                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '2px solid #E8D5C4' }}
                                    />
                                    <button
                                        className="btn-primary"
                                        style={{ width: '100%' }}
                                        disabled={savingSettings}
                                        onClick={() => saveSetting('contact_email', settings.contactEmail, '✅ Contact email saved to database!')}
                                    >
                                        {savingSettings ? '⏳ Saving...' : '💾 Save Email'}
                                    </button>
                                </div>
                            </div>

                            {/* Database Status */}
                            <div className="settings-card">
                                <h4>🗄️ Database Connected</h4>
                                <p style={{ color: '#2E7D32', fontWeight: '600' }}>✅ Supabase Project Active</p>
                                <p style={{ fontSize: '0.85rem', color: '#666' }}>All settings are saved to cloud database</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
