import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/api';
import Loader from '../../components/Loader';
import './Profile.css';

const Profile = () => {
  const { user, loading: authLoading, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setEditedUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditedUser(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setEditedUser(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!editedUser.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!editedUser.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!editedUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editedUser.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (editedUser.phone && !/^[\d\s+\-()]+$/.test(editedUser.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedData = {
        ...user,
        ...editedUser,
        address: editedUser.address
      };

      const response = await updateUserProfile(user.id, updatedData);
      updateUser(response);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      }
    });
    setErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-initials">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          </div>
          <div className="profile-header-info">
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="profile-role">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
            <p className="profile-member-since">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="profile-content">
          {/* Personal Information Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="profile-grid">
              <div className="profile-field">
                <label>First Name</label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      value={editedUser.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                ) : (
                  <p>{user.firstName}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Last Name</label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={editedUser.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                ) : (
                  <p>{user.lastName}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Email</label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                ) : (
                  <p>{user.email}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Phone</label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                ) : (
                  <p>{user.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Address</h2>
            </div>

            <div className="profile-grid">
              <div className="profile-field full-width">
                <label>Street Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address.street"
                    value={editedUser.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                  />
                ) : (
                  <p>{user.address?.street || 'Not provided'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address.city"
                    value={editedUser.address.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                  />
                ) : (
                  <p>{user.address?.city || 'Not provided'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>State/Province</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address.state"
                    value={editedUser.address.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                  />
                ) : (
                  <p>{user.address?.state || 'Not provided'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Zip Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address.zipCode"
                    value={editedUser.address.zipCode}
                    onChange={handleInputChange}
                    placeholder="Enter zip code"
                  />
                ) : (
                  <p>{user.address?.zipCode || 'Not provided'}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address.country"
                    value={editedUser.address.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                  />
                ) : (
                  <p>{user.address?.country || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="profile-actions">
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
