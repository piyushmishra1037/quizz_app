import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const InstructorDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        description: '',
        duration: 30,
        questions: []
    });
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('/api/quizzes/my-quizzes');
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAddQuestion = () => {
        setNewQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]
        }));
    };

    const handleQuizSubmit = async () => {
        try {
            await axios.post('/api/quizzes/create', newQuiz);
            setNewQuiz({
                title: '',
                description: '',
                duration: 30,
                questions: []
            });
            fetchQuizzes();
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    const handleQuizDelete = async (quizId) => {
        try {
            await axios.delete(`/api/quizzes/${quizId}`);
            fetchQuizzes();
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleViewResults = (quizId) => {
        navigate(`/quiz/${quizId}/results`);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user.name}</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <div className="dashboard-content">
                <div className="instructor-actions">
                    <h2>Create New Quiz</h2>
                    <div className="quiz-form">
                        <input
                            type="text"
                            placeholder="Quiz Title"
                            value={newQuiz.title}
                            onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                        />
                        <textarea
                            placeholder="Description"
                            value={newQuiz.description}
                            onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <input
                            type="number"
                            placeholder="Duration (minutes)"
                            value={newQuiz.duration}
                            onChange={(e) => setNewQuiz(prev => ({ ...prev, duration: e.target.value }))}
                        />
                        {newQuiz.questions.map((question, index) => (
                            <div key={index} className="question-form">
                                <input
                                    type="text"
                                    placeholder={`Question ${index + 1}`}
                                    value={question.question}
                                    onChange={(e) => {
                                        const questions = [...newQuiz.questions];
                                        questions[index].question = e.target.value;
                                        setNewQuiz(prev => ({ ...prev, questions }));
                                    }}
                                />
                                {question.options.map((option, optionIndex) => (
                                    <input
                                        key={optionIndex}
                                        type="text"
                                        placeholder={`Option ${optionIndex + 1}`}
                                        value={option}
                                        onChange={(e) => {
                                            const questions = [...newQuiz.questions];
                                            questions[index].options[optionIndex] = e.target.value;
                                            setNewQuiz(prev => ({ ...prev, questions }));
                                        }}
                                    />
                                ))}
                                <select
                                    value={question.correctAnswer}
                                    onChange={(e) => {
                                        const questions = [...newQuiz.questions];
                                        questions[index].correctAnswer = e.target.value;
                                        setNewQuiz(prev => ({ ...prev, questions }));
                                    }}
                                >
                                    <option value="">Select correct answer</option>
                                    {question.options.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button onClick={handleAddQuestion}>Add Question</button>
                        <button onClick={handleQuizSubmit}>Create Quiz</button>
                    </div>
                </div>
                <div className="quizzes-grid">
                    <h2>Your Quizzes</h2>
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="quiz-card">
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>
                            <p>Duration: {quiz.duration} minutes</p>
                            <p>Questions: {quiz.questions.length}</p>
                            <div className="quiz-actions">
                                <button onClick={() => handleViewResults(quiz._id)}>View Results</button>
                                <button onClick={() => handleQuizDelete(quiz._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
