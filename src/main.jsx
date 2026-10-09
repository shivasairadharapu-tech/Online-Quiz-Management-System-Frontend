import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';

const API = import.meta.env.VITE_API_URL || 'https://online-quiz-management-system-backend-3.onrender.com/api';
const api = axios.create({ baseURL: API });
const result=await axios.post("http://localhost:8080/login", data)
const result=await axios.post(
  "https:/online-quiz-management-system-backend-3.onrender.com/login",
  data
)

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('quizUser') || 'null'));
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const logout = () => { localStorage.removeItem('quizUser'); setUser(null); setPage('home'); };

  if (!user) return page === 'register'
    ? <Register goLogin={() => setPage('login')} />
    : <Login onLogin={u => { localStorage.setItem('quizUser', JSON.stringify(u)); setUser(u); setPage('dashboard'); }} goRegister={() => setPage('register')} />;

  if (page === 'quiz' && selected) return <Quiz quiz={selected} user={user} onDone={() => setPage('history')} />;

  return <div>
    <Header user={user} page={page} setPage={setPage} logout={logout} />
    <main className="container">
      {(page === 'dashboard' || page === 'home') && <Dashboard start={q => { setSelected(q); setPage('quiz'); }} />}
      {page === 'history' && <History user={user} />}
      {page === 'admin' && user.role === 'ADMIN' && <Admin />}
    </main>
  </div>;
}

function Header({ user, page, setPage, logout }) {
  return <header>
    <div className="brand">Online Quiz Management</div>
    <nav>
      <button className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>Quizzes</button>
      <button className={page === 'history' ? 'active' : ''} onClick={() => setPage('history')}>History</button>
      {user.role === 'ADMIN' && <button className={page === 'admin' ? 'active' : ''} onClick={() => setPage('admin')}>Admin</button>}
      <button onClick={logout}>Logout</button>
    </nav>
    <span className="user">{user.name} ({user.role})</span>
  </header>;
}

function Login({ onLogin, goRegister }) {
  const [f, setF] = useState({ email: 'student@quiz.com', password: 'student123' });
  const [err, setErr] = useState('');
  const submit = async e => {
    e.preventDefault();
    try { const r = await api.post('/login', f); onLogin(r.data); }
    catch (x) { setErr(x.response?.data?.message || 'Login failed. Start the Spring Boot backend first.'); }
  };
  return <Auth title="Login" submit={submit} error={err}>
    <input required placeholder="Email" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
    <input required placeholder="Password" type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
    <button className="primary">Login</button>
    <p>New student? <button type="button" className="link" onClick={goRegister}>Register</button></p>
    <small>Admin: admin@quiz.com / admin123</small>
  </Auth>;
}

function Register({ goLogin }) {
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const submit = async e => {
    e.preventDefault();
    try { await api.post('/register', f); setMsg('Registration successful. Please login.'); setTimeout(goLogin, 700); }
    catch (x) { setMsg(x.response?.data?.message || 'Registration failed'); }
  };
  return <Auth title="Student Registration" submit={submit} error={msg}>
    <input required placeholder="Full name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
    <input required type="email" placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
    <input required minLength="6" type="password" placeholder="Password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} />
    <button className="primary">Register</button>
    <p>Already registered? <button type="button" className="link" onClick={goLogin}>Login</button></p>
  </Auth>;
}

function Auth({ title, submit, error, children }) {
  return <div className="auth"><div className="card"><h1>{title}</h1><p className="muted">Online Quiz Management System</p>{error && <div className="message">{error}</div>}<form onSubmit={submit}>{children}</form></div></div>;
}

function Dashboard({ start }) {
  const [qs, setQs] = useState([]);
  const [cat, setCat] = useState('All');
  useEffect(() => { api.get('/quizzes').then(r => setQs(r.data)).catch(() => setQs([])); }, []);
  const cats = ['All', ...new Set(qs.map(q => q.category).filter(Boolean))];
  const filtered = qs.filter(q => cat === 'All' || q.category === cat);
  return <>
    <section className="hero"><h1>Programming Language Quizzes</h1><p>Choose any language, answer MCQs, and receive your score automatically.</p></section>
    <div className="toolbar"><div><h2>Available Quizzes</h2><p className="muted">Java, Python, C, C++, JavaScript, C#, PHP, SQL, Kotlin, Go, Ruby and Swift.</p></div><select value={cat} onChange={e => setCat(e.target.value)}>{cats.map(x => <option key={x}>{x}</option>)}</select></div>
    <div className="grid">
      {filtered.map(q => <div className="card quizcard" key={q.id}>
        <span className="badge">{q.difficulty}</span><span className="language">{q.category}</span>
        <h3>{q.title}</h3><p>{q.description}</p><p><b>{q.category}</b> · {q.durationMinutes} minutes</p>
        <button className="primary" onClick={() => start(q)}>Start Quiz</button>
      </div>)}
      {!filtered.length && <div className="card"><p>No quizzes found. Ask the administrator to add one.</p></div>}
    </div>
  </>;
}

function Quiz({ quiz, user, onDone }) {
  const [questions, setQuestions] = useState([]); const [answers, setAnswers] = useState({});
  const [time, setTime] = useState((quiz.durationMinutes || 10) * 60); const [result, setResult] = useState(null);
  useEffect(() => { api.get(`/quizzes/${quiz.id}/questions`).then(r => setQuestions(r.data)); }, [quiz.id]);
  useEffect(() => { if (result) return; const t = setInterval(() => setTime(x => { if (x <= 1) { clearInterval(t); submit(); return 0; } return x - 1; }), 1000); return () => clearInterval(t); }, [result, questions]);
  const submit = async () => { try { const r = await api.post('/results', { userId: user.id, quizId: quiz.id, answers }); setResult(r.data); } catch { alert('Could not submit quiz'); } };
  if (result) return <div className="result card"><h1>{quiz.title} Completed</h1><div className="score">{result.score} / {result.total}</div><h2>{Number(result.percentage).toFixed(1)}%</h2><button className="primary" onClick={onDone}>View History</button></div>;
  return <div><div className="quiztop"><div><h1>{quiz.title}</h1><p className="muted">{quiz.category} · {questions.length} questions</p></div><div className="timer">Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}</div></div>
    {questions.map((q, i) => <div className="card question" key={q.id}><h3>{i + 1}. {q.question}</h3>{['A', 'B', 'C', 'D'].map(o => <label className="option" key={o}><input type="radio" name={`q${q.id}`} checked={answers[q.id] === o} onChange={() => setAnswers({ ...answers, [q.id]: o })} /><span>{o}. {q[`option${o}`]}</span></label>)}</div>)}
    <button className="primary submit" onClick={submit}>Submit Quiz</button>
  </div>;
}

function History({ user }) {
  const [data, setData] = useState([]);
  useEffect(() => { api.get(`/results/user/${user.id}`).then(r => setData(r.data)); }, [user.id]);
  return <><h1>Quiz History</h1><div className="card tablewrap"><table><thead><tr><th>Quiz</th><th>Score</th><th>Percentage</th><th>Attempted At</th></tr></thead><tbody>{data.map(r => <tr key={r.id}><td>{r.quizTitle}</td><td>{r.score}/{r.total}</td><td>{r.total ? ((r.score / r.total) * 100).toFixed(1) : '0.0'}%</td><td>{new Date(r.attemptedAt).toLocaleString()}</td></tr>)}</tbody></table>{!data.length && <p className="muted">No quiz attempts yet.</p>}</div></>;
}

const emptyQuiz = { title: '', description: '', category: 'Programming', difficulty: 'Easy', durationMinutes: 10 };
const emptyQuestion = { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' };

function Admin() {
  const [qs, setQs] = useState([]); const [results, setResults] = useState([]); const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState(emptyQuiz); const [editingQuiz, setEditingQuiz] = useState(null);
  const [questionList, setQuestionList] = useState([]); const [questionForm, setQuestionForm] = useState(emptyQuestion); const [editingQuestion, setEditingQuestion] = useState(null); const [msg, setMsg] = useState('');

  const load = async () => { const [a, b] = await Promise.all([api.get('/quizzes'), api.get('/results')]); setQs(a.data); setResults(b.data); };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (selectedQuiz) loadQuestions(selectedQuiz.id); else setQuestionList([]); }, [selectedQuiz]);

  const loadQuestions = async id => { const r = await api.get(`/quizzes/${id}/questions/admin`); setQuestionList(r.data); };
  const saveQuiz = async e => { e.preventDefault(); try { if (editingQuiz) await api.put(`/quizzes/${editingQuiz.id}`, quizForm); else await api.post('/quizzes', quizForm); setQuizForm(emptyQuiz); setEditingQuiz(null); await load(); setMsg('Quiz saved successfully.'); } catch { setMsg('Could not save quiz.'); } };
  const editQuiz = q => { setEditingQuiz(q); setQuizForm({ title: q.title, description: q.description || '', category: q.category || 'Programming', difficulty: q.difficulty || 'Easy', durationMinutes: q.durationMinutes || 10 }); setSelectedQuiz(q); };
  const deleteQuiz = async id => { if (!window.confirm('Delete this quiz and all its questions?')) return; await api.delete(`/quizzes/${id}`); if (selectedQuiz?.id === id) setSelectedQuiz(null); await load(); setMsg('Quiz deleted.'); };
  const saveQuestion = async e => { e.preventDefault(); if (!selectedQuiz) return; try { if (editingQuestion) await api.put(`/quizzes/questions/${editingQuestion.id}`, questionForm); else await api.post(`/quizzes/${selectedQuiz.id}/questions`, questionForm); setQuestionForm(emptyQuestion); setEditingQuestion(null); await loadQuestions(selectedQuiz.id); setMsg('Question saved successfully.'); } catch { setMsg('Could not save question.'); } };
  const editQuestion = q => { setEditingQuestion(q); setQuestionForm({ question: q.question, optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD, correctAnswer: q.correctAnswer }); };
  const deleteQuestion = async id => { if (!window.confirm('Delete this question?')) return; await api.delete(`/quizzes/questions/${id}`); await loadQuestions(selectedQuiz.id); setMsg('Question deleted.'); };

  return <>
    <div className="adminHeader"><div><h1>Admin Dashboard</h1><p className="muted">Create quizzes and fully manage questions for every programming language.</p></div>{msg && <div className="success">{msg}</div>}</div>
    <div className="admincols">
      <div className="card"><h2>{editingQuiz ? 'Edit Quiz' : 'Create Quiz'}</h2><form onSubmit={saveQuiz} className="stack">
        <input required placeholder="Quiz title" value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })} />
        <textarea placeholder="Description" value={quizForm.description} onChange={e => setQuizForm({ ...quizForm, description: e.target.value })} />
        <input required placeholder="Programming language / category" value={quizForm.category} onChange={e => setQuizForm({ ...quizForm, category: e.target.value })} />
        <select value={quizForm.difficulty} onChange={e => setQuizForm({ ...quizForm, difficulty: e.target.value })}><option>Easy</option><option>Medium</option><option>Hard</option></select>
        <input type="number" min="1" value={quizForm.durationMinutes} onChange={e => setQuizForm({ ...quizForm, durationMinutes: Number(e.target.value) })} />
        <div><button className="primary">{editingQuiz ? 'Update Quiz' : 'Create Quiz'}</button>{editingQuiz && <button type="button" className="secondary" onClick={() => { setEditingQuiz(null); setQuizForm(emptyQuiz); }}>Cancel</button>}</div>
      </form></div>
      <div className="card"><h2>Manage Quizzes</h2>{qs.map(q => <div className={`adminitem ${selectedQuiz?.id === q.id ? 'selecteditem' : ''}`} key={q.id}>
        <button className="itemselect" onClick={() => { setSelectedQuiz(q); setEditingQuestion(null); setQuestionForm(emptyQuestion); }}><b>{q.title}</b><small>{q.category} · {q.difficulty}</small></button>
        <div className="actions"><button className="secondary" onClick={() => editQuiz(q)}>Edit</button><button className="danger" onClick={() => deleteQuiz(q.id)}>Delete</button></div>
      </div>)}</div>
    </div>

    <div className="card questionManager">
      <div className="managerTitle"><div><h2>Question Management</h2><p className="muted">Select a quiz above to add, edit, or remove its MCQ questions.</p></div><select value={selectedQuiz?.id || ''} onChange={e => { const q = qs.find(x => String(x.id) === e.target.value); setSelectedQuiz(q || null); setEditingQuestion(null); setQuestionForm(emptyQuestion); }}><option value="">Select a quiz</option>{qs.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}</select></div>
      {selectedQuiz ? <div className="questionManagerGrid">
        <form onSubmit={saveQuestion} className="card innercard stack"><h3>{editingQuestion ? 'Edit Question' : `Add Question to ${selectedQuiz.title}`}</h3>
          <textarea required placeholder="Question" value={questionForm.question} onChange={e => setQuestionForm({ ...questionForm, question: e.target.value })} />
          <input required placeholder="Option A" value={questionForm.optionA} onChange={e => setQuestionForm({ ...questionForm, optionA: e.target.value })} />
          <input required placeholder="Option B" value={questionForm.optionB} onChange={e => setQuestionForm({ ...questionForm, optionB: e.target.value })} />
          <input required placeholder="Option C" value={questionForm.optionC} onChange={e => setQuestionForm({ ...questionForm, optionC: e.target.value })} />
          <input required placeholder="Option D" value={questionForm.optionD} onChange={e => setQuestionForm({ ...questionForm, optionD: e.target.value })} />
          <select value={questionForm.correctAnswer} onChange={e => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}><option value="A">Correct answer: A</option><option value="B">Correct answer: B</option><option value="C">Correct answer: C</option><option value="D">Correct answer: D</option></select>
          <div><button className="primary">{editingQuestion ? 'Update Question' : 'Add Question'}</button>{editingQuestion && <button type="button" className="secondary" onClick={() => { setEditingQuestion(null); setQuestionForm(emptyQuestion); }}>Cancel</button>}</div>
        </form>
        <div className="questionList"><h3>Questions ({questionList.length})</h3>{questionList.map((q, i) => <div className="questionAdmin" key={q.id}><div><b>{i + 1}. {q.question}</b><p>A. {q.optionA} · B. {q.optionB} · C. {q.optionC} · D. {q.optionD}</p><span className="answer">Correct: {q.correctAnswer}</span></div><div className="actions"><button className="secondary" onClick={() => editQuestion(q)}>Edit</button><button className="danger" onClick={() => deleteQuestion(q.id)}>Delete</button></div></div>)}{!questionList.length && <p className="muted">No questions yet. Add the first question using the form.</p>}</div>
      </div> : <div className="emptyAdmin">Select a quiz to manage its questions.</div>}
    </div>

    <div className="card tablewrap"><h2>Student Results</h2><table><thead><tr><th>Student</th><th>Quiz</th><th>Score</th><th>Date</th></tr></thead><tbody>{results.map(r => <tr key={r.id}><td>{r.student}</td><td>{r.quizTitle}</td><td>{r.score}/{r.total}</td><td>{new Date(r.attemptedAt).toLocaleString()}</td></tr>)}</tbody></table>{!results.length && <p className="muted">No student results yet.</p>}</div>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
