import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
    Alert,
    Chip,
} from '@mui/material';

const QuizResults = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentQuiz, loading, error } = useSelector((state) => state.quiz);
    const user = useSelector((state) => state.auth.user);
    const [results, setResults] = React.useState([]);
    const [loadingResults, setLoadingResults] = React.useState(true);

    useEffect(() => {
        if (currentQuiz) {
            fetchQuizResults();
        }
    }, [currentQuiz]);

    const fetchQuizResults = async () => {
        try {
            // This would be replaced with an actual API call to fetch results
            // For now, we'll simulate with some sample data
            const sampleResults = [
                {
                    user: 'John Doe',
                    score: 85,
                    completedAt: new Date().toISOString(),
                    correctAnswers: 17,
                    totalQuestions: 20
                },
                {
                    user: 'Jane Smith',
                    score: 72,
                    completedAt: new Date().toISOString(),
                    correctAnswers: 14,
                    totalQuestions: 20
                },
                // Add more sample results as needed
            ];
            setResults(sampleResults);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
        } finally {
            setLoadingResults(false);
        }
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

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {currentQuiz.title} Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {currentQuiz.description}
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Quiz Statistics
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                        label={`Total Attempts: ${results.length}`}
                        color="primary"
                    />
                    <Chip
                        label={`Average Score: ${
                            results.reduce((acc, curr) => acc + curr.score, 0) / results.length || 0
                        }%`}
                        color="secondary"
                    />
                    <Chip
                        label={`Highest Score: ${Math.max(...results.map(r => r.score))}%`}
                        color="success"
                    />
                    <Chip
                        label={`Lowest Score: ${Math.min(...results.map(r => r.score))}%`}
                        color="error"
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Student</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Correct Answers</TableCell>
                                <TableCell>Completed At</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((result, index) => (
                                <TableRow key={index}>
                                    <TableCell>{result.user}</TableCell>
                                    <TableCell>
                                        <Typography
                                            color={result.score >= 60 ? 'success.main' : 'error.main'}
                                        >
                                            {result.score}%
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {result.correctAnswers}/{result.totalQuestions}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(result.completedAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={result.score >= 60 ? 'Pass' : 'Fail'}
                                            color={result.score >= 60 ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/quizzes')}
                    >
                        Back to Quizzes
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default QuizResults;
