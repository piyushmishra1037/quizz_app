import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getQuizAnalytics = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/api/quizzes/${quizId}/analytics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz analytics:', error);
        throw error;
    }
};

export const getScoreDistribution = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/api/quizzes/${quizId}/scores`);
        return response.data;
    } catch (error) {
        console.error('Error fetching score distribution:', error);
        throw error;
    }
};

export const getTimeDistribution = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/api/quizzes/${quizId}/times`);
        return response.data;
    } catch (error) {
        console.error('Error fetching time distribution:', error);
        throw error;
    }
};

export const getDifficultyDistribution = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/api/quizzes/${quizId}/difficulty`);
        return response.data;
    } catch (error) {
        console.error('Error fetching difficulty distribution:', error);
        throw error;
    }
};

export const exportQuizData = async (quizId, format = 'csv') => {
    try {
        const response = await axios.get(`${API_URL}/api/quizzes/${quizId}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting quiz data:', error);
        throw error;
    }
};

// Hook for analytics data
export const useQuizAnalytics = (quizId) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [scores, times, difficulty] = await Promise.all([
                    getScoreDistribution(quizId),
                    getTimeDistribution(quizId),
                    getDifficultyDistribution(quizId)
                ]);
                setAnalytics({
                    scores,
                    times,
                    difficulty
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchAnalytics();
        }
    }, [quizId]);

    return { analytics, loading, error };
};
