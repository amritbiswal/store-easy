import React from 'react';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> johndoe@example.com</p>
        <p><strong>Joined:</strong> January 1, 2023</p>
      </div>
      <button className="edit-profile-button">Edit Profile</button>
    </div>
  );
};

export default Profile;