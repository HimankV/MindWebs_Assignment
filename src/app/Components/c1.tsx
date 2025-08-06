"use client";
import React, { useState } from "react";
// import Navbar from "./navbar";
import TimelineSlider from "./timelineSlider";
import DataSourceSidebar from "./dataSourceSidebar";
import PolygonMap from "./polygonMap";

interface ThresholdRule {
  operator: "<" | "<=" | "=" | ">=" | ">";
  value: number;
  color: string;
}

interface PolygonData {
  id: string;
  latlngs: any[];
  field: string;
  rules: ThresholdRule[];
  color: string;
  value: number;
}

const Page = () => {
  const [field, setField] = useState("temperature_2m");
  const [rules, setRules] = useState<ThresholdRule[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([-24, 24]);
  const [polygons, setPolygons] = useState<PolygonData[]>([]);

  const fetchColorsForPolygons = () => {
    setPolygons((prev) =>
      prev.map((poly) => {
        for (const rule of rules) {
          if (
            (rule.operator === "<" && poly.value < rule.value) ||
            (rule.operator === "<=" && poly.value <= rule.value) ||
            (rule.operator === "=" && poly.value === rule.value) ||
            (rule.operator === ">=" && poly.value >= rule.value) ||
            (rule.operator === ">" && poly.value > rule.value)
          ) {
            return { ...poly, color: rule.color };
          }
        }
        return { ...poly, color: "gray" };
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* <div className="px-4 pt-4">
        <Navbar />
      </div> */}

      {/* Timeline Slider */}
      <div className="mt-4 mb-2">
        <TimelineSlider timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      {/* Main content section now takes more height */}
      <div className="flex flex-grow gap-3 p-3" style={{ height: "90vh" }}>
        <div className="flex-shrink-0">
          <DataSourceSidebar
            field={field}
            setField={setField}
            rules={rules}
            setRules={setRules}
            fetchColorsForPolygons={fetchColorsForPolygons}
          />
        </div>
        <div className="flex-grow bg-white rounded-lg shadow-sm overflow-hidden">
          <PolygonMap
            field={field}
            rules={rules}
            timeRange={timeRange}
            polygons={polygons}
            setPolygons={setPolygons}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p
          style={{
            fontFamily: "HelveticaNeue",
            marginLeft: "50px",
            marginTop: "100px",
            fontSize: "30px",
            marginBottom: "100px",

            // fontWeight: "700",
          }}
        >
          Assignment made by - Himank Verma
        </p>
      </div>
    </div>
  );
};

export default Page;
