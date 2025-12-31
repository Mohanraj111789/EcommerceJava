import "./ViewUser.css";
export default function ViewUser() {
    //get users data from backend and display in table format
    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" }
    ];


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
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}