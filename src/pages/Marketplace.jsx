import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getListings, CATEGORIES } from '../data/store';
import SkillCard from '../components/SkillCard';
import { Search, SlidersHorizontal, Zap, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Marketplace.css';

const DURATION_FILTERS = ['Any', '10 min', '15 min', '30 min', '1 hour'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
];

export default function Marketplace() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [duration, setDuration] = useState('Any');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [tick, setTick] = useState(0); // to force refresh after swap

  const listings = useMemo(() => {
    let list = getListings();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.skillOffered.toLowerCase().includes(q) ||
        l.skillNeeded.toLowerCase().includes(q)
      );
    }
    if (category !== 'All') list = list.filter((l) => l.category === category);
    if (duration !== 'Any') list = list.filter((l) => l.duration === duration);
    list = [...list].sort((a, b) => {
      if (sort === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sort === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
      if (sort === 'popular') return (b.likes || 0) - (a.likes || 0);
      return 0;
    });
    return list;
  }, [search, category, duration, sort, tick]);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="mkt-header">
          <div>
            <h1 className="mkt-title">Skill <span className="text-gradient">Marketplace</span></h1>
            <p className="mkt-subtitle">
              {listings.length} skill listings · trade talents, earn credits
            </p>
          </div>
          {user && (
            <Link to="/create-listing" className="btn btn-primary" id="mkt-post-btn">
              <Plus size={16} /> Post a Skill
            </Link>
          )}
        </div>

        {/* Search + Filters */}
        <div className="mkt-search-row">
          <div className="search-wrap">
            <Search size={17} className="search-icon" />
            <input
              id="mkt-search"
              className="search-input"
              type="search"
              placeholder="Search skills, categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select sort-select" value={sort} onChange={(e) => setSort(e.target.value)} id="mkt-sort">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className={`btn btn-secondary filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)} id="mkt-filter-btn">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tag ${category === cat ? 'tag-active' : ''}`}
              onClick={() => setCategory(cat)}
              id={`cat-${cat.replace(/\s/g, '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Duration filter */}
        {showFilters && (
          <div className="filter-panel card mb-3">
            <div className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Session Duration</div>
            <div className="flex gap-1 flex-wrap">
              {DURATION_FILTERS.map((d) => (
                <button
                  key={d}
                  className={`tag ${duration === d ? 'tag-active' : ''}`}
                  onClick={() => setDuration(d)}
                  id={`dur-${d.replace(/\s/g, '-')}`}
                >
                  <Zap size={11} /> {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Listings */}
        {listings.length > 0 ? (
          <div className="grid-auto">
            {listings.map((l) => (
              <SkillCard key={l.listingId} listing={l} onSwapRequested={() => setTick((t) => t + 1)} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No listings found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
            {user && (
              <Link to="/create-listing" className="btn btn-primary mt-2">
                <Plus size={15} /> Be the first to post!
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
