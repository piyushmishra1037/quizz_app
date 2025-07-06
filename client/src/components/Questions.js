import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchQuestion, MoveNextQuestion, MovePrevQuestion } from '../hooks/FetchQuestion';
import { PushAnswer } from '../hooks/setResult';

export default function Questions() {
    const [checked, setChecked] = useState(undefined);
    const dispatch = useDispatch();
    const questions = useSelector((state) => state.questions.queue);
    const currentQuestion = useSelector((state) => state.questions.trace);
    const result = useSelector((state) => state.result.result);
    
    const { loading, error } = FetchQuestion();
    const moveNext = MoveNextQuestion();
    const movePrev = MovePrevQuestion();

    const handleOptionSelect = (option) => {
        setChecked(option);
        dispatch(PushAnswer({
            questionId: questions[currentQuestion]._id,
            selectedAnswer: option
        }));
    };

    if (loading) return <h3>Loading questions...</h3>;
    if (error) return <h3>Error: {error}</h3>;

    if (!questions[currentQuestion]) {
        return <h3>No questions available</h3>;
    }

    return (
        <div className='questions'>
            <h2 className='text-light'>{questions[currentQuestion].question}</h2>

            <ul key={questions[currentQuestion]._id}>
                {questions[currentQuestion].options.map((q, i) => (
                    <li key={i}>
                        <input 
                            type="radio"
                            value={false}
                            name="options"
                            id={`q${i}-option`}
                            onChange={() => handleOptionSelect(q)}
                        />
                        <label className='text-primary' htmlFor={`q${i}-option`}>{q}</label>
                        <div className={`check ${result[currentQuestion] === q ? 'checked' : ''}`}>
                            {result[currentQuestion] === q ? '✓' : ''}
                        </div>
                    </li>
                ))}
            </ul>

            <div className="navigation-buttons">
                <button onClick={movePrev} disabled={currentQuestion === 0}>
                    Previous
                </button>
                <button onClick={moveNext} disabled={currentQuestion === questions.length - 1}>
                    Next
                </button>
            </div>
        </div>
    );
}
