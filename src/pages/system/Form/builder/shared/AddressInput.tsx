import React, { useRef, useEffect, useState } from "react";
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = "Nhập địa chỉ của bạn",
  disabled = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handlePlaceSelect = (selectedPlace: any) => {
    if (!selectedPlace?.properties) return;
    const props = selectedPlace.properties;
    const phuongXa = props.suburb || props.city_district || props.district || "";
    const tinhTp   = props.state || props.city || "";
    const label    = phuongXa && tinhTp
      ? `${phuongXa}, ${tinhTp}`
      : (props.formatted || "");
    setInputValue(label);
    onChange(label);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!wrapperRef.current?.contains(document.activeElement) && !inputValue.trim()) {
        setInputValue(value);
      }
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        // just close dropdown — library handles it
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (disabled) {
    return (
      <div style={{
        width: '100%', border: '1px solid #e2e8f0', borderRadius: 8,
        padding: '10px 14px', fontSize: 14, fontFamily: 'inherit',
        background: '#f8fafc', color: '#1e293b',
      }}>
        {value || <span style={{ color: '#94a3b8' }}>{placeholder}</span>}
      </div>
    );
  }

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
