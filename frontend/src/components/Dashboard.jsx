import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const initialForm = {
  title: "",
  description: "",
  category: "Academic",
  status: "Pending",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [grievances, setGrievances] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [searchTitle, setSearchTitle] = useState("");
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGrievances = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/grievances");
      setGrievances(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch grievances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/grievances/${editingId}`, formData);
      } else {
        await api.post("/grievances", formData);
      }
      resetForm();
      await fetchGrievances();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save grievance");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status,
    });
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/grievances/${id}`);
      await fetchGrievances();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete grievance");
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (!searchTitle.trim()) {
        await fetchGrievances();
        return;
      }
      const response = await api.get(`/grievances/search?title=${encodeURIComponent(searchTitle)}`);
      setGrievances(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="page">
      <div className="layout">
        <header className="topbar card">
          <div>
            <h1>Student Grievance Dashboard</h1>
            <p className="hint">Welcome {currentUser?.name || "User"}</p>
          </div>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="card">
          <h2>{editingId ? "Update Grievance" : "Submit Grievance"}</h2>
          <form onSubmit={handleSubmit} className="form grid">
            <label className="label">
              Title
              <input
                className="input"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>
            <label className="label">
              Category
              <select className="input" name="category" value={formData.category} onChange={handleChange}>
                <option>Academic</option>
                <option>Hostel</option>
                <option>Transport</option>
                <option>Other</option>
              </select>
            </label>
            <label className="label span-2">
              Description
              <textarea
                className="input"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>
            <label className="label">
              Status
              <select className="input" name="status" value={formData.status} onChange={handleChange}>
                <option>Pending</option>
                <option>Resolved</option>
              </select>
            </label>
            <div className="actions">
              <button className="btn btn-primary" type="submit">
                {editingId ? "Update" : "Submit"}
              </button>
              {editingId ? (
                <button className="btn" type="button" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="card">
          <h2>My Grievances</h2>
          <form className="search-row" onSubmit={handleSearch}>
            <input
              className="input"
              placeholder="Search by title"
              value={searchTitle}
              onChange={(event) => setSearchTitle(event.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setSearchTitle("");
                fetchGrievances();
              }}
            >
              Reset
            </button>
          </form>

          {error ? <p className="error">{error}</p> : null}
          {loading ? <p className="hint">Loading grievances...</p> : null}

          <div className="list">
            {grievances.map((item) => (
              <article key={item._id} className="grievance-item">
                <div className="grievance-head">
                  <h3>{item.title}</h3>
                  <span className={`badge ${item.status === "Resolved" ? "resolved" : "pending"}`}>
                    {item.status}
                  </span>
                </div>
                <p>{item.description}</p>
                <p className="meta">
                  Category: {item.category} | Date: {new Date(item.date).toLocaleDateString()}
                </p>
                <div className="actions">
                  <button className="btn btn-primary" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
