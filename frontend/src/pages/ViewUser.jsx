import "./ViewUser.css";
export default function ViewUser() {
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
                </tbody>
            </table>
        </div>
    );
}