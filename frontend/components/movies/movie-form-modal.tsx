import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Movie } from '@/types';
import { Icon } from '@/components/icons/icon';
import { PrimaryButton } from '@/components/ui/primary-button';

const movieFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title cannot exceed 120 characters'),
  year: z
    .number()
    .int('Release year must be an integer')
    .min(1900, 'Release year must be 1900 or later')
    .max(2100, 'Release year cannot exceed 2100'),
  runtime: z
    .number()
    .int('Runtime must be an integer')
    .min(1, 'Runtime must be at least 1 minute')
    .max(300, 'Runtime cannot exceed 300 minutes'),
  prerequisites: z.array(z.number()),
});

type MovieFormValues = z.infer<typeof movieFormSchema>;

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
  const movie = movieList.find(
    (m) => m.id === fromMovieId || String(m.id) === String(fromMovieId) || String((m as any)._id) === String(fromMovieId)
  );
  if (!movie) return false;
  return movie.prerequisites.some((id) => {
    const numId = typeof id === 'number' ? id : movieList.find(m => String((m as any)._id) === String(id))?.id;
    return numId ? hasDependencyPath(numId, toMovieId, movieList) : false;
  });
}

export function MovieFormModal({
  editingMovie,
  allMovies,
  onClose,
  onSave,
}: MovieFormModalProps) {
  const isEditing = Boolean(editingMovie);
  const [error, setError] = useState<string | null>(null);

  const initialPrereqs = (editingMovie?.prerequisites || [])
    .map((p) => {
      if (typeof p === 'number') return p;
      const found = allMovies.find((m) => String((m as any)._id) === String(p));
      return found ? found.id : Number(p);
    })
    .filter((n) => !isNaN(n));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: editingMovie?.title ?? '',
      year: editingMovie?.year ?? 2024,
      runtime: editingMovie?.runtime ?? 120,
      prerequisites: initialPrereqs,
    },
  });

  const onSubmit = (values: MovieFormValues) => {
    setError(null);

    // 1. Title uniqueness check (Doc requirement: Title unique)
    const isDuplicateTitle = allMovies.some(
      (m) =>
        m.id !== editingMovie?.id &&
        m.title.trim().toLowerCase() === values.title.toLowerCase()
    );

    if (isDuplicateTitle) {
      setError(`A movie titled "${values.title}" already exists. Title must be unique.`);
      return;
    }

    // 2. Circular dependency check (Doc requirement: 409 CIRCULAR_DEPENDENCY)
    if (editingMovie) {
      for (const prereqId of values.prerequisites) {
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
      title: values.title,
      year: values.year,
      runtime: values.runtime,
      prerequisites: values.prerequisites,
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-5 bg-[#030405]/80 backdrop-blur-md" onMouseDown={onClose}>
      <form
        className="w-full max-w-135 max-h-[90vh] overflow-y-auto p-7 bg-[#15171a] border border-[#34373c] shadow-2xl"
        onSubmit={handleSubmit(onSubmit)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex gap-3.5 items-center mb-6">
          <span className="w-9.5 h-9.5 grid place-items-center bg-brand-deep text-brand-red">
            <Icon name={isEditing ? 'edit' : 'plus'} />
          </span>
          <div>
            <p className="text-brand-red text-[8px] tracking-[1.5px] font-semibold m-0 mb-1">MOVIE ARCHIVE</p>
            <h3 className="font-condensed font-semibold text-[25px] text-white m-0">{isEditing ? 'Edit movie' : 'Add a new movie'}</h3>
          </div>
        </div>

        {error && (
          <div
            className="p-2.5 px-3.5 mb-4 bg-brand-red/15 border border-brand-red rounded text-[#ff8a84] text-[11px] leading-relaxed"
          >
            {error}
          </div>
        )}

        <label className="grid gap-2 text-[#8a8e94] text-[9px] tracking-[1px] font-semibold">
          Movie title
          <input
            {...register('title')}
            placeholder="e.g. Doctor Strange"
            className="h-10.5 px-3 border border-[#34373c] bg-[#0f1113] text-white outline-none focus:border-brand-red text-[12px]"
          />
          {errors.title && (
            <span className="text-brand-red text-[10px] tracking-normal font-normal">{errors.title.message}</span>
          )}
        </label>

        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3.5 my-4">
          <label className="grid gap-2 text-[#8a8e94] text-[9px] tracking-[1px] font-semibold">
            Release year
            <input
              type="number"
              min="1900"
              max="2100"
              {...register('year', { valueAsNumber: true })}
              className="h-10.5 px-3 border border-[#34373c] bg-[#0f1113] text-white outline-none focus:border-brand-red text-[12px]"
            />
            {errors.year && (
              <span className="text-brand-red text-[10px] tracking-normal font-normal">{errors.year.message}</span>
            )}
          </label>
          <label className="grid gap-2 text-[#8a8e94] text-[9px] tracking-[1px] font-semibold">
            Runtime (minutes)
            <input
              type="number"
              min="1"
              max="300"
              {...register('runtime', { valueAsNumber: true })}
              className="h-10.5 px-3 border border-[#34373c] bg-[#0f1113] text-white outline-none focus:border-brand-red text-[12px]"
            />
            {errors.runtime && (
              <span className="text-brand-red text-[10px] tracking-normal font-normal">{errors.runtime.message}</span>
            )}
          </label>
        </div>

        <fieldset className="p-0 border-0">
          <legend className="text-[#8a8e94] text-[9px] tracking-[1px] font-semibold mb-2.5">Watch these first</legend>
          <Controller
            name="prerequisites"
            control={control}
            render={({ field }) => (
              <div className="max-h-36.25 overflow-y-auto grid grid-cols-2 max-sm:grid-cols-1 gap-1.5">
                {allMovies
                  .filter((m) => m.id !== editingMovie?.id)
                  .map((m) => {
                    const createsCycle =
                      editingMovie && hasDependencyPath(m.id, editingMovie.id, allMovies);
                    const isChecked = field.value.includes(m.id);

                    return (
                      <label
                        key={m.id}
                        className={`flex items-center gap-2 text-[#a9acb0] text-[10px] p-2 bg-[#111315] cursor-pointer ${
                          createsCycle ? 'opacity-45 cursor-not-allowed' : 'hover:bg-[#181a1d]'
                        }`}
                        title={
                          createsCycle
                            ? `Cannot select: causes circular dependency (this film depends on ${editingMovie.title})`
                            : undefined
                        }
                      >
                        <input
                          type="checkbox"
                          disabled={Boolean(createsCycle)}
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, m.id]);
                            } else {
                              field.onChange(field.value.filter((id) => id !== m.id));
                            }
                          }}
                          className="peer hidden"
                        />
                        <span className="w-4 h-4 grid place-items-center border border-[#3e4247] text-transparent peer-checked:bg-brand-dark peer-checked:border-brand-red peer-checked:text-white shrink-0">
                          <Icon name="check" size={12} />
                        </span>
                        <span className="truncate">{m.title}</span>
                        {createsCycle && (
                          <em className="text-[9px] text-brand-red ml-auto not-italic font-semibold">
                            cycle
                          </em>
                        )}
                      </label>
                    );
                  })}
              </div>
            )}
          />
        </fieldset>

        <div className="flex justify-end gap-2.5 mt-6">
          <button
            type="button"
            className="px-4 min-h-10.5 border border-[#35383d] bg-transparent text-[9px] tracking-[1px] font-semibold cursor-pointer text-white hover:border-[#666] transition-colors"
            onClick={onClose}
          >
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
