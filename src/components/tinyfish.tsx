
import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  LoaderCircle,
  Globe,
  AlertCircle,
  PackageSearch,
} from 'lucide-react';

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  site_name?: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
}

export const TinyFishSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const searchQuery = query.trim();
    if (!searchQuery || loading) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(false);

    try {
      const configuredApiBase = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '').trim();
      const endpoints = [
        ...(configuredApiBase ? [`${configuredApiBase.replace(/\/$/, '')}/api/tinyfish/search`] : []),
        '/api/tinyfish/search',
        'http://127.0.0.1:8000/api/tinyfish/search',
        'http://localhost:8000/api/tinyfish/search'
      ];

      let lastError: Error | null = null;
      let response: Response | null = null;
      let data: any = null;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchQuery }),
          });
          data = await response.json();
          if (response.ok) {
            break;
          } else {
            lastError = new Error(data?.detail || `Search failed (${response.status})`);
          }
        } catch (fetchErr) {
          lastError = fetchErr instanceof Error ? fetchErr : new Error('Network error');
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('Search failed to connect to backend.');
      }

      const payload = data as SearchResponse;
      setResults(Array.isArray(payload.results) ? payload.results : []);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the search service.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Packaging Research Search
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Find online information about food packaging materials,
              suppliers and barrier properties.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={500}
            placeholder="e.g. moisture barrier packaging for potato chips"
            aria-label="Packaging research search query"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-500">
          Search results are external research references, not certified
          food-safety or packaging recommendations.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Search could not be completed</p>
            <p className="mt-1">{error}</p>
            <p className="mt-1">
              Check that the backend is running at 127.0.0.1:8000.
            </p>
          </div>
        </div>
      )}

      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              Search Results
            </h2>
            <span className="text-sm text-slate-500">
              {results.length} result{results.length === 1 ? '' : 's'}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <PackageSearch className="mx-auto mb-3 h-8 w-8 text-slate-400" />
              <p className="font-semibold text-slate-800">
                No results found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different packaging material or research topic.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((result, index) => (
                <article
                  key={`${result.url}-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200"
                >
                  <h3 className="font-semibold leading-6 text-slate-900">
                    {result.title || 'Untitled result'}
                  </h3>

                  {result.site_name && (
                    <p className="mt-1 text-xs font-medium text-emerald-700">
                      {result.site_name}
                    </p>
                  )}

                  {result.snippet && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {result.snippet}
                    </p>
                  )}

                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                    >
                      Visit source
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};