import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './Profile.css';
import { FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Loader from '../../shared/Loader/Loader';

const ProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    sessionsPerWeek: '',
    fitnessGoal: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    height: '',
    weight: '',
    sessionsPerWeek: '',
    fitnessGoal: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    return new Date().getFullYear() - birthDate.getFullYear();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching profile data for ID:', id);
        
        const response = await Axios.get(`http://localhost:3001/api/account/${id}`);
        console.log('Profile response:', response.data);
        
        if (response.data.status === 'success' && response.data.data) {
          const userData = response.data.data;
          setData({
            name: userData.username || '',
            age: userData.dob ? calculateAge(userData.dob) : '',
            gender: userData.sexe || '',
            height: userData.height || '',
            weight: userData.weight || '',
            sessionsPerWeek: userData.numberOfSession || '',
            fitnessGoal: userData.objectif || ''
          });
          setEditedData({
            height: userData.height || '',
            weight: userData.weight || '',
            sessionsPerWeek: userData.numberOfSession || '',
            fitnessGoal: userData.objectif || ''
          });
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          console.error('No response received from server');
        } else {
          console.error('Error setting up request:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting update for ID:', id);
      console.log('Update data:', editedData);

      const response = await Axios.post(`http://localhost:3001/api/account/update/${id}`, {
        height: parseInt(editedData.height) || 0,
        weight: parseInt(editedData.weight) || 0,
        numberOfSession: parseInt(editedData.sessionsPerWeek) || 0,
        objectif: editedData.fitnessGoal
      });

      console.log('Update response:', response.data);

      if (response.data.status === 'success') {
        const userData = response.data.data;
        // Update local state
        setData({
          name: userData.username || '',
          age: userData.dob ? calculateAge(userData.dob) : '',
          gender: userData.sexe || '',
          height: userData.height || '',
          weight: userData.weight || '',
          sessionsPerWeek: userData.numberOfSession || '',
          fitnessGoal: userData.objectif || ''
        });

        setEditedData({
          height: userData.height || '',
          weight: userData.weight || '',
          sessionsPerWeek: userData.numberOfSession || '',
          fitnessGoal: userData.objectif || ''
        });

        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
      }
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className='profile'>
      <div className='profileHeader'>
        <div className='accSec'>
          <div className='name_dis'>
            <h1 className='fname'>{data.name}</h1>
          </div>
          <div className='dataBoxes'>
            <div className='personal-info'>
              <div className='section-header'>
                <h2>Personal Information</h2>
              </div>
              <div className='info-grid'>
                <div className='info-item'>
                  <span className='label'>Name:</span>
                  <span className='value'>{data.name}</span>
                </div>
                <div className='info-item'>
                  <span className='label'>Age:</span>
                  <span className='value'>{data.age} years</span>
                </div>
                <div className='info-item'>
                  <span className='label'>Gender:</span>
                  <span className='value'>{data.gender}</span>
                </div>
              </div>
            </div>
            <div className='physical-info'>
              <div className='section-header'>
                <h2>Physical Information</h2>
                {!isEditing && <FaEdit className='edit-icon' onClick={handleEdit} />}
              </div>
              <div className='info-grid'>
                {isEditing ? (
                  <>
                    <div className='info-item'>
                      <span className='label'>Height:</span>
                      <input
                        type="number"
                        name="height"
                        value={editedData.height}
                        onChange={handleChange}
                        className='edit-input'
                      />
                    </div>
                    <div className='info-item'>
                      <span className='label'>Weight:</span>
                      <input
                        type="number"
                        name="weight"
                        value={editedData.weight}
                        onChange={handleChange}
                        className='edit-input'
                      />
                    </div>
                    <div className='info-item'>
                      <span className='label'>Sessions per Week:</span>
                      <input
                        type="number"
                        name="sessionsPerWeek"
                        value={editedData.sessionsPerWeek}
                        onChange={handleChange}
                        className='edit-input'
                      />
                    </div>
                    <div className='info-item'>
                      <span className='label'>Fitness Goal:</span>
                      <select
                        name="fitnessGoal"
                        value={editedData.fitnessGoal}
                        onChange={handleChange}
                        className='edit-input'
                      >
                        <option value="Strength Training">Strength Training</option>
                        <option value="Cardio Training">Cardio Training</option>
                        <option value="Fat Burning">Fat Burning</option>
                        <option value="Health Fitness">Health Fitness</option>
                      </select>
                    </div>
                    <button className='submit-button' onClick={handleSubmit}>
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <div className='info-item'>
                      <span className='label'>Height:</span>
                      <span className='value'>{data.height} cm</span>
                    </div>
                    <div className='info-item'>
                      <span className='label'>Weight:</span>
                      <span className='value'>{data.weight} kg</span>
                    </div>
                    <div className='info-item'>
                      <span className='label'>Sessions per Week:</span>
                      <span className='value'>{data.sessionsPerWeek}</span>
                    </div>
                    <div className='info-item'>
                      <span className='label'>Fitness Goal:</span>
                      <span className='value'>{data.fitnessGoal}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;