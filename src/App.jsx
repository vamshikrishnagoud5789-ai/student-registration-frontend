
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/students";

function App() {
  const emptyForm = {
    name: "",
    rollNumber: "",
    email: "",
    department: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // READ - Fetch students from backend
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to load students");
      const data = await response.json();
      setStudents(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE and UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        editId !== null ? `${API_URL}/${editId}` : API_URL,
        {
          method: editId !== null ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      if (!response.ok) throw new Error("Failed to save student");

      setForm(emptyForm);
      setEditId(null);
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  // UPDATE - Load selected student into form
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      department: student.department
    });
    setEditId(student.id);
  };

  // DELETE - Remove student from backend
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete student");

      await fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Student Registration System</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="rollNumber"
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId !== null ? "Update Student" : "Register Student"}
        </button>
      </form>

      <h2>Registered Students</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.rollNumber}</td>
              <td>{student.email}</td>
              <td>{student.department}</td>
              <td>
                <button onClick={() => handleEdit(student)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;


