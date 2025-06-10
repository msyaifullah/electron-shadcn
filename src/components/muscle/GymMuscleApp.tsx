import React, { useMemo, useState } from "react";
import { Search, Dumbbell } from "lucide-react";
import { MuscleDiagram } from "./MuscleDiagram";
import { ExerciseCard } from "./ExerciseCard";
import { exercises } from "./exercises";
import { muscleGroups } from "./muscleGroups";
import { MuscleState, Exercise } from "./types";

const GymMuscleApp: React.FC = () => {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  // Calculate muscles affected by selected exercises
  const musclesAffectedByExercises = useMemo(() => {
    const affectedMuscles = new Set<{
      muscle: string;
      intensity: "primary" | "secondary";
    }>();

    selectedExercises.forEach((exerciseId) => {
      // Find the exercise across all muscle groups
      Object.values(exercises).forEach((muscleExercises) => {
        const exercise = muscleExercises.find((ex) => ex.id === exerciseId);
        if (exercise) {
          // Add primary muscles (with higher intensity)
          exercise.primaryMuscles.forEach((muscle) => {
            const muscleKey = muscle
              .toLowerCase()
              .replace("triceps", "triceps")
              .replace("latissimus dorsi", "lats")
              .replace("trapezius", "traps")
              .replace("lower back", "lowerBack")
              .replace("quadriceps", "quads")
              .replace("abs", "abs")
              .replace("chest", "chest")
              .replace("shoulders", "shoulders")
              .replace("biceps", "biceps")
              .replace("forearms", "forearms")
              .replace("obliques", "obliques")
              .replace("calves", "calves")
              .replace("glutes", "glutes")
              .replace("hamstrings", "hamstrings");
            if (muscleGroups[muscleKey as keyof typeof muscleGroups]) {
              affectedMuscles.add({ muscle: muscleKey, intensity: "primary" });
            }
          });

          // Add secondary muscles (with lower intensity)
          exercise.secondaryMuscles.forEach((muscle) => {
            const muscleKey = muscle
              .toLowerCase()
              .replace("triceps", "triceps")
              .replace("latissimus dorsi", "lats")
              .replace("trapezius", "traps")
              .replace("lower back", "lowerBack")
              .replace("quadriceps", "quads")
              .replace("abs", "abs")
              .replace("chest", "chest")
              .replace("shoulders", "shoulders")
              .replace("biceps", "biceps")
              .replace("forearms", "forearms")
              .replace("obliques", "obliques")
              .replace("calves", "calves")
              .replace("glutes", "glutes")
              .replace("hamstrings", "hamstrings")
              .replace("core", "abs")
              .replace("back", "lowerBack");
            if (muscleGroups[muscleKey as keyof typeof muscleGroups]) {
              affectedMuscles.add({
                muscle: muscleKey,
                intensity: "secondary",
              });
            }
          });
        }
      });
    });

    return Array.from(affectedMuscles);
  }, [selectedExercises]);

  // Combine manually selected muscles with exercise-affected muscles
  const allHighlightedMuscles = useMemo(() => {
    const combined = new Map<string, MuscleState>();

    // Add manually selected muscles
    selectedMuscles.forEach((muscle) => {
      combined.set(muscle, { muscle, intensity: "selected", source: "manual" });
    });

    // Add exercise-affected muscles (don't override manual selections)
    musclesAffectedByExercises.forEach(({ muscle, intensity }) => {
      if (!combined.has(muscle)) {
        combined.set(muscle, { muscle, intensity, source: "exercise" });
      }
    });

    return Array.from(combined.values());
  }, [selectedMuscles, musclesAffectedByExercises]);

  const handleMuscleClick = (muscleId: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscleId)
        ? prev.filter((id) => id !== muscleId)
        : [...prev, muscleId],
    );
  };

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    );
  };

  const filteredExercises = useMemo(() => {
    const allExercises: Exercise[] = [];

    if (selectedMuscles.length === 0) {
      // Show all exercises if no muscles selected
      Object.values(exercises).forEach((muscleExercises) => {
        allExercises.push(...muscleExercises);
      });
    } else {
      // Show exercises for selected muscles
      selectedMuscles.forEach((muscle) => {
        if (exercises[muscle]) {
          allExercises.push(...exercises[muscle]);
        }
      });
    }

    // Remove duplicates and filter by search term
    const uniqueExercises = allExercises.filter(
      (exercise, index, self) =>
        index === self.findIndex((e) => e.id === exercise.id),
    );

    return uniqueExercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.primaryMuscles.some((muscle) =>
          muscle.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  }, [selectedMuscles, searchTerm]);

  return (
    <div className="min-h-screen">
      <div className="px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Panel - Muscle Diagram */}
          <div className="space-y-6">
            <div className="">
              <h2 className="mb-4 text-center text-xl font-bold">
                Select Target Muscles
              </h2>
              <MuscleDiagram
                allHighlightedMuscles={allHighlightedMuscles}
                onMuscleClick={handleMuscleClick}
                hoveredMuscle={hoveredMuscle}
                onMuscleHover={setHoveredMuscle}
              />
            </div>

            {selectedExercises.length > 0 && (
              <div className="p-6">
                <h3 className="mb-4 text-lg font-bold">
                  Selected Workout ({selectedExercises.length} exercises)
                </h3>

                {/* Muscle activation summary */}
                {musclesAffectedByExercises.length > 0 && (
                  <div className="mb-4 rounded-lg border p-4">
                    <h4 className="mb-2 text-sm font-semibold">
                      Muscles Targeted:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {musclesAffectedByExercises.map(
                        ({ muscle, intensity }) => (
                          <span
                            key={muscle}
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              intensity === "primary"
                                ? "border border-red-200 bg-red-100 text-red-800"
                                : "border border-yellow-200 bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {
                              muscleGroups[muscle as keyof typeof muscleGroups]
                                ?.name
                            }{" "}
                            ({intensity})
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedExercises.map((exerciseId) => {
                    const exercise = filteredExercises.find(
                      (e) => e.id === exerciseId,
                    );
                    return exercise ? (
                      <div
                        key={exerciseId}
                        className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-blue-800">
                            {exercise.name}
                          </span>
                          <div className="mt-1 text-xs text-blue-600">
                            Primary: {exercise.primaryMuscles.join(", ")}
                            {exercise.secondaryMuscles.length > 0 && (
                              <span className="ml-2">
                                • Secondary:{" "}
                                {exercise.secondaryMuscles.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleExerciseSelect(exerciseId)}
                          className="ml-3 text-lg font-bold text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Exercise List */}
          <div className="space-y-6">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Available Exercises ({filteredExercises.length})
                </h2>
                {selectedMuscles.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedMuscles([]);
                      setSelectedExercises([]);
                    }}
                    className="text-sm font-medium"
                  >
                    Clear All Selections
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Exercise Cards */}
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {filteredExercises.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <Dumbbell className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>
                      No exercises found. Try selecting different muscles or
                      adjusting your search.
                    </p>
                  </div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      isSelected={selectedExercises.includes(exercise.id)}
                      onSelect={handleExerciseSelect}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymMuscleApp;
