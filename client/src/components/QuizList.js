import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('/api/quizzes');
            setQuizzes(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createQuiz = async () => {
        try {
            const newQuiz = {
                title: 'Sample Quiz',
                description: 'A sample quiz',
                questions: [
                    {
                        question: 'What is 2 + 2?',
                        options: ['3', '4', '5', '6'],
                        correctAnswer: '4'
                    }
                ]
            };
            await axios.post('/api/quizzes', newQuiz);
            fetchQuizzes();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Quiz App</h1>
            <button onClick={createQuiz} style={{ marginBottom: '20px' }}>
                Create Sample Quiz
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {quizzes.map(quiz => (
                    <div key={quiz._id} style={{
                        padding: '15px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}>
                        <h2>{quiz.title}</h2>
                        <p>{quiz.description}</p>
                        <p>Questions: {quiz.questions.length}</p>
                        <p>Created: {new Date(quiz.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList;
