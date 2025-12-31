import "./ViewUser.css";
import { useState, useEffect } from 'react';
export default function ViewUser() {
    //get users data from backend and display in table format
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);
    const BASEURL = "http://localhost:8080/api/admin/";

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASEURL}users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
    };

    const viewUserDetails = async(userId) => {
        //fetch user details from backend
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASEURL}users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSelectedUser(data);
    };
    const deleteUser = async(userId) => {
            if (!window.confirm('Are you sure you want to delete this product?')) {
                return;
        }
        try{
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASEURL}users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if(res.ok){
                alert('User deleted successfully');
                setSelectedUser(null);
                fetchUsers();
            }else{
                alert('Failed to delete user');
            }
        }catch(error){

            console.error('Error deleting user:', error);
        }
    };
    const promoteUser = async(userId) => {
        try{
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASEURL}users/${userId}/promote`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if(res.ok){
                alert('User promoted to admin successfully');
                setSelectedUser(null);
                fetchUsers();
            }else{
                alert('Failed to promote user');
            }
        }catch(error){
            console.error('Error promoting user:', error);
        }
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
            {selectedUser && (
                <div className="user-details-modal-overlay">
                    <div className="user-details-modal">
                        <button className="close-btn" onClick={() => setSelectedUser(null)}>✕</button>
                        <div className="user-details">
                            <div className="user-avatar"></div>
                            <div className="user-info">
                                <h2>User Details</h2>
                                <p><strong>ID:</strong> {selectedUser.id}</p>
                                <p><strong>NAME:</strong> {selectedUser.name}</p>
                                <p><strong>EMAIL:</strong> {selectedUser.email}</p>
                                <p><strong>ROLE:</strong> {selectedUser.role}</p>
                            </div>
                        </div>
                        <div className="user-actions">
                            <button className="btn-delete" onClick={() => deleteUser(selectedUser.id)}>DELETE USER</button>
                            {selectedUser.role !== 'ADMIN' ? (
                                <button className="btn-promote" onClick={()=> promoteUser(selectedUser.id)}>PROMOTE AS ADMIN</button>
                            ):(
                                <button className="btn-promote" onClick={()=> demoteUser(selectedUser.id)}>DEMOTE AS USER</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}