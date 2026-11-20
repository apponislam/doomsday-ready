import React, { FormEvent, useState } from 'react';
import { Movie } from '@/types';
import { Icon } from '@/components/icons/icon';
import { PrimaryButton } from '@/components/ui/primary-button';

interface MovieFormModalProps {
  editingMovie?: Movie;
  allMovies: Movie[];
  onClose: () => void;
  onSave: (movieData: Omit<Movie, 'watched'>) => void;
}

/**
 * Checks if candidateId reaches targetId through its prerequisite chain.
 */
function hasDependencyPath(fromMovieId: number, toMovieId: number, movieList: Movie[]): boolean {
  if (fromMovieId === toMovieId) return true;
  const movie = movieList.find((m) => m.id === fromMovieId);
  if (!movie) return false;
  return movie.prerequisites.some((id) => hasDependencyPath(id, toMovieId, movieList));
}

export function MovieFormModal({
  editingMovie,
  allMovies,
  onClose,
  onSave,
}: MovieFormModalProps) {
  const isEditing = Boolean(editingMovie);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const data = new FormData(event.currentTarget);
    const title = String(data.get('title')).trim();
    const year = Number(data.get('year'));
    const runtime = Number(data.get('runtime'));
    const prerequisites = data.getAll('prerequisites').map(Number);

    // 1. Title uniqueness check (Doc requirement: Title unique)
    const isDuplicateTitle = allMovies.some(
      (m) =>
        m.id !== editingMovie?.id &&
        m.title.trim().toLowerCase() === title.toLowerCase()
    );

    if (isDuplicateTitle) {
      setError(`A movie titled "${title}" already exists. Title must be unique.`);
      return;
    }

    // 2. Circular dependency check (Doc requirement: 409 CIRCULAR_DEPENDENCY)
    if (editingMovie) {
      for (const prereqId of prerequisites) {
        if (hasDependencyPath(prereqId, editingMovie.id, allMovies)) {
          const offending = allMovies.find((m) => m.id === prereqId)?.title ?? 'selected movie';
          setError(
            `409 CIRCULAR_DEPENDENCY: "${offending}" already depends on "${editingMovie.title}". A movie cannot depend on itself.`
          );
          return;
        }
      }
    }

    onSave({
      id: editingMovie ? editingMovie.id : 0,
      title,
      year,
      runtime,
      prerequisites,
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form
        className="modal"
        onSubmit={handleSubmit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-title">
          <span>
            <Icon name={isEditing ? 'edit' : 'plus'} />
          </span>
          <div>
            <p>MOVIE ARCHIVE</p>
            <h3>{isEditing ? 'Edit movie' : 'Add a new movie'}</h3>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              marginBottom: '16px',
              backgroundColor: 'rgba(239, 62, 54, 0.15)',
              border: '1px solid var(--red)',
              borderRadius: '4px',
              color: '#ff8a84',
              fontSize: '11px',
              lineHeight: '1.4',
            }}
          >
            {error}
          </div>
        )}

        <label>
          Movie title
          <input
            required
            name="title"
            defaultValue={editingMovie?.title}
            placeholder="e.g. Doctor Strange"
          />
        </label>

        <div className="field-row">
          <label>
            Release year
            <input
              required
              name="year"
              type="number"
              min="1900"
              max="2100"
              defaultValue={editingMovie?.year ?? 2024}
            />
          </label>
          <label>
            Runtime (minutes)
            <input
              required
              name="runtime"
              type="number"
              min="1"
              max="300"
              defaultValue={editingMovie?.runtime ?? 120}
            />
          </label>
        </div>

        <fieldset>
          <legend>Watch these first</legend>
          <div className="prereq-options">
            {allMovies
              .filter((m) => m.id !== editingMovie?.id)
              .map((m) => {
                const createsCycle =
                  editingMovie && hasDependencyPath(m.id, editingMovie.id, allMovies);

                return (
                  <label
                    key={m.id}
                    style={{
                      opacity: createsCycle ? 0.45 : 1,
                      cursor: createsCycle ? 'not-allowed' : 'pointer',
                    }}
                    title={
                      createsCycle
                        ? `Cannot select: causes circular dependency (this film depends on ${editingMovie.title})`
                        : undefined
                    }
                  >
                    <input
                      type="checkbox"
                      name="prerequisites"
                      value={m.id}
                      disabled={Boolean(createsCycle)}
                      defaultChecked={editingMovie?.prerequisites.includes(m.id)}
                    />
                    <span>
                      <Icon name="check" size={12} />
                    </span>
                    {m.title}
                    {createsCycle && (
                      <em style={{ fontSize: '9px', color: 'var(--red)', marginLeft: 'auto' }}>
                        cycle
                      </em>
                    )}
                  </label>
                );
              })}
          </div>
        </fieldset>

        <div className="modal-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            CANCEL
          </button>
          <PrimaryButton type="submit">
            {isEditing ? 'SAVE CHANGES' : 'ADD TO ARCHIVE'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
