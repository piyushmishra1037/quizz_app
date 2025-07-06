import React from 'react';
import Questions from './Questions';

/** redux store import */
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function Quiz() {
    const state = useSelector((state) => state);

    if (state.questions.queue.length === state.questions.trace + 1) {
        return <Navigate to="/result" />;
    }

    return (
        <div className="quiz">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="quiz-card">
                            <div className="quiz-header">
                                <h3 className="text-light">Quiz</h3>
                            </div>
                            <div className="quiz-body">
                                <Questions />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
