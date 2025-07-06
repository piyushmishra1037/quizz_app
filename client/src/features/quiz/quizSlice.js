import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchQuizzes = createAsyncThunk(
    'quiz/fetchQuizzes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/quizzes');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchQuiz = createAsyncThunk(
    'quiz/fetchQuiz',
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/quizzes/${quizId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createQuiz = createAsyncThunk(
    'quiz/createQuiz',
    async (quizData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/quizzes', quizData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    quizzes: [],
    currentQuiz: null,
    loading: false,
    error: null,
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizzes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzes.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes = action.payload;
            })
            .addCase(fetchQuizzes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuiz = action.payload;
            })
            .addCase(fetchQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.quizzes.push(action.payload);
            })
            .addCase(createQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = quizSlice.actions;
export default quizSlice.reducer;
