import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import useGoogleMaps from "../hooks/useGoogleMaps";


export default function DeliveryTracking({ orderId, apiKey }) {
const mapRef = useRef(null);
const markerRef = useRef(null);
const mapInstance = useRef(null);
const loaded = useGoogleMaps(apiKey);


const [driverLocation, setDriverLocation] = useState(null);


useEffect(() => {
if (!loaded) return;


mapInstance.current = new window.google.maps.Map(mapRef.current, {
zoom: 14,
center: { lat: 13.0827, lng: 80.2707 }, // Chennai default
});


markerRef.current = new window.google.maps.Marker({
map: mapInstance.current,
position: { lat: 13.0827, lng: 80.2707 },
title: "Delivery Partner",
});
}, [loaded]);


// Poll driver location from server every 5 sec
useEffect(() => {
if (!orderId) return;


const interval = setInterval(async () => {
try {
const res = await axios.get(`http://localhost:5000/api/orders/track/${orderId}`);
const { lat, lng } = res.data;
setDriverLocation({ lat, lng });


if (markerRef.current && mapInstance.current) {
markerRef.current.setPosition({ lat, lng });
mapInstance.current.setCenter({ lat, lng });
}
} catch (error) {
console.error("Tracking error", error);
}
}, 5000);


return () => clearInterval(interval);
}, [orderId]);


return (
<div>
<h2>Delivery Live Tracking</h2>
<div
ref={mapRef}
style={{ width: "100%", height: "400px", borderRadius: "10px" }}
></div>
</div>
);
}