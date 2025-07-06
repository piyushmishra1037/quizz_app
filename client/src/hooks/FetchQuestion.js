import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const FetchQuestion = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('/api/quizzes');
            dispatch({ type: 'SET_QUESTIONS', payload: response.data });
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { loading, error };
};

export const MoveNextQuestion = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const moveNext = () => {
        if (state.currentQuestion < state.questions.length - 1) {
            dispatch({ type: 'SET_CURRENT_QUESTION', payload: state.currentQuestion + 1 });
        }
    };

    return moveNext;
};

export const MovePrevQuestion = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const movePrev = () => {
        if (state.currentQuestion > 0) {
            dispatch({ type: 'SET_CURRENT_QUESTION', payload: state.currentQuestion - 1 });
        }
    };

    return movePrev;
};
