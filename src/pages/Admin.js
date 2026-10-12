import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2'; // Import Pie chart component
import { useAdminAuth } from '../AdminAuthContext';
import { getAllComplaints, updateComplaintStatus as saveComplaintStatus } from '../api';

Chart.register(ArcElement, Tooltip, Legend);

const styles = {
    mainContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    container: {
        width: '65%', // Increased width of the complaints container
        margin: '20px',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    chartContainer: {
        width: '30%', // Adjusted width for better alignment
        height: '350px', // Increased height to fit the chart
        margin: '20px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px', // Added padding for better spacing
        boxSizing: 'border-box',
    },
    complaintItem: {
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    buttonContainer: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        margin: '0 10px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '4px',
    },
    acceptButton: {
        backgroundColor: 'green',
        color: '#fff',
    },
    rejectButton: {
        backgroundColor: 'red',
        color: '#fff',
    },
    acknowledgement: {
        marginTop: '10px',
        textAlign: 'center',
    },
    complaintType: {
        fontWeight: 'bold',
        marginBottom: '10px',
    },
};

function Admin() {
    const [complaints, setComplaints] = useState([]);
    const [statusCounts, setStatusCounts] = useState({ pending: 0, in_progress: 0, resolved: 0 });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState([]);
    const { credentials } = useAdminAuth();

    useEffect(() => {
        const counts = { pending: 0, in_progress: 0, resolved: 0 };
        complaints.forEach((complaint) => {
            if (complaint.status === 'pending') counts.pending++;
            else if (complaint.status === 'in_progress') counts.in_progress++;
            else if (complaint.status === 'resolved') counts.resolved++;
        });
        setStatusCounts(counts);
    }, [complaints]);

    useEffect(() => {
        let active = true;
        const loadComplaints = async (showLoading = false) => {
            if (showLoading) setIsLoading(true);
            try {
                const { data } = await getAllComplaints(credentials);
                if (active) {
                    setComplaints(data);
                    setError('');
                }
            } catch {
                if (active) setError('Unable to load complaints. Please sign in again.');
            } finally {
                if (active && showLoading) setIsLoading(false);
            }
        };

        loadComplaints(true);
        const refreshInterval = window.setInterval(() => loadComplaints(), 30000);

        return () => {
            active = false;
            window.clearInterval(refreshInterval);
        };
    }, [credentials]);

    const updateComplaintStatus = async (id, status) => {
        setError('');
        setUpdatingIds((current) => [...current, id]);
        try {
            const { data: updatedComplaint } = await saveComplaintStatus(id, status, credentials);
            setComplaints((current) => current.map((complaint) => complaint.id === id ? updatedComplaint : complaint));
        } catch {
            setError('Unable to update this complaint. Please try again.');
        } finally {
            setUpdatingIds((current) => current.filter((updatingId) => updatingId !== id));
        }
    };

    const data = {
        labels: ['Pending', 'In Progress', 'Resolved'],
        datasets: [
            {
                data: [statusCounts.pending, statusCounts.in_progress, statusCounts.resolved],
                backgroundColor: ['#ffc107', '#007bff', '#28a745'],
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.container}>
                <h2>Complaint Dashboard</h2>
                {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
                {isLoading ? <p role="status">Loading complaints...</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    {['Complaint ID', 'Name', 'Location', 'Complaint Type', 'Description', 'Date', 'Status'].map((heading) => (
                                        <th key={heading} scope="col" style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((complaint) => (
                                    <tr key={complaint.id}>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{complaint.id}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{complaint.name}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{[complaint.address, complaint.zone].filter(Boolean).join(', ')}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{complaint.complaintType}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{complaint.description || 'Not provided'}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : 'N/A'}
                                        </td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                            <select
                                                aria-label={`Status for complaint ${complaint.id}`}
                                                value={complaint.status || 'pending'}
                                                onChange={(event) => updateComplaintStatus(complaint.id, event.target.value)}
                                                disabled={updatingIds.includes(complaint.id)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {!complaints.length && (
                                    <tr><td colSpan="7" style={{ padding: '10px' }}>No complaints have been submitted.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div style={styles.chartContainer}>
                <h3>Complaints Status Overview</h3>
                <Pie data={data} options={options} width={300} height={300} />
            </div>
        </div>
    );
}

export default Admin;