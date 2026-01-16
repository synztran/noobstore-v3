import { useState } from "react";
import { Map, MapControls } from "../ShadCNComponent/MapCN/mapcn";

interface IProps {
	address: string;
}

const SimpleMap = ({ address }: IProps) => {
	// const geocodeAddress = useGeocodeAddress();
	const [coords] = useState<{
		latitude: number;
		longitude: number;
	}>({
		latitude: 10.833233,
		longitude: 106.722542,
	});

	// useEffect(() => {
	// 	// Geocode the address and center map on it
	// 	geocodeAddress(address).then((coords) => {
	// 		console.log(coords);
	// 		if (coords) {
	// 			setCoords({
	// 				latitude: coords?.lat,
	// 				longitude: coords?.lng,
	// 			});
	// 		}
	// 	});
	// }, [address, geocodeAddress]);

	return (
		<div className="h-40 p-0 overflow-hidden border border-gray-200 rounded-lg">
			<Map center={[coords.longitude, coords.latitude]} zoom={10}>
				<MapControls showZoom={false} showLocate={false} />
			</Map>
		</div>
	);
};
export default SimpleMap;
