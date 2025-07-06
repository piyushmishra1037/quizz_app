import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestions } from '../features/question/questionSlice';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem as MuiMenuItem,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    MoreVertIcon,
    EditIcon,
    DeleteIcon,
    AddIcon,
    FilterListIcon,
    Rating,
    Tooltip,
    Menu,
    ListItemIcon,
    ListItemText,
    StarIcon,
    HistoryIcon,
    TimelineIcon,
    ExpandMoreIcon,
    ExpandLessIcon,
    FileDownloadIcon,
    FileUploadIcon,
    Alert,
} from '@mui/material';

const QuestionBank = () => {
    const dispatch = useDispatch();
    const { questions, loading, error } = useSelector((state) => state.question);
    const user = useSelector((state) => state.auth.user);

    const [open, setOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        difficulty: '',
        tags: [],
        type: '',
        rating: '',
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [expandedVersions, setExpandedVersions] = useState({});
    const [exportFormat, setExportFormat] = useState('json');
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [importFormat, setImportFormat] = useState('json');
    const [importData, setImportData] = useState('');

    useEffect(() => {
        dispatch(fetchQuestions());
    }, [dispatch]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredQuestions = questions.filter((q) => {
        return (
            (!filters.category || q.category === filters.category) &&
            (!filters.difficulty || q.difficulty === filters.difficulty) &&
            (!filters.type || q.type === filters.type) &&
            (!filters.tags.length || filters.tags.every(tag => q.tags.includes(tag))) &&
            (!filters.rating || 
                (q.metadata.avgDifficultyRating >= Number(filters.rating) - 1 && 
                 q.metadata.avgDifficultyRating <= Number(filters.rating) + 1))
        );
    });

    const handleCreateQuestion = () => {
        setSelectedQuestion(null);
        setOpen(true);
    };

    const handleEditQuestion = (question) => {
        setSelectedQuestion(question);
        setOpen(true);
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            await dispatch(deleteQuestion(questionId));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleRateQuestion = async (questionId, rating) => {
        try {
            await dispatch(rateQuestion({ questionId, rating }));
        } catch (error) {
            console.error('Error rating question:', error);
        }
    };

    const handleVersionToggle = (questionId) => {
        setExpandedVersions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    const handleExport = () => {
        setExportDialogOpen(true);
    };

    const handleExportConfirm = async () => {
        try {
            await dispatch(exportQuestions({ format: exportFormat, ids: filteredQuestions.map(q => q._id) }));
            setExportDialogOpen(false);
        } catch (error) {
            console.error('Error exporting questions:', error);
        }
    };

    const handleImport = () => {
        setImportDialogOpen(true);
    };

    const handleImportConfirm = async () => {
        try {
            await dispatch(importQuestions({ format: importFormat, data: importData }));
            setImportData('');
            setImportDialogOpen(false);
            dispatch(fetchQuestions());
        } catch (error) {
            console.error('Error importing questions:', error);
        }
    };

    const renderQuestionTypeIcon = (type) => {
        switch (type) {
            case 'multiple_choice':
                return <StarIcon sx={{ fontSize: 16 }} />;
            case 'true_false':
                return <HistoryIcon sx={{ fontSize: 16 }} />;
            case 'short_answer':
                return <TimelineIcon sx={{ fontSize: 16 }} />;
            default:
                return <ExpandMoreIcon sx={{ fontSize: 16 }} />;
        }
    };

    const renderRatings = (question) => {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Difficulty Rating">
                    <Rating
                        value={question.metadata.avgDifficultyRating}
                        precision={0.5}
                        readOnly
                        size="small"
                    />
                </Tooltip>
                <Tooltip title="Clarity Rating">
                    <Rating
                        value={question.metadata.avgClarityRating}
                        precision={0.5}
                        readOnly
                        size="small"
                    />
                </Tooltip>
                <Typography variant="caption" color="text.secondary">
                    {question.metadata.totalRatings} ratings
                </Typography>
            </Box>
        );
    };

    const renderVersions = (question) => {
        const versions = question.versions || [];
        return (
            <Box sx={{ mt: 2, pl: 4, borderLeft: '1px solid #eee' }}>
                {versions.map((version, index) => (
                    <Box key={version.version} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Version {version.version}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(version.metadata.changedAt).toLocaleDateString()}
                        </Typography>
                        <Chip
                            label={version.metadata.changes}
                            size="small"
                            color="primary"
                        />
                    </Box>
                ))}
            </Box>
        );
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
                    Question Bank
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Manage your questions and build better quizzes
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Filters */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Filters
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                <MenuItem value="math">Mathematics</MenuItem>
                                <MenuItem value="science">Science</MenuItem>
                                <MenuItem value="history">History</MenuItem>
                                <MenuItem value="literature">Literature</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Difficulty</InputLabel>
                            <Select
                                name="difficulty"
                                value={filters.difficulty}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All Difficulties</MenuItem>
                                <MenuItem value="easy">Easy</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="hard">Hard</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All Types</MenuItem>
                                <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                                <MenuItem value="true_false">True/False</MenuItem>
                                <MenuItem value="short_answer">Short Answer</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Tags"
                            name="tags"
                            value={filters.tags.join(', ')}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                tags: e.target.value.split(',').map(tag => tag.trim())
                            }))}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Rating</InputLabel>
                            <Select
                                name="rating"
                                value={filters.rating}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">All Ratings</MenuItem>
                                <MenuItem value="1">1 Star</MenuItem>
                                <MenuItem value="2">2 Stars</MenuItem>
                                <MenuItem value="3">3 Stars</MenuItem>
                                <MenuItem value="4">4 Stars</MenuItem>
                                <MenuItem value="5">5 Stars</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>
                </Grid>

                {/* Questions List */}
                <Grid item xs={12} md={9}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Questions ({filteredQuestions.length})</Typography>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleCreateQuestion}
                                    sx={{ mr: 1 }}
                                >
                                    Add Question
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={handleExport}
                                    sx={{ mr: 1 }}
                                >
                                    Export
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileUploadIcon />}
                                    onClick={handleImport}
                                >
                                    Import
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Question</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Difficulty</TableCell>
                                        <TableCell>Tags</TableCell>
                                        <TableCell>Usage</TableCell>
                                        <TableCell>Ratings</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredQuestions.map((question) => (
                                        <>
                                            <TableRow key={question._id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        <Typography variant="body2">
                                                            {question.question.substring(0, 100)}
                                                            {question.question.length > 100 ? '...' : ''}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Version {question.currentVersion}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {renderQuestionTypeIcon(question.type)}
                                                </TableCell>
                                                <TableCell>{question.category}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={question.difficulty}
                                                        color={question.difficulty === 'easy' ? 'success' : 
                                                            question.difficulty === 'medium' ? 'warning' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {question.tags.map((tag, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={tag}
                                                            size="small"
                                                            sx={{ mr: 1, mb: 1 }}
                                                        />
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        Used in {question.metadata.usageCount} quizzes
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Last updated: {new Date(question.metadata.lastUpdated).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {renderRatings(question)}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="actions"
                                                        size="small"
                                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl)}
                                                        onClose={() => setAnchorEl(null)}
                                                    >
                                                        <MuiMenuItem onClick={() => handleEditQuestion(question)}>
                                                            <ListItemIcon>
                                                                <EditIcon fontSize="small" />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Edit" />
                                                        </MuiMenuItem>
                                                        <MuiMenuItem onClick={() => handleDeleteQuestion(question._id)}>
                                                            <ListItemIcon>
                                                                <DeleteIcon fontSize="small" />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Delete" />
                                                        </MuiMenuItem>
                                                        <MuiMenuItem onClick={() => handleVersionToggle(question._id)}>
                                                            <ListItemIcon>
                                                                <HistoryIcon fontSize="small" />
                                                            </ListItemIcon>
                                                            <ListItemText primary={expandedVersions[question._id] ? "Hide Versions" : "Show Versions"} />
                                                        </MuiMenuItem>
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                            {expandedVersions[question._id] && renderVersions(question)}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedQuestion ? 'Edit Question' : 'Create New Question'}
                </DialogTitle>
                <DialogContent>
                    {/* Add question form here */}
                    <Typography>Question Form Placeholder</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={() => setOpen(false)}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Export Dialog */}
            <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
                <DialogTitle>Export Questions</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Format</InputLabel>
                            <Select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                            >
                                <MenuItem value="json">JSON</MenuItem>
                                <MenuItem value="csv">CSV</MenuItem>
                                <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleExportConfirm}>
                        Export
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Import Dialog */}
            <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md">
                <DialogTitle>Import Questions</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Format</InputLabel>
                            <Select
                                value={importFormat}
                                onChange={(e) => setImportFormat(e.target.value)}
                            >
                                <MenuItem value="json">JSON</MenuItem>
                                <MenuItem value="csv">CSV</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={importData}
                            onChange={(e) => setImportData(e.target.value)}
                            placeholder="Paste your question data here..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleImportConfirm}>
                        Import
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default QuestionBank;
