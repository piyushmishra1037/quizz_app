import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Quiz.css';

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (quiz) {
            setTimeLeft(quiz.duration * 60);
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        handleQuizSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quiz]);

    const fetchQuiz = async () => {
        try {
            const response = await axios.get(`/api/quizzes/${id}`);
            setQuiz(response.data);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            navigate('/dashboard');
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        setCurrentQuestion(prev => {
            const next = prev + 1;
            if (next >= quiz.questions.length) {
                handleQuizSubmit();
                return prev;
            }
            return next;
        });
    };

    const handleQuizSubmit = async () => {
        try {
            const response = await axios.post(`/api/quizzes/${id}/submit`, { answers });
            setScore(response.data.score);
            setShowResults(true);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h2>{quiz.title}</h2>
                <div className="quiz-timer">
                    Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
                </div>
            </div>
            {!showResults ? (
                <div className="quiz-content">
                    <div className="question-card">
                        <h3>{quiz.questions[currentQuestion].question}</h3>
                        {quiz.questions[currentQuestion].options.map((option, index) => (
                            <div key={index} className="option">
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion}`}
                                    value={option}
                                    checked={answers[quiz.questions[currentQuestion]._id] === option}
                                    onChange={() => handleAnswerChange(quiz.questions[currentQuestion]._id, option)}
                                />
                                <label>{option}</label>
                            </div>
                        ))}
                        <button
                            className="next-button"
                            onClick={handleNextQuestion}
                            disabled={
                                !answers[quiz.questions[currentQuestion]._id] ||
                                currentQuestion === quiz.questions.length - 1
                            }
                        >
                            {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next Question'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="results">
                    <h3>Quiz Results</h3>
                    <p>Your Score: {score}/{quiz.questions.length}</p>
                    <p>Percentage: {(score / quiz.questions.length * 100).toFixed(2)}%</p>
                    <button onClick={() => navigate('/dashboard')} className="back-button">
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
