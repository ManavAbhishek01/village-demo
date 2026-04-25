import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API = "http://localhost:3000/v1";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed", "#db2777"];

const requestData = [
  { day: "Mon", requests: 4200 }, { day: "Tue", requests: 3800 },
  { day: "Wed", requests: 5100 }, { day: "Thu", requests: 4700 },
  { day: "Fri", requests: 6200 }, { day: "Sat", requests: 3100 },
  { day: "Sun", requests: 2800 }
];

const planData = [
  { name: "Free", value: 450 }, { name: "Premium", value: 230 },
  { name: "Pro", value: 120 }, { name: "Unlimited", value: 45 }
];

const responseTimeData = [
  { time: "00:00", p95: 45 }, { time: "04:00", p95: 32 },
  { time: "08:00", p95: 78 }, { time: "12:00", p95: 95 },
  { time: "16:00", p95: 88 }, { time: "20:00", p95: 62 },
  { time: "23:59", p95: 41 }
];

const stateData = [
  { state: "Maharashtra", villages: 44198 },
  { state: "UP", villages: 97814 },
  { state: "Rajasthan", villages: 44794 },
  { state: "MP", villages: 55393 },
  { state: "Karnataka", villages: 29736 },
];

const users = [
  { id: 1, name: "TechCorp India", email: "api@techcorp.in", plan: "Pro", status: "Active", requests: 245000 },
  { id: 2, name: "LogiTrack", email: "dev@logitrack.com", plan: "Premium", status: "Active", requests: 42000 },
  { id: 3, name: "AddressIQ", email: "tech@addressiq.io", plan: "Free", status: "Pending", requests: 1200 },
  { id: 4, name: "DeliverNow", email: "api@delivernow.in", plan: "Unlimited", status: "Active", requests: 890000 },
  { id: 5, name: "FormBuilder", email: "dev@formbuilder.com", plan: "Free", status: "Suspended", requests: 5000 },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);

  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "users", label: "👥 Users" },
    { id: "logs", label: "📋 API Logs" },
    { id: "villages", label: "🗺️ Village Data" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>🌍 VillageAPI</div>
        <div style={styles.adminBadge}>Admin Panel</div>
        {tabs.map(tab => (
          <div key={tab.id}
            style={{ ...styles.navItem, ...(activeTab === tab.id ? styles.navActive : {}) }}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </div>
        ))}
        <div style={styles.navDivider} />
        <div style={styles.navItem} onClick={() => window.open("http://localhost:5174", "_blank")}>
          🔗 Demo Form
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div style={styles.headerRight}>
            <span style={styles.badge}>● Live</span>
            <span style={{ color: "#6b7280" }}>Admin</span>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            {/* Metric Cards */}
            <div style={styles.grid4}>
              {[
                { label: "Total Villages", value: "4,62,944", change: "+0%", color: "#2563eb" },
                { label: "Active Users", value: "845", change: "+12%", color: "#16a34a" },
                { label: "Today's Requests", value: "1,24,500", change: "+8%", color: "#7c3aed" },
                { label: "Avg Response Time", value: "47ms", change: "-5%", color: "#d97706" },
              ].map((card, i) => (
                <div key={i} style={styles.metricCard}>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>{card.label}</div>
                  <div style={{ fontSize: 28, fontWeight: "bold", color: card.color, margin: "8px 0" }}>{card.value}</div>
                  <div style={{ fontSize: 12, color: card.change.startsWith("+") ? "#16a34a" : "#dc2626" }}>{card.change} from yesterday</div>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div style={styles.grid2}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>API Requests (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={requestData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Users by Plan</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={planData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {planData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div style={styles.grid2}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Top States by Villages</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="state" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="villages" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Response Time Trends (p95)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="p95" stroke="#7c3aed" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div style={styles.chartCard}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <input style={styles.searchInput} placeholder="🔍 Search by name or email..." />
              <select style={styles.select}>
                <option>All Plans</option>
                <option>Free</option>
                <option>Premium</option>
                <option>Pro</option>
                <option>Unlimited</option>
              </select>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  {["Business", "Email", "Plan", "Status", "Requests", "Actions"].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.td}><b>{user.name}</b></td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.planBadge, background: user.plan === "Pro" ? "#ede9fe" : user.plan === "Unlimited" ? "#fef3c7" : "#f0fdf4", color: user.plan === "Pro" ? "#7c3aed" : user.plan === "Unlimited" ? "#d97706" : "#16a34a" }}>
                        {user.plan}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: user.status === "Active" ? "#f0fdf4" : user.status === "Pending" ? "#fef3c7" : "#fef2f2", color: user.status === "Active" ? "#16a34a" : user.status === "Pending" ? "#d97706" : "#dc2626" }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={styles.td}>{user.requests.toLocaleString()}</td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn} onClick={() => setSelectedUser(user)}>View</button>
                      <button style={{ ...styles.actionBtn, background: "#fef2f2", color: "#dc2626" }}>Suspend</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* API Logs Tab */}
        {activeTab === "logs" && (
          <div style={styles.chartCard}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <select style={styles.select}><option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option></select>
              <select style={styles.select}><option>All Status</option><option>2xx</option><option>4xx</option><option>5xx</option></select>
              <select style={styles.select}><option>All Endpoints</option><option>/autocomplete</option><option>/states</option><option>/search</option></select>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  {["Timestamp", "API Key", "Endpoint", "Response Time", "Status"].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { time: "21:45:12", key: "ak_****abcd", endpoint: "/autocomplete", ms: 42, status: 200 },
                  { time: "21:45:09", key: "ak_****ef12", endpoint: "/states", ms: 18, status: 200 },
                  { time: "21:45:05", key: "ak_****abcd", endpoint: "/search", ms: 87, status: 200 },
                  { time: "21:44:58", key: "ak_****xyz9", endpoint: "/autocomplete", ms: 156, status: 429 },
                  { time: "21:44:51", key: "ak_****mn34", endpoint: "/states/27/districts", ms: 23, status: 200 },
                  { time: "21:44:43", key: "ak_****op56", endpoint: "/autocomplete", ms: 0, status: 401 },
                ].map((log, i) => (
                  <tr key={i} style={styles.tableRow}>
                    <td style={styles.td}>{log.time}</td>
                    <td style={styles.td}><code>{log.key}</code></td>
                    <td style={styles.td}><code>{log.endpoint}</code></td>
                    <td style={styles.td}>{log.ms}ms</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: log.status === 200 ? "#f0fdf4" : log.status === 429 ? "#fef3c7" : "#fef2f2", color: log.status === 200 ? "#16a34a" : log.status === 429 ? "#d97706" : "#dc2626" }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Villages Tab */}
        {activeTab === "villages" && <VillagesBrowser />}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div style={styles.modal} onClick={() => setSelectedUser(null)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>👤 {selectedUser.name}</h3>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Plan:</b> {selectedUser.plan}</p>
            <p><b>Status:</b> {selectedUser.status}</p>
            <p><b>Total Requests:</b> {selectedUser.requests.toLocaleString()}</p>
            <p><b>API Key:</b> <code>ak_****{Math.random().toString(36).substr(2, 4)}</code></p>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button style={{ ...styles.actionBtn, padding: "8px 16px", background: "#f0fdf4", color: "#16a34a" }}>✅ Approve</button>
              <button style={{ ...styles.actionBtn, padding: "8px 16px", background: "#fef2f2", color: "#dc2626" }}>🚫 Suspend</button>
              <button style={{ ...styles.actionBtn, padding: "8px 16px" }} onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VillagesBrowser() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [search, setSearch] = useState("");

  useState(() => {
    fetch(`${API}/states`).then(r => r.json()).then(d => setStates(d.data));
  }, []);

  return (
    <div style={styles.chartCard}>
      <h3 style={{ marginTop: 0 }}>Village Master Data Browser</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <select style={styles.select} onChange={e => {
          setSelectedState(e.target.value);
          fetch(`${API}/states/${e.target.value}/districts`).then(r => r.json()).then(d => setDistricts(d.data));
        }}>
          <option value="">State chuno</option>
          {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
        <select style={styles.select} onChange={e => {
          fetch(`${API}/subdistricts/${e.target.value}/villages`).then(r => r.json()).then(d => setVillages(d.data));
        }} disabled={!districts.length}>
          <option value="">District chuno</option>
          {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
        </select>
        <input style={styles.searchInput} placeholder="🔍 Village search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 8 }}>
        {villages.length > 0 ? `${villages.length} villages found` : "State aur District select karo"}
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              {["Code", "Village Name"].map(h => <th key={h} style={styles.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {villages.filter(v => v.name.toLowerCase().includes(search.toLowerCase())).slice(0, 100).map((v, i) => (
              <tr key={i} style={styles.tableRow}>
                <td style={styles.td}>{v.code}</td>
                <td style={styles.td}>{v.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif", background: "#f8fafc" },
  sidebar: { width: 220, background: "#1e293b", color: "white", padding: "20px 0", flexShrink: 0 },
  logo: { fontSize: 20, fontWeight: "bold", padding: "0 20px 4px", color: "white" },
  adminBadge: { fontSize: 11, color: "#94a3b8", padding: "0 20px 20px", borderBottom: "1px solid #334155", marginBottom: 8 },
  navItem: { padding: "10px 20px", cursor: "pointer", color: "#94a3b8", fontSize: 14, transition: "all 0.2s" },
  navActive: { background: "#2563eb", color: "white", borderRight: "3px solid #60a5fa" },
  navDivider: { borderTop: "1px solid #334155", margin: "8px 0" },
  main: { flex: 1, padding: 24, overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" },
  headerTitle: { margin: 0, color: "#1e293b", fontSize: 22 },
  headerRight: { display: "flex", gap: 16, alignItems: "center" },
  badge: { color: "#16a34a", fontWeight: "bold", fontSize: 13 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 20 },
  metricCard: { background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  chartCard: { background: "white", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 },
  chartTitle: { margin: "0 0 16px", color: "#374151", fontSize: 15 },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { background: "#f8fafc" },
  tableRow: { borderBottom: "1px solid #f1f5f9" },
  th: { padding: "10px 12px", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600 },
  td: { padding: "10px 12px", fontSize: 13, color: "#374151" },
  searchInput: { padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, flex: 1 },
  select: { padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13 },
  planBadge: { padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  statusBadge: { padding: "2px 8px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  actionBtn: { padding: "4px 10px", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, background: "#f1f5f9", color: "#374151", marginRight: 4 },
  modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalCard: { background: "white", borderRadius: 16, padding: 32, minWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
};