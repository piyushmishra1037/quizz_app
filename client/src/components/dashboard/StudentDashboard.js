import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const StudentDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('/api/quizzes');
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleQuizClick = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user.name}</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <div className="dashboard-content">
                <h2>Available Quizzes</h2>
                <div className="quizzes-grid">
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="quiz-card" onClick={() => handleQuizClick(quiz._id)}>
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>
                            <p>Duration: {quiz.duration} minutes</p>
                            <p>Questions: {quiz.questions.length}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
