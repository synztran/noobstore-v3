import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { CircularProgress } from "@mui/material";

const defaultCenter = [10.7769, 106.7009]; // Default to Ho Chi Minh City

const geocodeAddress = async (address) => {
	// Use Nominatim API for geocoding
	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
		address
	)}`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		if (data && data.length > 0) {
			return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
		}
	} catch (e) {
		// fallback
	}
	return defaultCenter;
};

const LocatedMap = ({ address, label }) => {
	const mapRef = useRef(null);
	const markerRef = useRef(null);
	const containerRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let map;
		let marker;
		let popup;
		let destroyed = false;

		const initMap = async () => {
			setIsLoading(true);
			const center = await geocodeAddress(address);

			if (destroyed) return;

			if (!mapRef.current) {
				map = L.map(containerRef.current, {
					center,
					zoom: 15,
					scrollWheelZoom: false,
					zoomControl: false,
					attributionControl: false,
				});
				mapRef.current = map;

				L.tileLayer(
					"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
					{
						attribution: "",
					}
				).addTo(map);

				// Add zoom control at bottom right
				L.control
					.zoom({
						position: "bottomright",
					})
					.addTo(map);
			} else {
				map = mapRef.current;
				map.setView(center, 15);
			}

			if (markerRef.current) {
				map.removeLayer(markerRef.current);
			}

      var myIcon = L.icon({
        iconUrl: 'https://res.cloudinary.com/debnyyphn/image/upload/v1749142108/Icon_package_mns5yl.png',
        iconSize: [22, 22],
        iconAnchor: [12, 12],
        popupAnchor: [0, -15],
    });

			marker = L.marker(center, { icon: myIcon }).addTo(map);
			markerRef.current = marker;

			// Custom popup content
			popup = L.popup({
				closeButton: false,
				autoClose: false,
				closeOnClick: false,
				className: "shipping-popup !m-0",
				offset: L.point(0, -10),
			})
				.setLatLng(center)
				.setContent(
					`<div class="min-w-[220px] rounded-xl text-center">
            <div class="text-sm text-gray-700">Địa chỉ giao hàng </div>
            <div class="text-base font-semibold mt-1">${label}</div>
          </div>`
				)
				.openOn(map);

			marker.bindPopup(popup).openPopup();
			setIsLoading(false);
		};

		initMap();

		return () => {
			destroyed = true;
			if (mapRef.current) {
				mapRef.current.off();
				mapRef.current.remove();
				mapRef.current = null;
			}
			markerRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address]);

	return (
		<div className="w-full h-[220px] rounded-tl-lg rounded-tr-lg overflow-hidden relative border-[1.5px] border-gray-200">
			{isLoading && (
				<div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
					<CircularProgress size={24} />
				</div>
			)}
			<div ref={containerRef} className="w-full h-full" />
			<div className="absolute left-2 bottom-2 text-[10px] text-gray-500 bg-white/70 rounded px-1 py-0.5 flex items-center gap-0.5">
				<img
					src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_42x16dp.png"
					alt="Google"
					className="w-4 h-4"
				/>
				<span>Powered by OpenStreetMap</span>
			</div>
		</div>
	);
};

export default LocatedMap;
