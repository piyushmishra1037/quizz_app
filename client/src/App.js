import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/dashboard/StudentDashboard';
import InstructorDashboard from './components/dashboard/InstructorDashboard';
import './App.css';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, role }) => {
    const { user } = useAuth();

    return user?.role === role ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <RoleRoute role="student">
                                    <StudentDashboard />
                                </RoleRoute>
                                <RoleRoute role="instructor">
                                    <InstructorDashboard />
                                </RoleRoute>
                            </PrivateRoute>
                        }
                    />
                    <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
                    <Route path="/quiz/:id/results" element={<PrivateRoute><QuizResults /></PrivateRoute>} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
