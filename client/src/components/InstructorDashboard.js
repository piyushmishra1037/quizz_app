import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizzes } from '../features/quiz/quizSlice';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    MoreVertIcon,
    DeleteIcon,
    EditIcon,
    AddIcon,
    PieChartIcon,
    BarChartIcon,
    LineChartIcon,
    TableChartIcon,
} from '@mui/material';

const InstructorDashboard = () => {
    const dispatch = useDispatch();
    const { quizzes, loading, error } = useSelector((state) => state.quiz);
    const user = useSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [chartType, setChartType] = useState('pie');
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    useEffect(() => {
        dispatch(fetchQuizzes());
    }, [dispatch]);

    const handleCreateQuiz = () => {
        // Redirect to quiz creation form
        window.location.href = '/quiz/new';
    };

    const handleViewAnalytics = (quizId) => {
        setSelectedQuizId(quizId);
        setOpen(true);
    };

    const renderAnalytics = () => {
        // This would be replaced with actual analytics data from the server
        const sampleData = {
            totalAttempts: 50,
            averageScore: 75,
            passRate: 80,
            difficultyDistribution: {
                easy: 20,
                medium: 30,
                hard: 10
            },
            timeDistribution: {
                '< 30 min': 15,
                '30-60 min': 25,
                '> 60 min': 10
            }
        };

        switch (chartType) {
            case 'pie':
                return (
                    <div style={{ width: '100%', height: '300px', border: '1px solid #ccc', padding: '16px' }}>
                        <Typography variant="h6">Difficulty Distribution</Typography>
                        {/* Replace with actual chart component */}
                        <div style={{ height: '200px', backgroundColor: '#f5f5f5' }}>
                            Pie Chart Placeholder
                        </div>
                    </div>
                );
            case 'bar':
                return (
                    <div style={{ width: '100%', height: '300px', border: '1px solid #ccc', padding: '16px' }}>
                        <Typography variant="h6">Time Distribution</Typography>
                        {/* Replace with actual chart component */}
                        <div style={{ height: '200px', backgroundColor: '#f5f5f5' }}>
                            Bar Chart Placeholder
                        </div>
                    </div>
                );
            case 'line':
                return (
                    <div style={{ width: '100%', height: '300px', border: '1px solid #ccc', padding: '16px' }}>
                        <Typography variant="h6">Score Trend</Typography>
                        {/* Replace with actual chart component */}
                        <div style={{ height: '200px', backgroundColor: '#f5f5f5' }}>
                            Line Chart Placeholder
                        </div>
                    </div>
                );
            default:
                return (
                    <div style={{ width: '100%', height: '300px', border: '1px solid #ccc', padding: '16px' }}>
                        <Typography variant="h6">Score Distribution</Typography>
                        {/* Replace with actual chart component */}
                        <div style={{ height: '200px', backgroundColor: '#f5f5f5' }}>
                            Table Placeholder
                        </div>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg">
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Instructor Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Welcome, {user?.name}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Your Quizzes</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleCreateQuiz}
                            >
                                Create New Quiz
                            </Button>
                        </Box>

                        <List>
                            {quizzes.map((quiz) => (
                                <ListItem
                                    key={quiz._id}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PieChartIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={quiz.title}
                                        secondary={`${quiz.questions.length} questions • ${quiz.duration} minutes`}
                                    />
                                    <Chip
                                        label={`${quiz.statistics.totalAttempts} attempts`}
                                        size="small"
                                        sx={{ mr: 2 }}
                                    />
                                    <Chip
                                        label={`${quiz.statistics.averageScore.toFixed(1)}% avg`}
                                        size="small"
                                        color={quiz.statistics.averageScore >= 60 ? 'success' : 'error'}
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleViewAnalytics(quiz._id)}
                                    >
                                        View Analytics
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    Quiz Analytics - {selectedQuiz?.title}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Chart Type</InputLabel>
                            <Select
                                value={chartType}
                                label="Chart Type"
                                onChange={(e) => setChartType(e.target.value)}
                            >
                                <MenuItem value="pie">Pie Chart</MenuItem>
                                <MenuItem value="bar">Bar Chart</MenuItem>
                                <MenuItem value="line">Line Chart</MenuItem>
                                <MenuItem value="table">Table</MenuItem>
                            </Select>
                        </FormControl>
                        <Box>
                            <Chip
                                label={`Total Attempts: ${selectedQuiz?.statistics.totalAttempts}`}
                                size="small"
                            />
                            <Chip
                                label={`Pass Rate: ${selectedQuiz?.statistics.passRate}%`}
                                size="small"
                                color="success"
                                sx={{ ml: 1 }}
                            />
                        </Box>
                    </Box>
                    {renderAnalytics()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                    <Button variant="contained" color="primary" onClick={() => setOpen(false)}>
                        Export Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default InstructorDashboard;
