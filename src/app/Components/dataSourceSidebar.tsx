import React from "react";

interface ThresholdRule {
  operator: "<" | "<=" | "=" | ">=" | ">";
  value: number;
  color: string;
}

interface Props {
  rules: ThresholdRule[];
  setRules: React.Dispatch<React.SetStateAction<ThresholdRule[]>>;
  field: string;
  setField: React.Dispatch<React.SetStateAction<string>>;
  fetchColorsForPolygons: () => void;
}

const DataSourceSidebar: React.FC<Props> = ({
  rules,
  setRules,
  field,
  setField,
  fetchColorsForPolygons,
}) => {
  const addRule = () => {
    setRules([...rules, { operator: "<", value: 10, color: "#ff0000" }]);
  };

  const updateRule = (index: number, key: keyof ThresholdRule, value: any) => {
    const newRules = [...rules];
    newRules[index][key] = value;
    setRules(newRules);
  };

  const deleteRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-200 p-6 space-y-6">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">📊</span>
          Data Source
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Configure your data parameters
        </p>
      </div>

      {/* Field Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Data Field
        </label>
        <input
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
          placeholder="e.g. temperature_2m"
        />
      </div>

      {/* Threshold Rules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Threshold Rules
          </h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {rules.length} rule{rules.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-2">
                {/* Operator Select */}
                <select
                  value={rule.operator}
                  onChange={(e) => updateRule(idx, "operator", e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {["<", "<=", "=", ">=", ">"].map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>

                {/* Value Input */}
                <input
                  type="number"
                  value={rule.value}
                  onChange={(e) => updateRule(idx, "value", +e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Color Picker */}
                <div className="relative">
                  <input
                    type="color"
                    value={rule.color}
                    onChange={(e) => updateRule(idx, "color", e.target.value)}
                    className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <div
                    className="absolute inset-0 rounded-md border-2 border-white pointer-events-none"
                    style={{ backgroundColor: rule.color }}
                  ></div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteRule(idx)}
                  className="ml-auto w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-sm font-bold transition-colors duration-200"
                  title="Delete rule"
                >
                  ×
                </button>
              </div>

              {/* Rule Preview */}
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: rule.color }}
                ></div>
                If value {rule.operator} {rule.value}
              </div>
            </div>
          ))}
        </div>

        {/* Add Rule Button */}
        <button
          onClick={addRule}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <span className="text-lg">+</span>
          Add New Rule
        </button>
      </div>

      {/* Apply Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={fetchColorsForPolygons}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          🎨 Apply to Polygons
        </button>
      </div>
    </div>
  );
};

export default DataSourceSidebar;
