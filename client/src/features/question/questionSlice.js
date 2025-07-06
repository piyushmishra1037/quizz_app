import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchQuestions = createAsyncThunk(
    'question/fetchQuestions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/questions');
            return response.data.questions;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
        }
    }
);

export const createQuestion = createAsyncThunk(
    'question/createQuestion',
    async (questionData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/questions', questionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create question');
        }
    }
);

export const updateQuestion = createAsyncThunk(
    'question/updateQuestion',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/questions/${id}`, updates);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update question');
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    'question/deleteQuestion',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/questions/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete question');
        }
    }
);

export const rateQuestion = createAsyncThunk(
    'question/rateQuestion',
    async ({ questionId, rating }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/questions/${questionId}/rate`, rating);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to rate question');
        }
    }
);

export const fetchQuestionVersions = createAsyncThunk(
    'question/fetchQuestionVersions',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/questions/${id}/versions`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch question versions');
        }
    }
);

export const exportQuestions = createAsyncThunk(
    'question/exportQuestions',
    async ({ format, ids }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/questions/export`, {
                params: { format, ids: ids.join(',') },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to export questions');
        }
    }
);

export const importQuestions = createAsyncThunk(
    'question/importQuestions',
    async ({ format, data }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/questions/import', { format, data });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to import questions');
        }
    }
);

const initialState = {
    questions: [],
    loading: false,
    error: null,
    selectedQuestion: null,
    versions: [],
    versionsLoading: false,
    versionsError: null,
    exportLoading: false,
    exportError: null,
    importLoading: false,
    importError: null
};

const questionSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedQuestion: (state, action) => {
            state.selectedQuestion = action.payload;
        },
        setQuestionVersions: (state, action) => {
            state.versions[action.payload.questionId] = action.payload.versions;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch questions
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create question
            .addCase(createQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.questions.unshift(action.payload);
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update question
            .addCase(updateQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = state.questions.map(q => 
                    q._id === action.payload._id ? action.payload : q
                );
            })
            .addCase(updateQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete question
            .addCase(deleteQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = state.questions.filter(q => q._id !== action.payload);
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Rate question
            .addCase(rateQuestion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rateQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = state.questions.map(q => 
                    q._id === action.payload._id ? action.payload : q
                );
            })
            .addCase(rateQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch question versions
            .addCase(fetchQuestionVersions.pending, (state) => {
                state.versionsLoading = true;
                state.versionsError = null;
            })
            .addCase(fetchQuestionVersions.fulfilled, (state, action) => {
                state.versionsLoading = false;
                state.versions = action.payload;
            })
            .addCase(fetchQuestionVersions.rejected, (state, action) => {
                state.versionsLoading = false;
                state.versionsError = action.payload;
            })

            // Export questions
            .addCase(exportQuestions.pending, (state) => {
                state.exportLoading = true;
                state.exportError = null;
            })
            .addCase(exportQuestions.fulfilled, (state, action) => {
                state.exportLoading = false;
            })
            .addCase(exportQuestions.rejected, (state, action) => {
                state.exportLoading = false;
                state.exportError = action.payload;
            })

            // Import questions
            .addCase(importQuestions.pending, (state) => {
                state.importLoading = true;
                state.importError = null;
            })
            .addCase(importQuestions.fulfilled, (state, action) => {
                state.importLoading = false;
                state.questions = action.payload.importedQuestions;
            })
            .addCase(importQuestions.rejected, (state, action) => {
                state.importLoading = false;
                state.importError = action.payload;
            });
    }
});

export const { clearError, setSelectedQuestion, setQuestionVersions } = questionSlice.actions;
export default questionSlice.reducer;
