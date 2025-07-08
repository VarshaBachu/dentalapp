// ENTNT Technical Assignment – Dental Center Management App (Bug-Free Build)

// 1. context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const defaultUsers = [
  { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" },
];

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem("user");
    return session ? JSON.parse(session) : null;
  });

  const login = (email, password) => {
    const match = defaultUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (match) {
      setUser(match);
      localStorage.setItem("user", JSON.stringify(match));
      return { success: true, role: match.role };
    }
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };

// 2. pages/AdminDashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const mockPatients = [
  {
    id: "p1",
    name: "John Doe",
    dob: "1990-05-10",
    contact: "1234567890",
    healthInfo: "No allergies",
  },
];

const AdminDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">DOB</th>
              <th className="py-2 px-4 border">Contact</th>
              <th className="py-2 px-4 border">Health Info</th>
            </tr>
          </thead>
          <tbody>
            {mockPatients.map((p) => (
              <tr key={p.id}>
                <td className="border px-4 py-2">{p.name}</td>
                <td className="border px-4 py-2">{p.dob}</td>
                <td className="border px-4 py-2">{p.contact}</td>
                <td className="border px-4 py-2">{p.healthInfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;

// 3. pages/PatientDashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  const patient = {
    id: "p1",
    name: "John Doe",
    dob: "1990-05-10",
    contact: "1234567890",
    healthInfo: "No allergies",
    upcoming: "2025-07-10",
    lastVisit: "2025-06-15",
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hello, {patient.name}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <section className="mt-8 space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p>Email: {user?.email}</p>
          <p>DOB: {patient.dob}</p>
          <p>Contact: {patient.contact}</p>
          <p>Health Info: {patient.healthInfo}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Appointments</h2>
          <p>Next Visit: {patient.upcoming}</p>
          <p>Last Visit: {patient.lastVisit}</p>
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;

// 4. components/AppointmentForm.jsx
import React, { useState } from "react";

const AppointmentForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ date: "", reason: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="datetime-local"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />
      <textarea
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Reason for visit"
        className="border p-2 rounded w-full"
        required
      ></textarea>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Book Appointment
      </button>
    </form>
  );
};

export default AppointmentForm;
