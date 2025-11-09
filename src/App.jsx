import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setStatus("Please fill all fields");
      return;
    }
    if (!validateEmail(formData.email)) {
      setStatus("Please enter a valid email");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const res = await fetch("https://vernanbackend.ezlab.in/api/contact-us/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setStatus("Feedback Submitted ");
      } else {
        setStatus("Submission failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <header className="topbar">
        <div className="brand">Atlas Fitness</div>
      </header>

      <main className="container">
        <section className="contact-section">
          <div className="contact-card">
            <h1 className="main-title">Feedback Form</h1>
            <p className="muted">
              We’d love to hear your thoughts! Please fill in the form below.
            </p>

            <form onSubmit={handleSubmit} className="form">
              <div className="field">
                <input name="name" value={formData.name} onChange={handleChange} required />
                <label>Name</label>
              </div>

              <div className="field">
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                <label>Email</label>
              </div>

              <div className="field">
                <input name="phone" value={formData.phone} onChange={handleChange} required />
                <label>Phone</label>
              </div>

              <div className="field full">
                <textarea name="message" rows="4" value={formData.message} onChange={handleChange} required />
                <label>Message</label>
              </div>

              <div className="actions">
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Submit Feedback"}
                </button>
                <div className="status">{status}</div>
              </div>
            </form>
          </div>
        </section>
      </main>

      {submitted && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="overlay-card">
            <h3>Thank You!</h3>
            <p>Your feedback has been received.</p>
            <button className="btn" onClick={() => setSubmitted(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
