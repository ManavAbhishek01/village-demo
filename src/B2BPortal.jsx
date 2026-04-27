import { useState } from "react";

const API = "https://village-api-theta.vercel.app";

export default function B2BPortal() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyData, setNewKeyData] = useState(null);

  const [registerForm, setRegisterForm] = useState({
    email: "", businessName: "", phone: "", password: "", confirmPassword: ""
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Register
  const handleRegister = async () => {
    setError(""); setSuccess("");
    if (registerForm.password !== registerForm.confirmPassword) {
      return setError("Passwords match nahi kar rahe!");
    }
    if (registerForm.password.length < 8) {
      return setError("Password minimum 8 characters ka hona chahiye!");
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerForm.email,
          businessName: registerForm.businessName,
          phone: registerForm.phone,
          password: registerForm.password
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Registration successful! Admin approval ka wait karo.");
        setPage("login");
      } else {
        setError(data.message || "Registration failed!");
      }
    } catch (err) {
      setError("Server error!");
    }
    setLoading(false);
  };

  // Login
  const handleLogin = async () => {
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        setPage("dashboard");
        fetchApiKeys(data.data.token);
      } else {
        setError(data.message || "Login failed!");
      }
    } catch (err) {
      setError("Server error!");
    }
    setLoading(false);
  };

  // Fetch API Keys
  const fetchApiKeys = async (t) => {
    try {
      const res = await fetch(`${API}/auth/keys`, {
        headers: { "Authorization": `Bearer ${t || token}` }
      });
      const data = await res.json();
      if (data.success) setApiKeys(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Generate API Key
  const generateKey = async () => {
    if (!newKeyName) return setError("Key name daalo!");
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/auth/keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newKeyName })
      });
      const data = await res.json();
      if (data.success) {
        setNewKeyData(data.data);
        setNewKeyName("");
        fetchApiKeys(token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error generating key!");
    }
    setLoading(false);
  };

  // Revoke Key
  const revokeKey = async (id) => {
    try {
      await fetch(`${API}/auth/keys/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchApiKeys(token);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setToken(null); setUser(null); setPage("login");
    setApiKeys([]); setNewKeyData(null);
  };

  // Login Page
  if (page === "login") return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 B2B Portal Login</h2>
        <p style={styles.subtitle}>All India Villages API</p>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        <input style={styles.input} placeholder="Business Email" type="email"
          value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} />
        <input style={styles.input} placeholder="Password" type="password"
          value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} />
        <button style={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login →"}
        </button>
        <p style={{ textAlign: "center", marginTop: 16, color: "#6b7280" }}>
          Account nahi hai?{" "}
          <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => { setPage("register"); setError(""); }}>
            Register karo
          </span>
        </p>
      </div>
    </div>
  );

  // Register Page
  if (page === "register") return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 B2B Registration</h2>
        <p style={styles.subtitle}>All India Villages API</p>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
        <input style={styles.input} placeholder="Business Email *" type="email"
          value={registerForm.email} onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))} />
        <input style={styles.input} placeholder="Business Name *"
          value={registerForm.businessName} onChange={e => setRegisterForm(f => ({ ...f, businessName: e.target.value }))} />
        <input style={styles.input} placeholder="Phone Number"
          value={registerForm.phone} onChange={e => setRegisterForm(f => ({ ...f, phone: e.target.value }))} />
        <input style={styles.input} placeholder="Password (min 8 chars) *" type="password"
          value={registerForm.password} onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))} />
        <input style={styles.input} placeholder="Confirm Password *" type="password"
          value={registerForm.confirmPassword} onChange={e => setRegisterForm(f => ({ ...f, confirmPassword: e.target.value }))} />
        <button style={styles.btn} onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register →"}
        </button>
        <p style={{ textAlign: "center", marginTop: 16, color: "#6b7280" }}>
          Already registered?{" "}
          <span style={{ color: "#2563eb", cursor: "pointer" }} onClick={() => { setPage("login"); setError(""); }}>
            Login karo
          </span>
        </p>
      </div>
    </div>
  );

  // Dashboard Page
  return (
    <div style={styles.dashPage}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>🌍 VillageAPI</div>
        <div style={styles.userInfo}>
          <div style={{ fontWeight: "bold", color: "white" }}>{user?.businessName}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{user?.email}</div>
          <div style={styles.planBadge}>{user?.planType}</div>
        </div>
        <div style={styles.navDivider} />
        <div style={{ ...styles.navItem, ...styles.navActive }}>🔑 API Keys</div>
        <div style={styles.navDivider} />
        <div style={styles.navItem} onClick={logout}>🚪 Logout</div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <h2 style={styles.headerTitle}>🔑 API Key Management</h2>

        {/* Usage Cards */}
        <div style={styles.grid3}>
          {[
            { label: "Plan Type", value: user?.planType, color: "#2563eb" },
            { label: "Daily Limit", value: user?.planType === "FREE" ? "5,000" : user?.planType === "PREMIUM" ? "50,000" : "300,000+", color: "#16a34a" },
            { label: "Active Keys", value: apiKeys.filter(k => k.status === "ACTIVE").length, color: "#7c3aed" },
          ].map((card, i) => (
            <div key={i} style={styles.metricCard}>
              <div style={{ color: "#6b7280", fontSize: 13 }}>{card.label}</div>
              <div style={{ fontSize: 24, fontWeight: "bold", color: card.color, margin: "8px 0" }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Generate New Key */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>➕ New API Key Generate Karo</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...styles.input, flex: 1, marginBottom: 0 }}
              placeholder="Key name (e.g. Production Server)"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)} />
            <button style={{ ...styles.btn, width: "auto", padding: "10px 20px" }}
              onClick={generateKey} disabled={loading}>
              {loading ? "..." : "Generate"}
            </button>
          </div>
          {error && <div style={{ ...styles.error, marginTop: 8 }}>{error}</div>}
        </div>

        {/* New Key Display */}
        {newKeyData && (
          <div style={styles.keyReveal}>
            <h4 style={{ margin: "0 0 12px", color: "#92400e" }}>⚠️ Secret sirf ek baar dikhega — abhi copy karo!</h4>
            <div style={styles.keyRow}>
              <span style={styles.keyLabel}>API Key:</span>
              <code style={styles.keyCode}>{newKeyData.key}</code>
              <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(newKeyData.key)}>Copy</button>
            </div>
            <div style={styles.keyRow}>
              <span style={styles.keyLabel}>Secret:</span>
              <code style={styles.keyCode}>{newKeyData.secret}</code>
              <button style={styles.copyBtn} onClick={() => navigator.clipboard.writeText(newKeyData.secret)}>Copy</button>
            </div>
            <button style={{ ...styles.btn, marginTop: 12, background: "#92400e" }}
              onClick={() => setNewKeyData(null)}>
              ✅ Copy kar liya — Close
            </button>
          </div>
        )}

        {/* API Keys Table */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🗝️ Teri API Keys</h3>
          {apiKeys.length === 0 ? (
            <p style={{ color: "#6b7280" }}>Koi API key nahi hai — upar se generate karo!</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  {["Name", "API Key", "Status", "Last Used", "Action"].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiKeys.map(key => (
                  <tr key={key.id} style={styles.tableRow}>
                    <td style={styles.td}><b>{key.name}</b></td>
                    <td style={styles.td}><code>{key.key.substring(0, 8)}****{key.key.slice(-4)}</code></td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: key.status === "ACTIVE" ? "#f0fdf4" : "#fef2f2", color: key.status === "ACTIVE" ? "#16a34a" : "#dc2626" }}>
                        {key.status}
                      </span>
                    </td>
                    <td style={styles.td}>{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "Never"}</td>
                    <td style={styles.td}>
                      {key.status === "ACTIVE" && (
                        <button style={{ ...styles.copyBtn, background: "#fef2f2", color: "#dc2626" }}
                          onClick={() => revokeKey(key.id)}>
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* API Documentation */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📚 Quick Start Guide</h3>
          <div style={styles.docsBox}>
            <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>Base URL:</p>
            <code style={styles.codeBlock}>https://village-api-theta.vercel.app/v1</code>
            <p style={{ margin: "12px 0 8px", fontWeight: "bold" }}>Authentication:</p>
            <code style={styles.codeBlock}>Header: X-API-Key: your_api_key</code>
            <p style={{ margin: "12px 0 8px", fontWeight: "bold" }}>Example Request:</p>
            <code style={styles.codeBlock}>GET /v1/autocomplete?q=Mumbai</code>
            <p style={{ margin: "12px 0 8px", fontWeight: "bold" }}>Available Endpoints:</p>
            <code style={styles.codeBlock}>
              GET /v1/states{"\n"}
              GET /v1/states/:code/districts{"\n"}
              GET /v1/districts/:code/subdistricts{"\n"}
              GET /v1/subdistricts/:code/villages{"\n"}
              GET /v1/autocomplete?q=xxx{"\n"}
              GET /v1/search?q=xxx
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #eff6ff, #f0fdf4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "sans-serif" },
  dashPage: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif", background: "#f8fafc" },
  card: { background: "white", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#1e40af", margin: "0 0 4px" },
  subtitle: { textAlign: "center", color: "#6b7280", marginBottom: 24 },
  input: { width: "100%", padding: "10px 12px", marginBottom: 8, border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" },
  btn: { width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: "pointer" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 12px", borderRadius: 8, marginBottom: 12, fontSize: 14 },
  successBox: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "10px 12px", borderRadius: 8, marginBottom: 12, fontSize: 14 },
  sidebar: { width: 220, background: "#1e293b", color: "white", padding: "20px 0", flexShrink: 0 },
  logo: { fontSize: 18, fontWeight: "bold", padding: "0 20px 8px", color: "white" },
  userInfo: { padding: "12px 20px", background: "#0f172a", margin: "0 0 8px" },
  planBadge: { display: "inline-block", background: "#2563eb", color: "white", padding: "2px 8px", borderRadius: 20, fontSize: 11, marginTop: 4 },
  navItem: { padding: "10px 20px", cursor: "pointer", color: "#94a3b8", fontSize: 14 },
  navActive: { background: "#2563eb", color: "white" },
  navDivider: { borderTop: "1px solid #334155", margin: "8px 0" },
  main: { flex: 1, padding: 24, overflowY: "auto" },
  headerTitle: { margin: "0 0 20px", color: "#1e293b", fontSize: 22 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 },
  metricCard: { background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  section: { background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 },
  sectionTitle: { margin: "0 0 16px", color: "#374151", fontSize: 15, borderBottom: "2px solid #e5e7eb", paddingBottom: 8 },
  keyReveal: { background: "#fffbeb", border: "2px solid #f59e0b", borderRadius: 12, padding: 20, marginBottom: 20 },
  keyRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  keyLabel: { color: "#6b7280", fontSize: 13, width: 60, flexShrink: 0 },
  keyCode: { background: "#f1f5f9", padding: "4px 8px", borderRadius: 4, fontSize: 12, flex: 1, wordBreak: "break-all" },
  copyBtn: { padding: "4px 10px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "#e0e7ff", color: "#3730a3" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { background: "#f8fafc" },
  tableRow: { borderBottom: "1px solid #f1f5f9" },
  th: { padding: "10px 12px", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600 },
  td: { padding: "10px 12px", fontSize: 13, color: "#374151" },
  statusBadge: { padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  docsBox: { background: "#f8fafc", borderRadius: 8, padding: 16 },
  codeBlock: { display: "block", background: "#1e293b", color: "#e2e8f0", padding: "10px 14px", borderRadius: 6, fontSize: 12, whiteSpace: "pre", marginBottom: 4 },
};