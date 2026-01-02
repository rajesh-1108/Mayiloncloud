import { useEffect, useState } from "react";

export default function useGoogleMaps(apiKey) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [apiKey]);

  return loaded;
}
