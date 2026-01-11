import React from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import { Button } from "@/components/ReUIComponent/Button";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import useGeolocation, { GeolocationCoordinates } from "@/hook/useGeolocation";
import { MapPin } from "lucide-react";

interface LocationRequestButtonProps {
  onLocationReceived?: (coordinates: GeolocationCoordinates) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  size?: "sm" | "default" | "lg" | "icon";
  fullWidth?: boolean;
}

const LocationRequestButton: React.FC<LocationRequestButtonProps> = ({
  onLocationReceived,
  onError,
  disabled = false,
  className = "",
  variant = "outline",
  size = "default",
  fullWidth = false,
}) => {
  const { loading, error, getCurrentLocation, clearError } = useGeolocation();
  console.log("loading", loading);

  const handleLocationRequest = async () => {
    try {
      clearError();
      const coordinates = await getCurrentLocation();

      if (onLocationReceived) {
        onLocationReceived(coordinates);
      }

      console.log("User location:", coordinates);
    } catch (err: any) {
      console.error("Location error:", err);
      if (onError) {
        onError(err.message || "Không thể lấy vị trí hiện tại");
      }
    }
  };

  return (
    <Tooltip
      title={error ? error.message : "Nhấn để lấy vị trí hiện tại của bạn"}
      arrow
    >
      <span>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || loading}
          onClick={handleLocationRequest}
          className={`text-lg ${fullWidth ? "w-full" : ""} ${className} ${
            error ? "text-red-500 border-red-500" : ""
          }`}
        >
          {loading ? (
            <CircularProgress size={28} className="mr-2" />
          ) : (
            <MapPin size={28} className="stroke-black fill-red-600 mr-2" />
          )}
          {loading ? "Đang lấy vị trí..." : "Lấy vị trí hiện tại"}
        </Button>
      </span>
    </Tooltip>
  );
};

export default LocationRequestButton;
