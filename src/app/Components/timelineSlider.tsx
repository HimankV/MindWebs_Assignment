// components/TimelineSlider.tsx
import React from "react";
import ReactSlider from "react-slider";
import "./slider.css";

interface TimelineSliderProps {
  timeRange: [number, number];
  setTimeRange: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const formatHourLabel = (hour: number): string => {
  const day = Math.floor(hour / 24);
  const hr = Math.abs(hour % 24);
  if (hour === 0) return "Today";
  if (hour > 0) return `+${day}d ${hr}h`;
  return `-${Math.abs(day)}d ${hr}h`;
};

const TimelineSlider: React.FC<TimelineSliderProps> = ({
  timeRange,
  setTimeRange,
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="font-semibold text-gray-800 text-sm flex items-center gap-2">
          <span className="text-blue-600">⏱️</span>
          Timeline Control
        </label>
        <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
          Past 15 Days ← Today → Next 15 Days
        </div>
      </div>

      <div className="relative">
        <ReactSlider
          className="w-full h-2 bg-gradient-to-r from-gray-300 via-blue-200 to-gray-300 rounded-full shadow-inner"
          thumbClassName="slider-thumb-custom"
          trackClassName="slider-track-custom"
          min={-360}
          max={360}
          step={1}
          pearling
          minDistance={1}
          value={timeRange}
          onChange={(value) => setTimeRange(value as [number, number])}
          renderThumb={(props, state) => {
            const { key, ...rest } = props as any;
            const hour = state.valueNow;
            const isToday = hour === 0;
            const isPast = hour < 0;

            return (
              <div
                key={key}
                {...rest}
                className={`
                  w-5 h-5 rounded-full border-2 border-white cursor-grab active:cursor-grabbing
                  transform -translate-y-1/2 shadow-lg relative group
                  transition-transform duration-200 hover:scale-110
                  ${
                    isToday
                      ? "bg-gradient-to-br from-green-400 to-green-600"
                      : ""
                  }
                  ${
                    isPast
                      ? "bg-gradient-to-br from-orange-400 to-orange-600"
                      : ""
                  }
                  ${
                    !isToday && !isPast
                      ? "bg-gradient-to-br from-blue-400 to-blue-600"
                      : ""
                  }
                `}
              >
                <div
                  className={`
                    absolute -top-8 left-1/2 transform -translate-x-1/2 
                    px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                    transition-all duration-200 opacity-0 group-hover:opacity-100 
                    pointer-events-none z-10 shadow-md
                    ${
                      isToday
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-white"
                    }
                  `}
                >
                  {formatHourLabel(hour)}
                </div>
              </div>
            );
          }}
          renderTrack={(props, state) => {
            const isInRange = state.index === 1;
            return (
              <div
                {...props}
                className={`
                  h-2 rounded-full
                  ${
                    isInRange
                      ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-md"
                      : "bg-gray-200"
                  }
                `}
              />
            );
          }}
        />
      </div>

      {/* CENTERED SELECTED RANGE */}
      <div className="mt-3 flex flex-col items-center justify-center text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
          Selected Range:
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-medium text-xs">
            {formatHourLabel(timeRange[0])}
          </span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-medium text-xs">
            {formatHourLabel(timeRange[1])}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;
