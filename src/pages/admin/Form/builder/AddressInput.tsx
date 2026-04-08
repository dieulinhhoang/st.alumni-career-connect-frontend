import React, { useCallback, useEffect } from "react";

interface AddressSuggestion {
    lat : string; // vĩ độ
    lng : string; // kinh độ
    label : string;
}

interface AddressInputProps {
    value : string
    onChange:(value : string) => void;
    placeholder?: string;
  }

 export const AddressInput : React.FC<AddressInputProps>=({
    value,
    onChange,
    placeholder = "Nhập địa chỉ của bạn",
 }) => {
    const [suggestions, setSuggestions] = React.useState<AddressSuggestion[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    // an khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event : MouseEvent) =>{
           if (wrapperRef.current && ! wrapperRef.current.contains(event.target as Node) )
           {
             setShowSuggestions(false) 
        
           }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

},[]);
    //  tránh gọi api nhiều 
    // func là hàm gọi api , delay là timeout 
    const debounce = (func : (...args :any[]) => void, delay : number) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args : any[]) => { // khi có bất kỳ thay đổi nào trong input thì sẽ clear timeout cũ và tạo timeout mới , nếu trong khoảng delay mà có thay đổi mới thì sẽ không gọi api cũ nữa mà sẽ gọi api mới sau delay
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    // call api 
    const fetchSuggestions = useCallback(
        debounce(async (query : string) => {
            if (!query) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
            setIsLoading(true);
            try {
                const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=vi`;
                const response = await  fetch(url);
                if (!response.ok) {
                    throw new Error(`API Error ${response.status}`);
                }
                const data = await response.json();
                if (data && data.features) {
                    const formattedSuggestions = data.features.map((feature : any) => ({
                        lat: feature.geometry.coordinates[1],
                        lng: feature.geometry.coordinates[0],
                        label: feature.properties.name || feature.properties.street || 
                          `${feature.properties.city || ''} ${feature.properties.country || ''}`.trim(),
                    }));
                    setSuggestions(formattedSuggestions);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setIsLoading(false);
            }
        }, 500),  []
    );
    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        fetchSuggestions(newValue);
    };

    const handleSuggestionClick = (suggestion : AddressSuggestion) => {
        onChange(suggestion.label);
        setShowSuggestions(false);
    };
    return (
        <div ref={wrapperRef} style={{ position: "relative" }}>
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
            />
            {isLoading && <div>Đang tải...</div>}
            {showSuggestions && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "white", border: "1px solid #ccc", zIndex: 1000 }}>
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{ padding: "10px", cursor: "pointer" }}
                        >
                            {suggestion.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    };