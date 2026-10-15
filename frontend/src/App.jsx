
import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

const API = "http://localhost:8080/api/tokens";

function App() {
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [service, setService] = useState("Bank Service");
  const [tokens, setTokens] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTokens() {
    try {
      const response = await fetch(API);
      if (!response.ok) {
        setMessage("Failed to load tokens.");
        return;
      }
      const data = await response.json();
      setTokens(data);
    } catch (error) {
      setMessage("Backend connection failed. Check Spring Boot.");
    }
  }

  useEffect(() => {
    async function fetchTokens() {
      await loadTokens();
    }

    void fetchTokens();
  }, []);
  function handleAdminLogin(e) {
    e.preventDefault();

    if (
        adminUsername === "admin" &&
        adminPassword === "admin123"
    ) {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError("");
      setAdminUsername("");
      setAdminPassword("");
    } else {
      setLoginError("Invalid username or password.");
    }
  }
  async function bookToken(e) {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: name,
          serviceName: service
        })
      });

      if (!response.ok) {
        setMessage("Booking failed. Please try again.");
        return;
      }

      const data = await response.json();
      setMessage("Your token #" + data.id + " is booked!");
      setName("");
      await loadTokens();
    } catch (error) {
      setMessage("Booking failed. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  async function completeToken(id) {
    try {
      const response = await fetch(API + "/" + id + "/complete", {
        method: "PUT"
      });

      if (!response.ok) {
        setMessage("Could not update token.");
        return;
      }

      setMessage("Token #" + id + " completed!");
      await loadTokens();
    } catch (error) {
      setMessage("Could not update token.");
    }
  }

  const waiting = tokens.filter(
      (token) => token.status === "WAITING"
  );

  const completed = tokens.filter(
      (token) => token.status === "COMPLETED"
  );
  const waitingTokens = [...tokens]
      .filter((token) => token.status === "WAITING")
      .sort((a, b) => a.id - b.id);
  return (
      <>
        {isAdmin ? (
            <div>
              <button
                  onClick={() => setIsAdmin(false)}
                  style={{ margin: "15px" }}
              >
                Back to Customer Page
              </button>

              <AdminDashboard />
            </div>
        ) : showLogin ? (
            <div className="login-page">
              <div className="login-card">
                <h1>QUEULESS</h1>
                <p>Admin Login</p>

                <form onSubmit={handleAdminLogin}>
                  <input
                      type="text"
                      placeholder="Enter username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                  />

                  <input
                      type="password"
                      placeholder="Enter password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                  />

                  {loginError && <p>{loginError}</p>}

                  <button type="submit">Login</button>
                </form>

                <button onClick={() => setShowLogin(false)}>
                  Back to Home
                </button>
              </div>
            </div>
        ) : (
            <div className="app">

              <nav className="premium-nav">
                <div className="premium-logo">
                  <div className="brand-mark">Q</div>
                  <span>QUEU<span>LESS</span></span>
                </div>

                <div className="nav-label">
                  SMART QUEUE MANAGEMENT
                </div>

                <button onClick={() => setShowLogin(true)}>
                  Admin Login
                </button>
              </nav>

              <header className="premium-hero">
                <p className="hero-tag">✦ SMARTER WAITING, BETTER LIVING</p>

                <h1>
                  Your Time Matters.
                  <br />
                  <span>Waiting Doesn't.</span>
                </h1>

                <p className="premium-description">
                  Book your token digitally, track your queue
                  and enjoy a smarter waiting experience.
                </p>

                <button
                    className="hero-button"
                    onClick={() =>
                        document.getElementById("booking")?.scrollIntoView({
                          behavior: "smooth"
                        })
                    }
                >
                  Get Your Token →
                </button>

                <div className="hero-steps">
                  <div><strong>01</strong><p>Book Token</p></div>
                  <div><strong>02</strong><p>Track Queue</p></div>
                  <div><strong>03</strong><p>Get Served</p></div>
                </div>
              </header>


              <main className="container">
          <section id="booking" className="booking card">
            <h2>Book Your Token</h2>
            <p className="muted">
              Enter your details to join the queue.
            </p>

            <form onSubmit={bookToken}>
              <label>Customer Name</label>
              <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />

              <label>Select Service</label>
              <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
              >
                <option>Bank Service</option>
                <option>Hospital Appointment</option>
                <option>College Office</option>
                <option>Customer Support</option>
                <option>Other Service</option>
              </select>

              <button type="submit" disabled={loading}>
                {loading ? "Booking..." : "Book My Token"}
              </button>
            </form>

            {message && <p className="message">{message}</p>}
          </section>

          <section className="stats">
            <div className="stat card">
              <span>Total Tokens</span>
              <strong>{tokens.length}</strong>
            </div>

            <div className="stat card">
              <span>Waiting</span>
              <strong>{waiting.length}</strong>
            </div>

            <div className="stat card">
              <span>Completed</span>
              <strong>{completed.length}</strong>
            </div>
          </section>

          <section className="queue card">
            <div className="queue-heading">
              <div>
                <h2>Queue Dashboard</h2>
                <p className="muted">Manage customer tokens</p>
              </div>

              <button
                  className="refresh"
                  type="button"
                  onClick={loadTokens}
              >
                Refresh
              </button>
            </div>

            {tokens.length === 0 ? (
                <p className="empty">
                  No tokens booked yet. Be the first!
                </p>
            ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                    <tr>
                      <th>Token</th>
                      <th>Queue Position</th>
                      <th>Customer Name</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {tokens.map((token) => (
                        <tr key={token.id}>
                          <td>#{token.id}</td>
                          <td>
                            {token.status === "WAITING"
                                ? waitingTokens.findIndex((t) => t.id === token.id) + 1
                                : "-"}
                          </td>
                          <td>{token.customerName}</td>
                          <td>{token.serviceName}</td>
                          <td>
                        <span className={"status " + token.status.toLowerCase()}>
                          {token.status}
                        </span>
                          </td>
                          <td>
                            {token.status !== "COMPLETED" ? (
                                <button
                                    className="complete"
                                    type="button"
                                    onClick={() => completeToken(token.id)}
                                >
                                  Complete
                                </button>
                            ) : (
                                "Done"
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </section>

          <footer>
            <p>© 2026 Queueless | Smart Queue Management System</p>
            <p>Designed to make waiting easier.</p>
          </footer>
        </main>
      </div>
        )}
      </>
  );

}

export default App;
