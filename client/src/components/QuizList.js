import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizzes, createQuiz } from '../features/quiz/quizSlice';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const QuizList = () => {
    const dispatch = useDispatch();
    const { quizzes, loading, error } = useSelector((state) => state.quiz);
    const user = useSelector((state) => state.auth.user);

    const [open, setOpen] = React.useState(false);
    const [quizData, setQuizData] = React.useState({
        title: '',
        description: '',
        duration: 30,
        difficulty: 'medium'
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setQuizData({
            title: '',
            description: '',
            duration: 30,
            difficulty: 'medium'
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createQuiz(quizData));
        handleClose();
    };

    React.useEffect(() => {
        dispatch(fetchQuizzes());
    }, [dispatch]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quiz List
                </Typography>
                {user?.role === 'instructor' && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpen}
                        sx={{ mt: 2 }}
                    >
                        Create New Quiz
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {quizzes.map((quiz) => (
                        <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {quiz.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {quiz.description}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            Duration: {quiz.duration} minutes
                                        </Typography>
                                        <Typography variant="body2">
                                            Total Marks: {quiz.totalMarks}
                                        </Typography>
                                        <Typography variant="body2">
                                            Questions: {quiz.questions.length}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" href={`/quiz/${quiz._id}`}>
                                        Start Quiz
                                    </Button>
                                    {user?.role === 'instructor' && (
                                        <>
                                            <IconButton color="primary" aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Quiz</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="Quiz Title"
                            name="title"
                            autoFocus
                            value={quizData.title}
                            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={quizData.description}
                            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Duration (minutes)</InputLabel>
                            <Select
                                value={quizData.duration}
                                label="Duration"
                                onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })}
                            >
                                <MenuItem value={15}>15 minutes</MenuItem>
                                <MenuItem value={30}>30 minutes</MenuItem>
                                <MenuItem value={45}>45 minutes</MenuItem>
                                <MenuItem value={60}>60 minutes</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Difficulty Level</InputLabel>
                            <Select
                                value={quizData.difficulty}
                                label="Difficulty"
                                onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
                            >
                                <MenuItem value="easy">Easy</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="hard">Hard</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary">
                        Create Quiz
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default QuizList;
