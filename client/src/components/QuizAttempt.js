import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuiz } from '../features/quiz/quizSlice';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Divider,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Snackbar,
} from '@mui/material';

const QuizAttempt = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentQuiz, loading, error } = useSelector((state) => state.quiz);
    const user = useSelector((state) => state.auth.user);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

    useEffect(() => {
        dispatch(fetchQuiz(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentQuiz) {
            setTimeLeft(currentQuiz.duration * 60);
            startTimer();
        }
    }, [currentQuiz]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleFinishQuiz();
        }
    }, [timeLeft]);

    const startTimer = () => {
        setTimerRunning(true);
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return interval;
    };

    const handleAnswerChange = (event) => {
        const { value } = event.target;
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: value
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleFinishQuiz = () => {
        let correctAnswers = 0;
        currentQuiz.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        
        setScore((correctAnswers / currentQuiz.questions.length) * 100);
        setShowResults(true);
        setTimerRunning(false);
        setShowSnackbar(true);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!currentQuiz) {
        return <div>Quiz not found</div>;
    }

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    return (
        <Container maxWidth="md">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {currentQuiz.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {currentQuiz.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Time Left: {formatTime(timeLeft)}
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {currentQuestion.question}
                </Typography>

                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Select your answer:</FormLabel>
                    <RadioGroup
                        value={selectedAnswers[currentQuestionIndex] || ''}
                        onChange={handleAnswerChange}
                        name={`question-${currentQuestionIndex}`}
                    >
                        {currentQuestion.options.map((option, index) => (
                            <FormControlLabel
                                key={index}
                                value={option}
                                control={<Radio />}
                                label={option}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === currentQuiz.questions.length - 1}
                    >
                        Next
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFinishQuiz}
                        disabled={currentQuestionIndex !== currentQuiz.questions.length - 1}
                    >
                        Finish Quiz
                    </Button>
                </Box>
            </Paper>

            {showResults && (
                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Quiz Results
                    </Typography>
                    <Typography variant="h6" color={score >= 60 ? 'success.main' : 'error.main'}>
                        Score: {score.toFixed(2)}%
                    </Typography>
                    <Typography variant="body1">
                        Correct Answers: {Math.round(score * currentQuiz.questions.length / 100)}
                        /{currentQuiz.questions.length}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/quizzes')}
                        sx={{ mt: 2 }}
                    >
                        Back to Quizzes
                    </Button>
                </Paper>
            )}

            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSnackbar(false)}
                message={`Quiz completed! Score: ${score.toFixed(2)}%`}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            />
        </Container>
    );
};

export default QuizAttempt;
