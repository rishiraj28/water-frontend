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
    const [acknowledgements, setAcknowledgements] = useState({});
    const [statusCounts, setStatusCounts] = useState({ accepted: 0, rejected: 0, pending: 0 });
    const [error, setError] = useState('');
    const { credentials } = useAdminAuth();

    useEffect(() => {
        let active = true;
        getAllComplaints(credentials)
            .then(({ data }) => {
                if (active) {
                    setComplaints(data);
                    updateStatusCounts(data);
                }
            })
            .catch(() => {
                if (active) setError('Unable to load complaints. Please sign in again.');
            });

        return () => {
            active = false;
        };
    }, [credentials]);

    const handleAccept = (id) => {
        updateComplaintStatus(id, 'accepted');
    };

    const handleReject = (id) => {
        updateComplaintStatus(id, 'rejected');
    };

    const updateComplaintStatus = async (id, status) => {
        setError('');
        try {
            const { data: updatedComplaint } = await saveComplaintStatus(id, status, credentials);
            const updatedComplaints = complaints.map((complaint) =>
                complaint.id === id ? updatedComplaint : complaint
            );
            setComplaints(updatedComplaints);
            updateStatusCounts(updatedComplaints);
            setAcknowledgements((previous) => ({
                ...previous,
                [id]: `Complaint with ID ${id} ${status}`,
            }));
        } catch {
            setError('Unable to update this complaint. Please try again.');
        }
    };

    const updateStatusCounts = (complaints) => {
        const counts = { accepted: 0, rejected: 0, pending: 0 };
        complaints.forEach((complaint) => {
            if (complaint.status === 'accepted') counts.accepted++;
            else if (complaint.status === 'rejected') counts.rejected++;
            else counts.pending++;
        });
        setStatusCounts(counts);
    };

    const data = {
        labels: ['Accepted', 'Rejected', 'Pending'],
        datasets: [
            {
                data: [statusCounts.accepted, statusCounts.rejected, statusCounts.pending],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
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
                {complaints.map((complaint) => (
                    <div key={complaint.id} style={styles.complaintItem}>
                        <p style={styles.complaintType}>{complaint.complaintType}</p>
                        <p>Name: {complaint.name}</p>
                        <p>Address: {complaint.address}</p>
                        <p>Zone: {complaint.zone}</p>
                        <p>Phone Number: {complaint.phoneNumber}</p>
                        <p>Email Address: {complaint.emailAddress}</p>
                        <div style={styles.buttonContainer}>
                            <button
                                style={{ ...styles.button, ...styles.acceptButton }}
                                onClick={() => handleAccept(complaint.id)}
                            >
                                Accept
                            </button>
                            <button
                                style={{ ...styles.button, ...styles.rejectButton }}
                                onClick={() => handleReject(complaint.id)}
                            >
                                Reject
                            </button>
                        </div>
                        {acknowledgements[complaint.id] && (
                            <p style={styles.acknowledgement}>
                                {acknowledgements[complaint.id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
            <div style={styles.chartContainer}>
                <h3>Complaints Status Overview</h3>
                <Pie data={data} options={options} width={300} height={300} />
            </div>
        </div>
    );
}

export default Admin;