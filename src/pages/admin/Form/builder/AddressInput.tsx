import React, { useRef, useEffect } from 'react';
import { GeoapifyContext, GeoapifyGeocoderAutocomplete } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

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

    // Đồng bộ value từ prop khi nó thay đổi từ bên ngoài
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Xử lý khi chọn một địa chỉ từ gợi ý
    const handlePlaceSelect = (selectedPlace: any) => {
        console.log("Selected place properties:", selectedPlace?.properties); // Debug: xem cấu trúc

        if (selectedPlace && selectedPlace.properties) {
            const props = selectedPlace.properties;
            
            // Lấy phường/xã: ưu tiên suburb, nếu không thì city_district hoặc district
            const phuongXa = props.suburb || props.city_district || props.district || '';
            // Lấy tỉnh/thành phố: ưu tiên state, nếu không thì city
            const tinhTp = props.state || props.city || '';
            
            let customLabel = '';
            if (phuongXa && tinhTp) {
                customLabel = `${phuongXa}, ${tinhTp}`;
            } else {
                // Fallback: dùng formatted nếu thiếu thông tin
                customLabel = props.formatted || '';
            }
            
            setInputValue(customLabel);
            onChange(customLabel);
            setIsOpen(false);
        }
    };

    // Xử lý khi input thay đổi (người dùng gõ)
    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);
        setIsOpen(true);
        // Không gọi onChange ở đây vì chưa chọn địa chỉ chính thức
    };

    // Xử lý khi blur khỏi input
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

    // Xử lý click ra ngoài component để đóng dropdown
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
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <GeoapifyContext apiKey="65eab6584b85425eb2a2bcd30489064e">
                <GeoapifyGeocoderAutocomplete
                    value={inputValue}
                    placeholder={placeholder}
                    lang="vi"
                    filterByCountryCode={['vn']}
                    limit={7}
                    placeSelect={handlePlaceSelect}
                    onInputChange={handleInputChange}
                    onBlur={handleBlur}
                />
            </GeoapifyContext>
        </div>
    );
};