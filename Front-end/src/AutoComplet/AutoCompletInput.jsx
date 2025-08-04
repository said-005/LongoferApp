import { ChevronDownIcon, XIcon, Loader2, CheckIcon } from "lucide-react";
import { 
  useState, 
  KeyboardEvent, 
  ChangeEvent, 
  useEffect, 
  useRef, 
  useMemo, 
  useCallback 
} from "react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from "../lib/utils";
import { useDebounce } from "./useDebouncyHook";

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
  className = '',
  inputClassName = '',
  dropdownClassName = ''
}) {
  // Refs
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);
  const ariaLiveRef = useRef(null);
  
  // State
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  
  // Generate unique IDs for accessibility
  const inputId = useMemo(() => `autocomplete-input-${Math.random().toString(36).substr(2, 9)}`, []);
  const listboxId = useMemo(() => `autocomplete-listbox-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Normalize data
  const normalizedData = useMemo(() => {
    if (Array.isArray(data)) {
      return data.map(item => ({
        value: String(item.value ?? item),
        label: String(item.label ?? item)
      }));
    }
    
    if (data && typeof data === 'object') {
      if (data.data && Array.isArray(data.data)) {
        return data.data.map(item => ({
          value: String(item.value ?? item),
          label: String(item.label ?? item)
        }));
      }
      return Object.entries(data).map(([value, label]) => ({ 
        value, 
        label: typeof label === 'object' ? JSON.stringify(label) : String(label) 
      }));
    }
    
    return [];
  }, [data]);

  // Debounced input value for filtering
  const debouncedInputValue = useDebounce(inputValue, 300);

  // Filter suggestions
  const getFilteredSuggestions = useCallback((input, data) => {
    if (!input) return data;
    return data.filter(item =>
      String(item.label).toLowerCase().includes(input.toLowerCase())
    );
  }, []);

  // Update filtered suggestions
  useEffect(() => {
    setInternalLoading(true);
    const timer = setTimeout(() => {
      setFilteredSuggestions(getFilteredSuggestions(debouncedInputValue, normalizedData));
      setActiveSuggestionIndex(0); // Reset active index when suggestions change
      setInternalLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [debouncedInputValue, normalizedData, getFilteredSuggestions]);

  // Sync input value with external value
  useEffect(() => {
    if (value === null || value === undefined) {
      setInputValue("");
      return;
    }
    
    const selectedItem = normalizedData.find(item => String(item.value) === String(value));
    setInputValue(selectedItem?.label || String(value));
  }, [value, normalizedData]);

  // Announce filtered results count for screen readers
  useEffect(() => {
    if (!ariaLiveRef.current || !showSuggestions) return;
    
    const message = filteredSuggestions.length > 0 
      ? `${filteredSuggestions.length} suggestions available`
      : noOptionsMessage;
      
    ariaLiveRef.current.textContent = message;
  }, [filteredSuggestions, noOptionsMessage, showSuggestions]);

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

  // Handle suggestion selection
  const selectSuggestion = useCallback((item) => {
    setInputValue(item.label);
    onChange(item.value);
    setShowSuggestions(false);
    setError("");
    inputRef.current?.focus();
  }, [onChange]);

  // Event handlers
  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setInputValue(userInput);
    setError("");
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (item) => {
    selectSuggestion(item);
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
        selectSuggestion(match);
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
          selectSuggestion(filteredSuggestions[activeSuggestionIndex]);
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
        } else if (filteredSuggestions.length === 0) {
          setShowSuggestions(true);
        }
        break;
        
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
        
      case "Tab":
        if (showSuggestions && filteredSuggestions.length > 0) {
          e.preventDefault();
          selectSuggestion(filteredSuggestions[activeSuggestionIndex]);
        }
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

  // Combined loading state
  const isLoading = loading || internalLoading;

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <Label 
        htmlFor={inputId}
        className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {text}
       
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          id={inputId}
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
          aria-controls={listboxId}
          aria-activedescendant={
            showSuggestions && filteredSuggestions.length > 0 
              ? `suggestion-${filteredSuggestions[activeSuggestionIndex]?.value}`
              : undefined
          }
          className={cn(
            "w-full pr-10 transition-all duration-200 rounded-lg shadow-sm",
            {
              "border-red-500 focus:ring-red-500 focus:border-red-500": error,
              "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500": !error,
              "bg-gray-100 dark:bg-gray-800 cursor-not-allowed": disabled || loading,
              "bg-white dark:bg-gray-900 cursor-text": !disabled && !loading
            },
            inputClassName
          )}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {inputValue && !disabled && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear input"
              disabled={disabled || isLoading}
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          ) : (
            <button
              type="button"
              onClick={toggleSuggestions}
              className={cn(
                "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-transform",
                { "rotate-180": showSuggestions }
              )}
              aria-label={showSuggestions ? "Hide suggestions" : "Show suggestions"}
              aria-haspopup="listbox"
              disabled={disabled || isLoading}
            >
              <ChevronDownIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* ARIA live region for accessibility announcements */}
      <div
        ref={ariaLiveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {showSuggestions && isFocused && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          className={cn(
            "absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-opacity duration-200",
            dropdownClassName
          )}
        >
          {isLoading ? (
            <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
              Loading...
            </li>
          ) : filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item, index) => (
              <li
                key={`${item.label}-${item.value}`}
                id={`suggestion-${item.value}`}
                role="option"
                aria-selected={index === activeSuggestionIndex}
                onClick={() => handleSuggestionClick(item)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur before click
                className={cn(
                  "relative cursor-default select-none py-2 pl-3 pr-9 transition-colors",
                  {
                    "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100": 
                      index === activeSuggestionIndex,
                    "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700": 
                      index !== activeSuggestionIndex
                  }
                )}
              >
                {item.label}
                {index === activeSuggestionIndex && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
                    <CheckIcon className="h-4 w-4" />
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