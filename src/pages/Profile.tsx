import { useNavigate } from "react-router-dom";
import "./Profile.css"; // We'll create this CSS file next

const Profile = () => {
  const navigate = useNavigate(); // Allows navigation

  // Simulated logout function (later this will use authentication state)
  const handleLogout = () => {
    alert("Logged out! Redirecting to home...");
    navigate("/"); // Redirect to home after logout
  };

  return (
    <div className="profile-container">
      <h2>Welcome, User!</h2>
      <p>This is your profile page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;