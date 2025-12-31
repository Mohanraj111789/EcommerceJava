import "./ViewUser.css";
import { useState, useEffect } from 'react';
export default function ViewUser() {
    //get users data from backend and display in table format
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
    };

    const viewUserDetails = async(userId) => {
        //fetch user details from backend
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSelectedUser(data);
    };

    return (
        //create a table format to view users table columns: ID, Name, Email, Role
        <div>
            {/*back button to admin dashboard */}
            <button className="back-button" onClick={() => window.history.back()}>Back to Dashboard</button>
            <h2>User Management</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Users data will be populated here */}
                    {users.map((user1) => (
                        <tr key={user1.id}>
                            <td>{user1.id}</td>
                            <td>{user1.name}</td>
                            <td>{user1.email}</td>
                            <td>{user1.role}</td>
                            <td><button onClick={() => viewUserDetails(user1.id)}>View Details</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedUser ? (
                <div className="user-details">
                    <h3>User Details</h3>
                    <p>ID: {selectedUser.id}</p>
                    <p>Name: {selectedUser.name}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>Role: {selectedUser.role}</p>
                </div>
            ): null}
        </div>
    );
}