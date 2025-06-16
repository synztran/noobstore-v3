import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { useEffect, useRef, useState } from "react";

const LocationPicker = ({onLocationSelected}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // const geocoder = NodeGeocoder({
  //   provider: 'openstreetmap', // Or another provider
  // });

	useEffect(() => {
		if (!mapRef.current) {
			mapRef.current = L.map("map").setView([51.505, -0.09], 13); // Example coordinates

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      mapRef.current.on('click', handleMapClick);
		}

		return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
				mapRef.current?.remove(); // Clean up the map
				mapRef.current = null;
			}
		};
	}, []);

  const handleMapClick = (e) => {
    console.log("e", e)
    const { latlng } = e;
    setSelectedLocation(latlng);
    updateMarker(latlng);
    if (onLocationSelected) {
      onLocationSelected(latlng);
    }
  };

  const updateMarker = (latlng) => {
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
    } else {
      markerRef.current = L.marker(latlng).addTo(mapRef.current);
    }
    markerRef.current.addTo(mapRef.current); //Ensure Marker is added to map.
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
    console.log("latlng", latlng);
    mapRef.current.setView(latlng, 15);
    setSelectedLocation(latlng);
    updateMarker(latlng);
    if (onLocationSelected) {
      onLocationSelected(latlng);
    }
    setSearchResults([]);
  };

	return (
		<div>
			<label htmlFor="location">Pick a location:</label>
      <div id="map" style={{ height: "500px", width: "100%" }}/>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result) => (
            <li key={result.display_name} onClick={() => handleSearchResultClick(result)}>
              {result.display_name}
            </li>
          ))}
        </ul>
      )}

			{/* <p>Selected Location: {location}</p> */}
		</div>
	);
};

export default LocationPicker;
