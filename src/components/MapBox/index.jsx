import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

const MapBox = ({style, center, zoom, onLocationSelected}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: style, // Your MapLibre style URL
      center: center, // [lng, lat]
      zoom: zoom,
    });

    return () => {
      if (map.current) {
        map.current.remove(); // Clean up the map on unmount
        map.current = null;
      }
    };
  }, [style, center, zoom])

  const handleMapClick = (e) => {
    const { lngLat } = e;
    const latlng = { lat: lngLat.lat, lng: lngLat.lng };
    updateMarker(latlng);
    if (onLocationSelected) {
      onLocationSelected(latlng);
    }
  };

  const updateMarker = (latlng) => {
    if (marker.current) {
      marker.current.setLngLat([latlng.lng, latlng.lat]);
    } else {
      marker.current = new maplibregl.Marker().setLngLat([latlng.lng, latlng.lat]).addTo(map.current);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleSearchResultClick = (result) => {
    const { lat, lon } = result;
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lon) };
    map.current.flyTo({ center: [parseFloat(lon), parseFloat(lat)], zoom: 15 });
    updateMarker(latlng);
    if (onLocationSelected) {
      onLocationSelected(latlng);
    }
    setSearchResults();
  };

  return (
    <div>
       <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>
      {searchResults?.length > 0 && (
        <ul>
          {searchResults?.map((result) => (
            <li key={result.place_id} onClick={() => handleSearchResultClick(result)}>
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
      <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default MapBox;
