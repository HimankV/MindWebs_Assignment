"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// dynamically import components that depend on 'window'
const TimelineSlider = dynamic(() => import("./timelineSlider"), {
  ssr: false,
});
const PolygonMap = dynamic(() => import("./polygonMap"), { ssr: false });

import DataSourceSidebar from "./dataSourceSidebar";
import Navbar from "./navbar";

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
      {/* <div className="px-4 pt-4"><Navbar /></div> */}

      <div className="mt-4 mb-2">
        <TimelineSlider timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

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
            fetchColorsForPolygons={fetchColorsForPolygons}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <p
          style={{
            fontFamily: "HelveticaNeue",
            marginLeft: "50px",
            marginTop: "50px",
            fontSize: "30px",
          }}
        >
          Assignment made by - Himank Verma
        </p>
      </div>
    </div>
  );
};

export default Page;
