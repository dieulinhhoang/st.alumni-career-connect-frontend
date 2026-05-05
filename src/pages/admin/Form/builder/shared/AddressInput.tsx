import React, { useRef, useEffect } from "react";
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = "Nhập địa chỉ của bạn",
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState(value);
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handlePlaceSelect = (selectedPlace: any) => {

    if (selectedPlace && selectedPlace.properties) {
      const props = selectedPlace.properties;

      const phuongXa = props.suburb || props.city_district || props.district || "";

      const tinhTp = props.state || props.city || "";

      let customLabel = "";
      if (phuongXa && tinhTp) {
        customLabel = `${phuongXa}, ${tinhTp}`;
      } else {

        customLabel = props.formatted || "";
      }

      setInputValue(customLabel);
      onChange(customLabel);
      setIsOpen(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setIsOpen(true);

  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!wrapperRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        if (!inputValue.trim()) {
          setInputValue(value);
        }
      }
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <GeoapifyContext apiKey={import.meta.env.VITE_API_GEOAPIFY_KEY || ""}>
        <GeoapifyGeocoderAutocomplete
          value={inputValue}
          placeholder={placeholder}
          lang="vi"
          filterByCountryCode={["vn"]}
          limit={7}
          placeSelect={handlePlaceSelect}
          onInputChange={handleInputChange}
          onBlur={handleBlur}
        />
      </GeoapifyContext>
    </div>
  );
};