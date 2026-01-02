import React, { useEffect, useRef, useState } from "react";
import useGoogleMaps from "../hooks/useGoogleMaps";
import { API } from "../api/client";
import { useParams } from "react-router-dom";

export default function OrderTracking() {
  const { id } = useParams();
  const apiKey = import.meta.env.VITE_GOOGLE_MAP_KEY;
  const loaded = useGoogleMaps(apiKey);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [status, setStatus] = useState("PLACED");

  useEffect(() => {
    if (!loaded) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: 13.0827, lng: 80.2707 }
    });
    markerRef.current = new window.google.maps.Marker({
      map: mapInstance.current,
      position: { lat: 13.0827, lng: 80.2707 },
      title: "Delivery Partner"
    });
  }, [loaded]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API}/orders/track/${id}`);
        const data = await res.json();
        if (res.ok) {
          const { lat, lng, status } = data;
          setStatus(status);
          if (markerRef.current && mapInstance.current) {
            markerRef.current.setPosition({ lat, lng });
            mapInstance.current.setCenter({ lat, lng });
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-2">Order Tracking</h1>
      <p className="text-sm text-gray-500 mb-3">Order ID: {id}</p>
      <p className="text-sm mb-2">
        Status: <span className="font-semibold">{status}</span>
      </p>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "380px", borderRadius: "1rem" }}
        className="card"
      />
      <iframe
  width="100%"
  height="300"
  loading="lazy"
  src={`https://www.google.com/maps?q=
  ${order.deliveryAddress.location.lat},
  ${order.deliveryAddress.location.lng}
  &output=embed`}
/>

    </div>
  );
}
