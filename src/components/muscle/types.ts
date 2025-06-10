// Type definitions
export interface MuscleGroup {
  id: string;
  name: string;
  color: string;
  svgPath: string;
  transform?: string;
}

export interface Exercise {
  id: string;
  name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  duration: string;
}

export interface MuscleState {
  muscle: string;
  intensity: "selected" | "primary" | "secondary";
  source: "manual" | "exercise";
}

export interface MuscleDiagramProps {
  allHighlightedMuscles: MuscleState[];
  onMuscleClick: (muscleId: string) => void;
  hoveredMuscle: string | null;
  onMuscleHover: (muscleId: string | null) => void;
}

export interface ExerciseCardProps {
  exercise: Exercise;
  isSelected: boolean;
  onSelect: (exerciseId: string) => void;
}
