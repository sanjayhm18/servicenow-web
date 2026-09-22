import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import "./styles.css";

const seedUsers = [
  {
    id: "USR001",
    name: "Vikruth",
    email: "vikruth@company.local",
    employeeId: "123456",
    department: "IT Operations",
    jobTitle: "Employee",
    phone: "+91 90000 12345",
    location: "Bengaluru",
    password: "demo123",
    role: "employee",
    avatar: "V"
  },
  {
    id: "USR002",
    name: "Service Desk Admin",
    email: "admin@company.local",
    employeeId: "100001",
    department: "Service Desk",
    jobTitle: "Service Desk Analyst",
    phone: "+91 90000 10001",
    location: "Bengaluru",
    password: "admin123",
    role: "admin",
    avatar: "A"
  }
];

const categories = {
  Hardware: ["Laptop", "Desktop", "Printer", "Monitor", "Mobile Device"],
  Software: ["Operating System", "Office Application", "Browser", "Business Application"],
  Network: ["VPN", "Wi-Fi", "LAN", "Internet", "Remote Access"],
  Access: ["Password Reset", "Account Lockout", "Application Access", "Shared Drive"],
  Email: ["Mailbox", "Outlook", "Spam", "Distribution List"],
  Other: ["General Query", "Other"]
};

const initialTickets = [
  {
    number: "INC000004",
    type: "Incident",
    employeeName: "Vikruth",
    employeeId: "123456",
    opened: "22/9/2026, 9:51:16 am",
    openedBy: "Vikruth",
    contactType: "Phone",
    state: "New",
    assignmentGroup: "Service Desk",
    assignedTo: "",
    location: "Bengaluru",
    category: "Hardware",
    subcategory: "Laptop",
    configurationItem: "LAP-123456",
    impact: "1 - High",
    urgency: "2 - Medium",
    priority: "2 - High",
    shortDescription: "Laptop is not connecting to the corporate network",
    additionalComments: "Unable to connect to the company network.",
    workNotes: "",
    activity: ["22/9/2026, 9:51:16 am — Vikruth created this incident."],
    createdAt: Date.now() - 1000 * 60 * 40
  },
  {
    number: "REQ000003",
    type: "Request",
    employeeName: "Priya",
    employeeId: "123457",
    opened: "21/9/2026, 3:18:02 pm",
    openedBy: "Priya",
    contactType: "Self-service",
    state: "In Progress",
    assignmentGroup: "Service Desk",
    assignedTo: "Service Desk Admin",
    location: "Chennai",
    category: "Software",
    subcategory: "Office Application",
    configurationItem: "LAP-223344",
    impact: "2 - Medium",
    urgency: "2 - Medium",
    priority: "3 - Moderate",
    shortDescription: "Request installation of approved software",
    additionalComments: "Please install the approved application.",
    workNotes: "Software entitlement verified.",
    activity: [
      "21/9/2026, 3:18:02 pm — Priya created this request.",
      "21/9/2026, 3:42:11 pm — Assigned to Service Desk Admin."
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 25
  },
  {
    number: "INC000002",
    type: "Incident",
    employeeName: "Arun",
    employeeId: "123458",
    opened: "20/9/2026, 11:20:45 am",
    openedBy: "Arun",
    contactType: "Email",
    state: "Resolved",
    assignmentGroup: "Network Support",
    assignedTo: "Network Engineer",
    location: "Hyderabad",
    category: "Network",
    subcategory: "VPN",
    configurationItem: "VPN-GW-01",
    impact: "2 - Medium",
    urgency: "3 - Low",
    priority: "3 - Moderate",
    shortDescription: "VPN connection drops frequently",
    additionalComments: "VPN disconnects after a few minutes.",
    workNotes: "Gateway profile refreshed and client updated.",
    activity: [
      "20/9/2026, 11:20:45 am — Arun created this incident.",
      "20/9/2026, 1:05:13 pm — Network Support started work.",
      "20/9/2026, 4:10:31 pm — Incident resolved."
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 49
  }
];

const navItems = [
  { to: "/", label: "Dashboard", icon: "⌂" },
  { to: "/tickets", label: "All Tickets", icon: "▤" },
  { to: "/tickets/new", label: "Create Ticket", icon: "+" },
  { to: "/my-tickets", label: "My Tickets", icon: "✓" },
  { to: "/knowledge", label: "Knowledge Base", icon: "?" }
];

function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [users, setUsers] = useState(() => load("sdp_users", seedUsers));
  const [tickets, setTickets] = useState(() => load("sdp_tickets", initialTickets));
  const [session, setSession] = useState(() => load("sdp_session", null));

  useEffect(() => localStorage.setItem("sdp_users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("sdp_tickets", JSON.stringify(tickets)), [tickets]);
  useEffect(() => {
    if (session) localStorage.setItem("sdp_session", JSON.stringify(session));
    else localStorage.removeItem("sdp_session");
  }, [session]);

  const logout = () => setSession(null);

  if (!session) {
    return (
      <AuthScreen
        users={users}
        setUsers={setUsers}
        onLogin={setSession}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="*"
        element={
          <AppShell
            user={session}
            users={users}
            tickets={tickets}
            setTickets={setTickets}
            setUsers={setUsers}
            onUserUpdate={setSession}
            onLogout={logout}
          />
        }
      />
    </Routes>
  );
}

function AuthScreen({ users, setUsers, onLogin }) {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  const login = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email").trim().toLowerCase();
    const password = fd.get("password");
    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);
    if (!user) {
      setMessage("Invalid email or password. Try vikruth@company.local / demo123");
      return;
    }
    onLogin(user);
  };

  const signup = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name").trim();
    const email = fd.get("email").trim().toLowerCase();
    const employeeId = fd.get("employeeId").trim();
    const password = fd.get("password");
    if (users.some(u => u.email.toLowerCase() === email || u.employeeId === employeeId)) {
      setMessage("An account with that email or employee ID already exists.");
      return;
    }
    const newUser = {
      id: `USR${String(users.length + 1).padStart(3, "0")}`,
      name,
      email,
      employeeId,
      password,
      department: fd.get("department") || "General",
      jobTitle: fd.get("jobTitle") || "Employee",
      phone: fd.get("phone") || "",
      location: fd.get("location") || "",
      role: "employee",
      avatar: name.charAt(0).toUpperCase()
    };
    setUsers([...users, newUser]);
    onLogin(newUser);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand-mark">SD</div>
        <div>
          <div className="brand-name">ServiceDesk Pro</div>
          <div className="brand-sub">Enterprise IT Service Management</div>
        </div>
        <div className="auth-hero">
          <h1>IT support, simplified.</h1>
          <p>Manage incidents, service requests, employees, assignments and support activity from one clean workspace.</p>
          <div className="feature-pills">
            <span>✓ Ticket lifecycle</span>
            <span>✓ Employee portal</span>
            <span>✓ Local data persistence</span>
          </div>
        </div>
      </div>

      <div className="auth-card-wrap">
        <div className="auth-card">
          <div className="mobile-brand">
            <div className="brand-mark">SD</div>
            <b>ServiceDesk Pro</b>
          </div>
          <div className="auth-tabs">
            <button className={mode === "login" ? "active" : ""} onClick={() => {setMode("login"); setMessage("");}}>Sign in</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => {setMode("signup"); setMessage("");}}>Create account</button>
          </div>

          {mode === "login" ? (
            <form onSubmit={login} className="auth-form">
              <h2>Welcome back</h2>
              <p className="muted">Sign in to your employee service portal.</p>
              <label>Email<input name="email" type="email" required placeholder="you@company.local" /></label>
              <label>Password<input name="password" type="password" required placeholder="••••••••" /></label>
              {message && <div className="error-box">{message}</div>}
              <button className="primary full" type="submit">Sign in</button>
              <div className="demo-box">
                <b>Demo accounts</b>
                <span>Employee: vikruth@company.local / demo123</span>
                <span>Admin: admin@company.local / admin123</span>
              </div>
            </form>
          ) : (
            <form onSubmit={signup} className="auth-form">
              <h2>Create employee account</h2>
              <p className="muted">Register a separate account for your employee profile.</p>
              <div className="form-grid two">
                <label>Full name<input name="name" required placeholder="Vikruth Kumar" /></label>
                <label>Employee ID<input name="employeeId" required placeholder="123456" /></label>
              </div>
              <label>Work email<input name="email" type="email" required placeholder="employee@company.local" /></label>
              <div className="form-grid two">
                <label>Department<input name="department" placeholder="IT Operations" /></label>
                <label>Job title<input name="jobTitle" placeholder="Employee" /></label>
              </div>
              <div className="form-grid two">
                <label>Phone<input name="phone" placeholder="+91..." /></label>
                <label>Location<input name="location" placeholder="Bengaluru" /></label>
              </div>
              <label>Password<input name="password" type="password" minLength="6" required placeholder="Minimum 6 characters" /></label>
              {message && <div className="error-box">{message}</div>}
              <button className="primary full" type="submit">Create account & sign in</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function AppShell({ user, users, tickets, setTickets, setUsers, onUserUpdate, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <div className="top-brand" onClick={() => navigate("/")}>
          <div className="brand-mark small">SD</div>
          <div><b>ServiceDesk Pro</b><small>IT Service Management</small></div>
        </div>
        <div className="top-actions">
          <button className="icon-btn" title="Notifications">🔔<span className="notif-dot"></span></button>
          <button className="avatar-btn" onClick={() => navigate("/profile")}>{user.avatar}</button>
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-user">
          <div className="avatar large">{user.avatar}</div>
          <div><b>{user.name}</b><span>{user.role === "admin" ? "Service Desk Admin" : "Employee"}</span></div>
        </div>
        <div className="nav-section-title">WORKSPACE</div>
        <nav>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={() => setSidebarOpen(false)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-section-title">ACCOUNT</div>
        <nav>
          <NavLink to="/profile" onClick={() => setSidebarOpen(false)}><span className="nav-icon">◉</span>My Profile</NavLink>
          <button className="sidebar-logout" onClick={onLogout}><span className="nav-icon">↪</span>Logout</button>
        </nav>
        <div className="sidebar-footer">
          <div>Frontend-only demo</div>
          <small>Data is stored in this browser.</small>
        </div>
      </aside>

      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard user={user} tickets={tickets} />} />
          <Route path="/tickets" element={<TicketsPage user={user} tickets={tickets} setTickets={setTickets} />} />
          <Route path="/tickets/new" element={<TicketForm user={user} setTickets={setTickets} />} />
          <Route path="/tickets/:number" element={<TicketDetail user={user} tickets={tickets} setTickets={setTickets} />} />
          <Route path="/my-tickets" element={<MyTickets user={user} tickets={tickets} setTickets={setTickets} />} />
          <Route path="/profile" element={<Profile user={user} setUsers={setUsers} users={users} updateSession={onUserUpdate} />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Dashboard({ user, tickets }) {
  const mine = tickets.filter(t => t.employeeId === user.employeeId);
  const visible = user.role === "admin" ? tickets : mine;
  const stats = {
    total: visible.length,
    open: visible.filter(t => !["Resolved", "Closed"].includes(t.state)).length,
    progress: visible.filter(t => t.state === "In Progress").length,
    resolved: visible.filter(t => t.state === "Resolved").length
  };
  const recent = [...visible].sort((a,b) => b.createdAt - a.createdAt).slice(0, 5);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        eyebrow="OVERVIEW"
        title={`Good day, ${user.name}`}
        description="Track support requests, incidents and service activity."
        action={<button className="primary" onClick={() => navigate("/tickets/new")}>＋ Create New Ticket</button>}
      />
      <div className="stat-grid">
        <StatCard label="Total tickets" value={stats.total} icon="▤" tone="blue" />
        <StatCard label="Open tickets" value={stats.open} icon="◔" tone="orange" />
        <StatCard label="In progress" value={stats.progress} icon="↻" tone="purple" />
        <StatCard label="Resolved" value={stats.resolved} icon="✓" tone="green" />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div><h3>Recent tickets</h3><span>Latest activity in your workspace</span></div>
            <button className="text-btn" onClick={() => navigate("/tickets")}>View all →</button>
          </div>
          <TicketTable tickets={recent} compact />
        </section>
        <section className="panel quick-panel">
          <div className="panel-heading"><div><h3>Quick actions</h3><span>Common service desk tasks</span></div></div>
          <button className="quick-action" onClick={() => navigate("/tickets/new")}><span className="quick-icon">＋</span><div><b>Create incident</b><small>Report an IT problem</small></div><span>›</span></button>
          <button className="quick-action" onClick={() => navigate("/tickets/new?type=Request")}><span className="quick-icon">□</span><div><b>Submit request</b><small>Request software or access</small></div><span>›</span></button>
          <button className="quick-action" onClick={() => navigate("/profile")}><span className="quick-icon">◉</span><div><b>Update profile</b><small>Manage employee information</small></div><span>›</span></button>
        </section>
      </div>

      <section className="panel announcement">
        <div className="announcement-icon">i</div>
        <div><b>Service Desk Portal</b><p>Use the ticket form to provide detailed information. Assignment, priority and activity history can be updated from each ticket.</p></div>
      </section>
    </>
  );
}

function StatCard({label,value,icon,tone}) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function TicketsPage({ user, tickets, setTickets }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const visible = user.role === "admin" ? tickets : tickets.filter(t => t.employeeId === user.employeeId);
  const filtered = useMemo(() => {
    let list = visible.filter(t => {
      const hay = `${t.number} ${t.shortDescription} ${t.employeeName} ${t.employeeId} ${t.category} ${t.state}`.toLowerCase();
      return (!query || hay.includes(query.toLowerCase()))
        && (status === "All" || t.state === status)
        && (type === "All" || t.type === type)
        && (category === "All" || t.category === category);
    });
    return [...list].sort((a,b) => sort === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
  }, [visible, query, status, type, category, sort]);

  return (
    <>
      <PageHeader
        eyebrow="TICKETS"
        title={user.role === "admin" ? "All tickets" : "My tickets"}
        description={`${filtered.length} ticket${filtered.length === 1 ? "" : "s"} matching your filters.`}
        action={<NavLink className="primary" to="/tickets/new">＋ Create New Ticket</NavLink>}
      />
      <section className="panel">
        <div className="filter-bar">
          <div className="search-wrap"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search number, description, employee..." /></div>
          <select value={type} onChange={e => setType(e.target.value)}><option>All</option><option>Incident</option><option>Request</option></select>
          <select value={status} onChange={e => setStatus(e.target.value)}><option>All</option><option>New</option><option>In Progress</option><option>On Hold</option><option>Resolved</option><option>Closed</option></select>
          <select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{Object.keys(categories).map(c => <option key={c}>{c}</option>)}</select>
          <select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option></select>
        </div>
        <TicketTable tickets={filtered} />
      </section>
    </>
  );
}

function TicketTable({tickets, compact=false}) {
  const navigate = useNavigate();
  if (!tickets.length) return <div className="empty-state"><div>▤</div><b>No tickets found</b><span>Try changing your filters or create a new ticket.</span></div>;
  return (
    <div className={`table-wrap ${compact ? "compact-table" : ""}`}>
      <table>
        <thead><tr><th>Number</th><th>Type</th><th>Short description</th><th>Employee</th><th>Priority</th><th>State</th><th>Opened</th></tr></thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.number} onClick={() => navigate(`/tickets/${t.number}`)}>
              <td><button className="link-btn">{t.number}</button></td>
              <td><span className={`type-badge ${t.type.toLowerCase()}`}>{t.type}</span></td>
              <td><b className="desc-cell">{t.shortDescription}</b><small>{t.category} / {t.subcategory}</small></td>
              <td>{t.employeeName}<small>{t.employeeId}</small></td>
              <td><Priority value={t.priority} /></td>
              <td><Status value={t.state} /></td>
              <td>{t.opened}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Priority({value}) {
  const cls = value.startsWith("1") ? "p1" : value.startsWith("2") ? "p2" : value.startsWith("3") ? "p3" : "p4";
  return <span className={`priority ${cls}`}>{value}</span>;
}
function Status({value}) { return <span className={`status ${value.toLowerCase().replace(" ","-")}`}><i></i>{value}</span>; }

function TicketForm({ user, setTickets }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [form, setForm] = useState({
    type: params.get("type") === "Request" ? "Request" : "Incident",
    employeeName: user.name,
    employeeId: user.employeeId,
    location: user.location || "",
    category: "Hardware",
    subcategory: "Laptop",
    configurationItem: "",
    impact: "1 - High",
    urgency: "2 - Medium",
    priority: "2 - High",
    shortDescription: "",
    additionalComments: "",
    workNotes: "",
    contactType: "Phone",
    state: "New",
    assignmentGroup: "Service Desk",
    assignedTo: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, value) => setForm(f => ({...f, [key]: value}));

  useEffect(() => {
    const map = {
      "1 - High|1 - High": "1 - Critical",
      "1 - High|2 - Medium": "2 - High",
      "1 - High|3 - Low": "2 - High",
      "2 - Medium|1 - High": "2 - High",
      "2 - Medium|2 - Medium": "3 - Moderate",
      "2 - Medium|3 - Low": "3 - Moderate",
      "3 - Low|1 - High": "3 - Moderate",
      "3 - Low|2 - Medium": "3 - Moderate",
      "3 - Low|3 - Low": "4 - Low"
    };
    const p = map[`${form.impact}|${form.urgency}`] || form.priority;
    setForm(f => ({...f, priority: p}));
  }, [form.impact, form.urgency]);

  const submit = e => {
    e.preventDefault();
    const now = new Date();
    const dateText = now.toLocaleString("en-IN", { hour12: true }).replace(" at ", ", ");
    const existing = load("sdp_tickets", initialTickets);
    const prefix = form.type === "Incident" ? "INC" : "REQ";
    const max = existing
      .filter(t => t.type === form.type)
      .map(t => parseInt(t.number.replace(/\D/g, ""),10) || 0)
      .reduce((a,b)=>Math.max(a,b), 0);
    const number = `${prefix}${String(max + 1).padStart(6, "0")}`;
    const ticket = {
      ...form,
      number,
      opened: dateText,
      openedBy: user.name,
      activity: [`${dateText} — ${user.name} created this ${form.type.toLowerCase()}.`],
      createdAt: Date.now()
    };
    setTickets(prev => [ticket, ...prev]);
    setSubmitted(ticket);
  };

  if (submitted) return (
    <div className="success-page">
      <div className="success-icon">✓</div>
      <h1>{submitted.type} created successfully</h1>
      <p>Your ticket <b>{submitted.number}</b> has been submitted to the Service Desk.</p>
      <div className="success-actions">
        <button className="primary" onClick={() => navigate(`/tickets/${submitted.number}`)}>View ticket</button>
        <button className="secondary" onClick={() => {setSubmitted(false); setForm(f=>({...f,shortDescription:"",additionalComments:"",workNotes:""}));}}>Create another</button>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader eyebrow="TICKET CREATION" title="Create new ticket" description="Complete the fields below to create an incident or service request." />
      <form className="ticket-form" onSubmit={submit}>
        <section className="form-panel">
          <div className="form-section-title"><span>01</span><div><h3>Ticket information</h3><p>Core details based on the provided ServiceNow-style reference.</p></div></div>
          <div className="form-grid two">
            <Field label="Ticket type"><select value={form.type} onChange={e=>set("type",e.target.value)}><option>Incident</option><option>Request</option></select></Field>
            <Field label="Contact type"><select value={form.contactType} onChange={e=>set("contactType",e.target.value)}><option>Phone</option><option>Email</option><option>Self-service</option><option>Walk-in</option></select></Field>
            <Field label="Employee Name" required><input value={form.employeeName} onChange={e=>set("employeeName",e.target.value)} required /></Field>
            <Field label="Employee ID" required><input value={form.employeeId} onChange={e=>set("employeeId",e.target.value)} required /></Field>
            <Field label="Location"><input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="Enter location" /></Field>
            <Field label="Configuration Item"><input value={form.configurationItem} onChange={e=>set("configurationItem",e.target.value)} placeholder="e.g. LAP-123456" /></Field>
            <Field label="Category" required><select value={form.category} onChange={e=>{set("category",e.target.value);set("subcategory",categories[e.target.value][0]);}}>{Object.keys(categories).map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Subcategory"><select value={form.subcategory} onChange={e=>set("subcategory",e.target.value)}>{categories[form.category].map(c=><option key={c}>{c}</option>)}</select></Field>
          </div>
        </section>

        <section className="form-panel">
          <div className="form-section-title"><span>02</span><div><h3>Impact and priority</h3><p>Set impact and urgency. Priority is calculated automatically.</p></div></div>
          <div className="form-grid three">
            <Field label="Impact"><select value={form.impact} onChange={e=>set("impact",e.target.value)}><option>1 - High</option><option>2 - Medium</option><option>3 - Low</option></select></Field>
            <Field label="Urgency"><select value={form.urgency} onChange={e=>set("urgency",e.target.value)}><option>1 - High</option><option>2 - Medium</option><option>3 - Low</option></select></Field>
            <Field label="Priority"><div className="priority-preview"><Priority value={form.priority} /></div></Field>
          </div>
        </section>

        <section className="form-panel">
          <div className="form-section-title"><span>03</span><div><h3>Description</h3><p>Give the support team enough information to investigate the issue.</p></div></div>
          <Field label="Short description" required><input value={form.shortDescription} onChange={e=>set("shortDescription",e.target.value)} placeholder="Describe the incident or request" required /></Field>
          <Field label="Additional comments (Customer visible)"><textarea value={form.additionalComments} onChange={e=>set("additionalComments",e.target.value)} placeholder="Add information that can be seen by the employee..." /></Field>
          <Field label="Work notes"><textarea value={form.workNotes} onChange={e=>set("workNotes",e.target.value)} placeholder="Internal notes for the service desk..." /></Field>
        </section>

        <section className="form-panel">
          <div className="form-section-title"><span>04</span><div><h3>Assignment</h3><p>Choose the initial state and support team.</p></div></div>
          <div className="form-grid three">
            <Field label="State"><select value={form.state} onChange={e=>set("state",e.target.value)}><option>New</option><option>In Progress</option><option>On Hold</option></select></Field>
            <Field label="Assignment group"><select value={form.assignmentGroup} onChange={e=>set("assignmentGroup",e.target.value)}><option>Service Desk</option><option>Network Support</option><option>Desktop Support</option><option>Application Support</option><option>Security</option></select></Field>
            <Field label="Assigned to"><input value={form.assignedTo} onChange={e=>set("assignedTo",e.target.value)} placeholder="Assign employee" /></Field>
          </div>
        </section>

        <div className="form-actions"><button type="button" className="secondary" onClick={()=>navigate(-1)}>Cancel</button><button className="primary" type="submit">Submit {form.type}</button></div>
      </form>
    </>
  );
}

function Field({label, required, children}) {
  return <label className="field"><span>{label}{required && <em> *</em>}</span>{children}</label>;
}

function TicketDetail({ user, tickets, setTickets }) {
  const { number } = useParams();
  const navigate = useNavigate();
  const ticket = tickets.find(t => t.number === number);
  const [note, setNote] = useState("");

  if (!ticket) return <div className="empty-state big"><div>?</div><b>Ticket not found</b><button className="primary" onClick={()=>navigate("/tickets")}>Back to tickets</button></div>;

  const update = (key, value) => {
    setTickets(prev => prev.map(t => t.number === number ? {
      ...t,
      [key]: value,
      activity: [...t.activity, `${new Date().toLocaleString("en-IN")} — ${user.name} updated ${key.replace(/([A-Z])/g," $1").toLowerCase()}.`]
    } : t));
  };

  const addNote = () => {
    if (!note.trim()) return;
    setTickets(prev => prev.map(t => t.number === number ? {
      ...t,
      workNotes: t.workNotes ? `${t.workNotes}\n${note}` : note,
      activity: [...t.activity, `${new Date().toLocaleString("en-IN")} — ${user.name}: ${note}`]
    } : t));
    setNote("");
  };

  return (
    <>
      <div className="breadcrumb"><button onClick={()=>navigate(-1)}>← Back</button><span>/</span><span>{ticket.number}</span></div>
      <div className="detail-title">
        <div><div className="eyebrow">{ticket.type.toUpperCase()}</div><h1>{ticket.number}</h1><p>{ticket.shortDescription}</p></div>
        <div className="detail-actions"><Status value={ticket.state}/><button className="secondary" onClick={()=>window.print()}>Print</button></div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="panel">
            <div className="panel-heading"><div><h3>Ticket details</h3><span>Service desk record</span></div></div>
            <div className="detail-grid">
              <Detail label="Number" value={ticket.number}/><Detail label="Type" value={ticket.type}/>
              <Detail label="Employee Name" value={ticket.employeeName}/><Detail label="Employee ID" value={ticket.employeeId}/>
              <Detail label="Opened" value={ticket.opened}/><Detail label="Opened By" value={ticket.openedBy}/>
              <Detail label="Contact Type" value={ticket.contactType}/><Detail label="Location" value={ticket.location || "—"}/>
              <Detail label="Category" value={ticket.category}/><Detail label="Subcategory" value={ticket.subcategory}/>
              <Detail label="Configuration Item" value={ticket.configurationItem || "—"}/><Detail label="Assignment Group" value={ticket.assignmentGroup}/>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading"><div><h3>Description & notes</h3><span>Customer and internal information</span></div></div>
            <div className="note-block"><b>Short description</b><p>{ticket.shortDescription}</p></div>
            <div className="note-block"><b>Additional comments (Customer visible)</b><p>{ticket.additionalComments || "No additional comments."}</p></div>
            <div className="note-block"><b>Work notes</b><p className="preline">{ticket.workNotes || "No work notes."}</p></div>
            <div className="add-note"><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add an internal work note..." /><button className="secondary" onClick={addNote}>Add work note</button></div>
          </section>

          <section className="panel">
            <div className="panel-heading"><div><h3>Activity</h3><span>Audit trail for this ticket</span></div></div>
            <div className="activity-list">{ticket.activity.map((a,i)=><div className="activity-item" key={i}><span className="activity-dot"></span><p>{a}</p></div>)}</div>
          </section>
        </div>

        <aside className="detail-side">
          <section className="panel">
            <div className="panel-heading"><div><h3>Classification</h3><span>Priority matrix</span></div></div>
            <Field label="Impact"><select value={ticket.impact} onChange={e=>update("impact",e.target.value)}><option>1 - High</option><option>2 - Medium</option><option>3 - Low</option></select></Field>
            <Field label="Urgency"><select value={ticket.urgency} onChange={e=>update("urgency",e.target.value)}><option>1 - High</option><option>2 - Medium</option><option>3 - Low</option></select></Field>
            <div className="side-value"><span>Priority</span><Priority value={ticket.priority}/></div>
          </section>
          <section className="panel">
            <div className="panel-heading"><div><h3>Assignment</h3><span>Current ownership</span></div></div>
            <Field label="State"><select value={ticket.state} onChange={e=>update("state",e.target.value)}><option>New</option><option>In Progress</option><option>On Hold</option><option>Resolved</option><option>Closed</option></select></Field>
            <Field label="Assignment group"><select value={ticket.assignmentGroup} onChange={e=>update("assignmentGroup",e.target.value)}><option>Service Desk</option><option>Network Support</option><option>Desktop Support</option><option>Application Support</option><option>Security</option></select></Field>
            <Field label="Assigned to"><input value={ticket.assignedTo} onChange={e=>update("assignedTo",e.target.value)} placeholder="Assign employee"/></Field>
          </section>
        </aside>
      </div>
    </>
  );
}
function Detail({label,value}) { return <div className="detail-item"><span>{label}</span><b>{value}</b></div>; }

function MyTickets({user,tickets,setTickets}) {
  return <TicketsPage user={user} tickets={tickets} setTickets={setTickets}/>;
}

function Profile({user,users,setUsers,updateSession}) {
  const [form,setForm] = useState({...user});
  const [saved,setSaved] = useState(false);
  const save = e => {
    e.preventDefault();
    const cleaned = {...form};
    setUsers(users.map(u => u.id === user.id ? cleaned : u));
    onUserUpdate(cleaned);
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };
  return (
    <>
      <PageHeader eyebrow="ACCOUNT" title="My profile" description="Manage your employee account information." />
      <form className="profile-grid" onSubmit={save}>
        <section className="panel profile-card">
          <div className="profile-hero"><div className="avatar xlarge">{form.avatar}</div><div><h2>{form.name}</h2><p>{form.jobTitle} · {form.department}</p><span className="status in-progress"><i></i>{form.role === "admin" ? "Administrator" : "Active employee"}</span></div></div>
          <div className="form-grid two">
            <Field label="Full name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
            <Field label="Employee ID"><input value={form.employeeId} onChange={e=>setForm({...form,employeeId:e.target.value})}/></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
            <Field label="Phone"><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></Field>
            <Field label="Department"><input value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></Field>
            <Field label="Job title"><input value={form.jobTitle} onChange={e=>setForm({...form,jobTitle:e.target.value})}/></Field>
            <Field label="Location"><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></Field>
          </div>
          <div className="form-actions"><span className={saved ? "saved" : "save-placeholder"}>{saved ? "✓ Profile saved" : ""}</span><button className="primary">Save changes</button></div>
        </section>
        <section className="panel account-summary">
          <h3>Account details</h3>
          <div className="summary-row"><span>Account ID</span><b>{form.id}</b></div>
          <div className="summary-row"><span>Role</span><b>{form.role}</b></div>
          <div className="summary-row"><span>Portal</span><b>ServiceDesk Pro</b></div>
          <div className="summary-row"><span>Storage</span><b>Browser localStorage</b></div>
          <div className="security-box"><b>Frontend demo</b><p>This project has no backend authentication. Account data and tickets are stored locally in the browser.</p></div>
        </section>
      </form>
    </>
  );
}

function KnowledgeBase() {
  const articles = [
    ["How to reset a password", "Access & Identity", "Reset your corporate password and unlock an account."],
    ["VPN troubleshooting", "Network", "Steps for checking VPN client, network connectivity and credentials."],
    ["Laptop setup guide", "Hardware", "Basic setup checklist for a new or replacement laptop."],
    ["Software request policy", "Software", "How approved software requests are submitted and reviewed."],
    ["Email troubleshooting", "Email", "Common Outlook and mailbox troubleshooting steps."]
  ];
  return (
    <>
      <PageHeader eyebrow="SELF SERVICE" title="Knowledge base" description="Quick answers for common IT questions." />
      <div className="knowledge-grid">{articles.map(([title,cat,text])=><article className="knowledge-card" key={title}><span>{cat}</span><h3>{title}</h3><p>{text}</p><button className="text-btn">Read article →</button></article>)}</div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
