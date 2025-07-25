import { ChevronDownIcon, XIcon } from "lucide-react";
import { useState, KeyboardEvent, ChangeEvent, useEffect, useRef } from "react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AutocompleteInput({
  data = [],
  text,
  place = '',
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
  loading = false,
  noOptionsMessage = 'No options available',
}) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Convert data to normalized array format
  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object') {
      // Handle case where data is an object with a data property
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      // Handle plain object case (key-value pairs)
      return Object.entries(data).map(([value, label]) => ({ 
        value, 
        label: typeof label === 'object' ? JSON.stringify(label) : String(label) 
      }));
    }
    return [];
  };

  const normalizedData = normalizeData(data);

  // Update input value when value prop changes
  useEffect(() => {
    if (value === null || value === undefined) {
      setInputValue("");
      return;
    }
    
    const selectedItem = normalizedData.find(item => String(item.value) === String(value));
    setInputValue(selectedItem?.label || String(value));
  }, [value, normalizedData]);

  // Filter suggestions based on input
  useEffect(() => {
    if (!inputValue) {
      setFilteredSuggestions(normalizedData);
      return;
    }

    const filtered = normalizedData.filter(item =>
      String(item.label).toLowerCase().includes(inputValue.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setActiveSuggestionIndex(0);
  }, [inputValue, normalizedData]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setInputValue(userInput);
    setError("");
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (item) => {
    setInputValue(item.label);
    onChange(item.value);
    setShowSuggestions(false);
    setError("");
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      if (!showSuggestions) return;
      
      setShowSuggestions(false);
      
      if (inputValue === "") {
        if (required) setError("This field is required");
        onChange(undefined);
        return;
      }
      
      const match = normalizedData.find(
        item => item.label.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (match) {
        onChange(match.value);
      } else if (required) {
        setError("Please select a valid option from the list");
        onChange(undefined);
      }
    }, 200);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (filteredSuggestions.length > 0) {
          const selectedItem = filteredSuggestions[activeSuggestionIndex];
          setInputValue(selectedItem.label);
          onChange(selectedItem.value);
          setShowSuggestions(false);
          setError("");
        } else if (required && inputValue) {
          setError("Please select a valid option from the list");
          onChange(undefined);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (activeSuggestionIndex > 0) {
          setActiveSuggestionIndex(activeSuggestionIndex - 1);
          scrollActiveIntoView();
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (activeSuggestionIndex < filteredSuggestions.length - 1) {
          setActiveSuggestionIndex(activeSuggestionIndex + 1);
          scrollActiveIntoView();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const scrollActiveIntoView = () => {
    const activeElement = document.getElementById(
      `suggestion-${filteredSuggestions[activeSuggestionIndex]?.value}`
    );
    activeElement?.scrollIntoView({ block: 'nearest' });
  };

  const handleClear = () => {
    if (!disabled) {
      setInputValue("");
      onChange(undefined);
      setError("");
      setFilteredSuggestions(normalizedData);
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const toggleSuggestions = () => {
    if (disabled) return;
    setShowSuggestions(prev => !prev);
    if (!showSuggestions) {
      inputRef.current?.focus();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Label 
        htmlFor="autocomplete-input" 
        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="autocomplete-input"
          type={type}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          placeholder={place}
          disabled={disabled || loading}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-controls="autocomplete-suggestions"
          aria-activedescendant={
            showSuggestions && filteredSuggestions.length > 0 
              ? `suggestion-${filteredSuggestions[activeSuggestionIndex]?.value}`
              : undefined
          }
          className={`w-full pr-10 transition-all duration-200 ${
            error 
              ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
              : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          } ${
            disabled || loading 
              ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed" 
              : "bg-white dark:bg-gray-900 cursor-text"
          } rounded-lg shadow-sm`}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {inputValue && !disabled && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear input"
              disabled={disabled || loading}
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          ) : (
            <button
              type="button"
              onClick={toggleSuggestions}
              className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-transform ${
                showSuggestions ? "rotate-180" : ""
              }`}
              aria-label={showSuggestions ? "Hide suggestions" : "Show suggestions"}
              aria-haspopup="listbox"
              disabled={disabled || loading}
            >
              <ChevronDownIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {showSuggestions && isFocused && (
        <ul
          id="autocomplete-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-opacity duration-200"
        >
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item, index) => (
              <li
                key={`${item.label}-${item.value}`}
                id={`suggestion-${item.value}`}
                role="option"
                aria-selected={index === activeSuggestionIndex}
                onMouseDown={() => handleSuggestionClick(item)}
                className={`relative cursor-default select-none py-2 pl-3 pr-9 transition-colors ${
                  index === activeSuggestionIndex 
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100" 
                    : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {item.label}
                {index === activeSuggestionIndex && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
                    ✓
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500 dark:text-gray-400">
              {noOptionsMessage}
            </li>
          )}
        </ul>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
          <span className="mr-1">⚠</span> {error}
        </p>
      )}
    </div>
  );
}