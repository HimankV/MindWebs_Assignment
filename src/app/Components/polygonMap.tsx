"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L, { LatLngExpression } from "leaflet";
import { EditControl } from "react-leaflet-draw";

interface ThresholdRule {
  operator: "<" | "<=" | "=" | ">=" | ">";
  value: number;
  color: string;
}

interface PolygonData {
  id: string;
  latlngs: LatLngExpression[];
  field: string;
  rules: ThresholdRule[];
  color: string;
  value: number;
}

interface Props {
  field: string;
  rules: ThresholdRule[];
  timeRange: [number, number];
  fetchColorsForPolygons: () => void;
  polygons: PolygonData[];
  setPolygons: React.Dispatch<React.SetStateAction<PolygonData[]>>;
}

const DEFAULT_CENTER: LatLngExpression = [28.6139, 77.209];
const DEFAULT_ZOOM = 15;
const MAX_POINTS = 12;
const MIN_POINTS = 3;

const ResetMap = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    map.dragging.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    map.touchZoom.enable();
    map.zoomControl.setPosition("bottomright");
  }, [center]);
  return null;
};

const fetchTemperatureValue = async (
  lat: number,
  lon: number,
  hour: number,
  field: string
): Promise<number> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=${field}&forecast_days=1&timezone=auto`
    );
    const data = await response.json();
    return data?.hourly?.[field]?.[hour] ?? Math.floor(Math.random() * 40);
  } catch {
    return Math.floor(Math.random() * 40);
  }
};

const PolygonMap: React.FC<Props> = ({
  field,
  rules,
  timeRange,
  polygons,
  setPolygons,
}) => {
  const [center] = useState<LatLngExpression>(DEFAULT_CENTER);
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const getColor = (value: number): string => {
    for (const rule of rules) {
      switch (rule.operator) {
        case "<":
          if (value < rule.value) return rule.color;
          break;
        case "<=":
          if (value <= rule.value) return rule.color;
          break;
        case "=":
          if (value === rule.value) return rule.color;
          break;
        case ">=":
          if (value >= rule.value) return rule.color;
          break;
        case ">":
          if (value > rule.value) return rule.color;
          break;
      }
    }
    return "gray";
  };

  const onCreated = async (e: any) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0];
    if (latlngs.length < MIN_POINTS || latlngs.length > MAX_POINTS) {
      alert("Polygon must have between 3 and 12 points");
      featureGroupRef.current?.removeLayer(layer);
      return;
    }

    const lat = latlngs[0].lat;
    const lon = latlngs[0].lng;
    const value = await fetchTemperatureValue(
      lat,
      lon,
      ((timeRange[0] % 24) + 24) % 24,
      field
    );
    const color = getColor(value);
    const id = Date.now().toString();
    layer.setStyle({ color });
    setPolygons((prev) => [
      ...prev,
      { id, latlngs, field, rules: [...rules], color, value },
    ]);
  };

  const onDeleted = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      setPolygons((prev) =>
        prev.filter(
          (p) =>
            !layer
              .getLatLngs()[0]
              .every((pt: any, i: number) => pt.equals(p.latlngs[i]))
        )
      );
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      className="w-full h-full"
      zoomControl={true}
    >
      <ResetMap center={center} />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={onCreated}
          onDeleted={onDeleted}
          draw={{
            polygon: true,
            rectangle: false,
            polyline: false,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
      {polygons.map((poly) => (
        <Polygon
          key={poly.id}
          positions={poly.latlngs}
          pathOptions={{ color: poly.color }}
        />
      ))}
    </MapContainer>
  );
};

export default PolygonMap;
