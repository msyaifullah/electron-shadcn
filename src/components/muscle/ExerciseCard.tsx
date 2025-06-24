import React from "react";
import { Dumbbell, Target, Clock, BarChart3 } from "lucide-react";
import { ExerciseCardProps } from "./types";


export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isSelected, onSelect }) => {
    const getDifficultyColor = (difficulty: string): string => {
      switch (difficulty) {
        case "beginner":
          return "text-green-600 bg-green-100";
        case "intermediate":
          return "text-yellow-600 bg-yellow-100";
        case "advanced":
          return "text-red-600 bg-red-100";
        default:
          return "text-gray-600 bg-gray-100";
      }
    };
  
    return (
      <div
        className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-lg ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200"
        }`}
        onClick={() => onSelect(exercise.id)}
      >
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{exercise.name}</h3>
          <Dumbbell
            className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-gray-400"}`}
          />
        </div>
  
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Primary: {exercise.primaryMuscles.join(", ")}
            </span>
          </div>
  
          {exercise.secondaryMuscles.length > 0 && (
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                Secondary: {exercise.secondaryMuscles.join(", ")}
              </span>
            </div>
          )}
  
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{exercise.duration}</span>
            </div>
  
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}
              >
                {exercise.difficulty}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                {exercise.equipment}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
