
import { useEffect, useState } from "react";

const API = "http://localhost:8080/api/tokens";

function AdminDashboard() {
    const [tokens, setTokens] = useState([]);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    async function loadTokens() {
        try {
            const response = await fetch(API);

            if (!response.ok) {
                setMessage("Failed to load tokens.");
                return;
            }

            const data = await response.json();
            setTokens(data);
            setMessage("");
        } catch (error) {
            setMessage("Cannot connect to backend. Check Spring Boot.");
        }
    }

    useEffect(() => {
        async function fetchTokens() {
            await loadTokens();
        }

        void fetchTokens();
    }, []);

    async function completeToken(id) {
        try {
            const response = await fetch(API + "/" + id + "/complete", {
                method: "PUT"
            });

            if (!response.ok) {
                setMessage("Could not update token.");
                return;
            }




            setMessage("Token #" + id + " completed successfully!");
            await loadTokens();
        } catch (error) {
            setMessage("Could not complete token.");
        }
    }

    async function deleteToken(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this token?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(API + "/" + id, {
                method: "DELETE"
            });

            if (!response.ok) {
                setMessage("Could not delete token.");
                return;
            }

            setMessage("Token #" + id + " deleted successfully!");
            await loadTokens();

        } catch (error) {
            setMessage("Could not delete token.");
        }
    }
    const waiting = tokens.filter(
        (token) => token.status === "WAITING"
    );

    const completed = tokens.filter(
        (token) => token.status === "COMPLETED"
    );
    const nextCustomer = [...waiting].sort(
        (a, b) => a.id - b.id
    )[0];

    const filteredTokens = tokens.filter((token) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            token.customerName.toLowerCase().includes(search) ||
            String(token.id).includes(search);

        const matchesStatus =
            statusFilter === "ALL" || token.status === statusFilter;

        return matchesSearch && matchesStatus;
    });


    return (
        <div className="admin-page">

            <header className="admin-header">
                <div>
                    <h1>Queueless Admin</h1>
                    <p className="admin-subtitle">
                        ✦ SMART QUEUE • ADMIN CONTROL CENTER
                    </p>
                </div>

                <button onClick={loadTokens}>
                    Refresh Queue
                </button>
            </header>

            <h2>Dashboard Overview</h2>
            <div className="next-customer-panel">

                <div className="next-customer-top">
                    <div>
                        <p className="next-label">CURRENTLY SERVING NEXT</p>
                        <h2>Next Customer</h2>
                    </div>

                    <span className="waiting-badge">WAITING</span>
                </div>

                {nextCustomer ? (
                    <div className="next-customer-details">

                        <h1>#{nextCustomer.id}</h1>

                        <h3>{nextCustomer.customerName}</h3>

                        <p>{nextCustomer.serviceName}</p>

                    </div>
                ) : (
                    <p>No customers waiting.</p>
                )}

            </div>
            <div className="admin-stats">

                <div className="admin-card">
                    <p>Total Tokens</p>
                    <h1>{tokens.length}</h1>
                </div>

                <div className="admin-card">
                    <p>Waiting Customers</p>
                    <h1>{waiting.length}</h1>
                </div>

                <div className="admin-card">
                    <p>Completed Tokens</p>
                    <h1>{completed.length}</h1>
                </div>

            </div>

            {message && <p className="message">{message}</p>}

            <section className="admin-table">
                <h2>Customer Queue</h2>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Customers</option>
                    <option value="WAITING">Waiting</option>
                    <option value="COMPLETED">Completed</option>
                </select>

                <input
                    type="text"
                    placeholder="Search by customer name or token ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                {tokens.length === 0 ? (
                    <p>No customer tokens available.</p>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                            <tr>
                                <th>Token ID</th>
                                <th>Customer Name</th>
                                <th>Service</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredTokens.map((token) => (
                                <tr key={token.id}>
                                    <td>#{token.id}</td>
                                    <td>{token.customerName}</td>
                                    <td>{token.serviceName}</td>
                                    <td>{token.status}</td>
                                    <td>
                                        {token.status === "WAITING" && (
                                            <button onClick={() => completeToken(token.id)}>
                                                Complete
                                            </button>
                                        )}

                                        <button onClick={() => deleteToken(token.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
}

export default AdminDashboard;


