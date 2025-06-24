import React, { useMemo } from "react";
import { MuscleDiagramProps } from "./types";
import { muscleGroups } from "./muscleGroups";


export const MuscleDiagram: React.FC<MuscleDiagramProps> = ({
    allHighlightedMuscles,
    onMuscleClick,
    hoveredMuscle,
    onMuscleHover,
  }) => {
    // Create a map for quick lookup of muscle states
    const muscleStateMap = useMemo(() => {
      const map = new Map<string, { intensity: string; source: string }>();
      allHighlightedMuscles.forEach(({ muscle, intensity, source }) => {
        map.set(muscle, { intensity, source });
      });
      return map;
    }, [allHighlightedMuscles]);
  
    const getMuscleColor = (muscleKey: string, baseColor: string): string => {
      const state = muscleStateMap.get(muscleKey);
      const isHovered = hoveredMuscle === muscleKey;
  
      if (!state && !isHovered) {
        return `${baseColor}30`; // Very light when inactive
      }
  
      if (isHovered && !state) {
        return `${baseColor}60`; // Medium opacity on hover
      }
  
      if (state) {
        switch (state.intensity) {
          case "selected":
            return baseColor; // Full color for manually selected
          case "primary":
            return `${baseColor}E6`; // ~90% opacity for primary muscle in exercises
          case "secondary":
            return `${baseColor}B3`; // ~70% opacity for secondary muscle in exercises
          default:
            return `${baseColor}80`;
        }
      }
  
      return `${baseColor}80`;
    };
  
    const getMuscleStroke = (muscleKey: string, baseColor: string): { color: string; width: number } => {
      const state = muscleStateMap.get(muscleKey);
  
      if (state?.intensity === "selected") {
        return { color: baseColor, width: 3 };
      } else if (state?.intensity === "primary") {
        return { color: baseColor, width: 2.5 };
      } else if (state?.intensity === "secondary") {
        return { color: baseColor, width: 2 };
      }
  
      return { color: baseColor, width: 1 };
    };
  
    // Front view muscles
    const frontMuscles = ['chest', 'shoulders', 'biceps', 'forearms', 'abs', 'obliques', 'quads', 'calves'];
    // Back view muscles  
    const backMuscles = ['traps', 'lats', 'glutes', 'hamstrings', 'triceps', 'lowerBack'];
  
    return (
      <div className="relative p-4">
        <div className="flex gap-8 justify-center">
          {/* Front View */}
          <div className="text-center">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Front View</h3>
            <svg
              width="250"
              height="350"
              viewBox="0 0 300 420"
              className="mx-auto drop-shadow-lg"
            >
              {/* Body outline - front */}
              <path
                d="M150,40 L160,45 L170,55 L175,70 L180,85 L185,100 L190,120 L195,140 L200,160 L205,180 L210,200 L215,220 L220,240 L225,260 L220,280 L215,300 L210,320 L205,340 L200,360 L190,380 L180,395 L170,405 L160,410 L150,415 L140,410 L130,405 L120,395 L110,380 L100,360 L95,340 L90,320 L85,300 L80,280 L85,260 L90,240 L95,220 L100,200 L105,180 L110,160 L115,140 L120,120 L125,100 L130,85 L135,70 L140,55 L150,45 Z"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
                opacity="0.3"
              />
  
              {/* Front muscle groups */}
              {frontMuscles.map((key) => {
                const muscle = muscleGroups[key];
                if (!muscle) return null;
                
                const strokeInfo = getMuscleStroke(key, muscle.color);
                const state = muscleStateMap.get(key);
  
                return (
                  <g key={key}>
                    <path
                      d={muscle.svgPath}
                      fill={getMuscleColor(key, muscle.color)}
                      stroke={strokeInfo.color}
                      strokeWidth={strokeInfo.width}
                      transform={muscle.transform}
                      className="cursor-pointer transition-all duration-300 hover:brightness-110"
                      onClick={() => onMuscleClick(key)}
                      onMouseEnter={() => onMuscleHover(key)}
                      onMouseLeave={() => onMuscleHover(null)}
                    />
                    {/* Muscle label */}
                    {(state || hoveredMuscle === key) && (
                      <g>
                        <text
                          x={150}
                          y={
                            key === "chest"
                              ? 115
                              : key === "shoulders"
                                ? 60
                                : key === "biceps"
                                  ? 85
                                  : key === "abs"
                                    ? 185
                                    : key === "quads"
                                      ? 275
                                      : 370
                          }
                          textAnchor="middle"
                          className="pointer-events-none fill-gray-700 text-xs font-semibold"
                        >
                          {muscle.name}
                        </text>
                        {/* Intensity indicator */}
                        {state && state.source === "exercise" && (
                          <circle
                            cx={170}
                            cy={
                              key === "chest"
                                ? 110
                                : key === "shoulders"
                                  ? 55
                                  : key === "biceps"
                                    ? 80
                                    : key === "abs"
                                      ? 180
                                      : key === "quads"
                                        ? 270
                                        : 365
                            }
                            r={state.intensity === "primary" ? 4 : 3}
                            fill={
                              state.intensity === "primary" ? "#EF4444" : "#F59E0B"
                            }
                            className="pointer-events-none"
                          />
                        )}
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
  
          {/* Back View */}
          <div className="text-center">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Back View</h3>
            <svg
              width="250"
              height="350"
              viewBox="0 0 300 420"
              className="mx-auto drop-shadow-lg"
            >
              {/* Body outline - back */}
              <path
                d="M150,40 L160,45 L170,55 L175,70 L180,85 L185,100 L190,120 L195,140 L200,160 L205,180 L210,200 L215,220 L220,240 L225,260 L220,280 L215,300 L210,320 L205,340 L200,360 L190,380 L180,395 L170,405 L160,410 L150,415 L140,410 L130,405 L120,395 L110,380 L100,360 L95,340 L90,320 L85,300 L80,280 L85,260 L90,240 L95,220 L100,200 L105,180 L110,160 L115,140 L120,120 L125,100 L130,85 L135,70 L140,55 L150,45 Z"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
                opacity="0.3"
              />
  
              {/* Back muscle groups */}
              {backMuscles.map((key) => {
                const muscle = muscleGroups[key];
                if (!muscle) return null;
                
                const strokeInfo = getMuscleStroke(key, muscle.color);
                const state = muscleStateMap.get(key);
  
                return (
                  <g key={key}>
                    <path
                      d={muscle.svgPath}
                      fill={getMuscleColor(key, muscle.color)}
                      stroke={strokeInfo.color}
                      strokeWidth={strokeInfo.width}
                      transform={muscle.transform}
                      className="cursor-pointer transition-all duration-300 hover:brightness-110"
                      onClick={() => onMuscleClick(key)}
                      onMouseEnter={() => onMuscleHover(key)}
                      onMouseLeave={() => onMuscleHover(null)}
                    />
                    {/* Muscle label */}
                    {(state || hoveredMuscle === key) && (
                      <g>
                        <text
                          x={150}
                          y={
                            key === "traps"
                              ? 60
                              : key === "lats"
                                ? 85
                                : key === "glutes"
                                  ? 185
                                  : key === "hamstrings"
                                    ? 275
                                    : key === "triceps"
                                      ? 85
                                      : 185
                          }
                          textAnchor="middle"
                          className="pointer-events-none fill-gray-700 text-xs font-semibold"
                        >
                          {muscle.name}
                        </text>
                        {/* Intensity indicator */}
                        {state && state.source === "exercise" && (
                          <circle
                            cx={170}
                            cy={
                              key === "traps"
                                ? 55
                                : key === "lats"
                                  ? 80
                                  : key === "glutes"
                                    ? 180
                                    : key === "hamstrings"
                                      ? 270
                                      : key === "triceps"
                                        ? 80
                                        : 180
                            }
                            r={state.intensity === "primary" ? 4 : 3}
                            fill={
                              state.intensity === "primary" ? "#EF4444" : "#F59E0B"
                            }
                            className="pointer-events-none"
                          />
                        )}
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
  
        {/* Instructions and Legend */}
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            Click muscles or select exercises to see muscle activation
          </p>
  
          {/* Legend */}
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-blue-600"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-red-500"></div>
              <span>Primary Target</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-yellow-500"></div>
              <span>Secondary Target</span>
            </div>
          </div>
  
          {/* Active muscles display */}
          {allHighlightedMuscles.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {allHighlightedMuscles.map(({ muscle, intensity, source }) => (
                <span
                  key={muscle}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    intensity === "selected"
                      ? "bg-blue-100 text-blue-800"
                      : intensity === "primary"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {muscleGroups[muscle as keyof typeof muscleGroups]?.name}
                  {source === "exercise" && (
                    <span className="ml-1 text-xs opacity-75">({intensity})</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };