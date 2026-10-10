import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import quizService from '../services/quizService';
import QuizCard from '../components/QuizCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, BookOpen } from '../components/Icons';

export const ExploreQuizzes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesData, categoriesData] = await Promise.all([
          quizService.getPublishedQuizzes(),
          quizService.getCategories().catch(() => []),
        ]);
        setQuizzes(quizzesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update selectedCategory if URL search param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Derive unique categories from existing quizzes + categories
  const categoryOptions = [
    'All',
    ...new Set([
      ...categories.map((c) => c.name),
      ...quizzes.map((q) => q.category).filter(Boolean),
    ]),
  ];

  const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard'];

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (quiz.category && quiz.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'All' ||
      (quiz.difficulty && quiz.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      (quiz.title && quiz.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (quiz.description && quiz.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (quiz.category && quiz.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading published quizzes..." />;
  }

  return (
    <div className="section-container py-8">
      {/* Page Header */}
      <div className="explore-header mb-8">
        <div>
          <span className="section-subtitle">Catalog</span>
          <h1 className="page-title">Explore Assessments & Quizzes</h1>
          <p className="text-muted">
            Choose from a rich library of technical subjects, select your preferred difficulty, and test your knowledge.
          </p>
        </div>

        {/* Search Input */}
        <div className="search-bar-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search quizzes by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs / Pills */}
      <div className="filter-panel mb-8">
        <div className="category-chips-scroll">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="difficulty-dropdown-wrap">
          <Filter size={16} />
          <span className="filter-label">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
            {difficultyOptions.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-meta-bar mb-6">
        <span>
          Showing <b>{filteredQuizzes.length}</b> published quizzes
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {selectedDifficulty !== 'All' && ` (${selectedDifficulty})`}
        </span>
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="quizzes-grid">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <BookOpen size={48} className="text-muted mb-3" />
          <h3>No quizzes match your filter</h3>
          <p className="text-muted">
            Try adjusting your search query or selecting a different category or difficulty level.
          </p>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm mt-4"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setSearchQuery('');
              setSearchParams({});
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreQuizzes;
