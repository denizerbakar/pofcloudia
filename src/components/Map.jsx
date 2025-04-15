import { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";

export default function Map({ letters = [], setSelectedLetter }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const center = { lng: 11.5761, lat: 48.1372 }; // Munich
  const zoom = 2;

  maptilersdk.config.apiKey = "aZSUGRkgiMfTxwGUazYR"; // Replace with your actual key

  useEffect(() => {
    if (map.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.BASIC,
      center: [center.lng, center.lat],
      zoom: zoom,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;

    letters
      .filter((l) => l.coords?.lat && l.coords?.lng)
      .forEach((l) => {
        const marker = new maptilersdk.Marker({ color: "#6D28D9" })
          .setLngLat([l.coords.lng, l.coords.lat])
          .addTo(map.current);

          marker.getElement().addEventListener("click", () => {
            map.current.flyTo({
              center: [l.coords.lng, l.coords.lat],
              zoom: 12,
              speed: 2.2,
              curve: 1.5,
              easing: (t) => t
            });
          
            setSelectedLetter(l);
          });
      });
  }, [letters, setSelectedLetter]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
