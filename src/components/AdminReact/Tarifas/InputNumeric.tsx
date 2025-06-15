"use client"

import { useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"

export interface InputNumericProps {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    [key: string]: any;
}

export default function InputNumeric({ value, min, max, step, onChange, ...props }: InputNumericProps) {
    const valueRef = useRef(value);
    const incrementIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const decrementIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const updateValue = useCallback((newValue: number) => {
        const clampedValue = Math.min(Math.max(newValue, min), max);
        onChange(clampedValue);
    }, [min, max, onChange])

    const increment = useCallback(() => {
        updateValue(Number((valueRef.current + step).toFixed(2)));
    }, [value, step, updateValue])

    const decrement = useCallback(() => {
        updateValue(Number((valueRef.current - step).toFixed(2)));
    }, [value, step, updateValue])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
            updateValue(newValue);
        }
    };

    const startIncrement = () => {
        increment();
        incrementIntervalRef.current = setInterval(increment, 100);
    }

    const startDecrement = () => {
        decrement();
        decrementIntervalRef.current = setInterval(decrement, 100);
    }

    const stopIncrement = () => {
        if (incrementIntervalRef.current) {
            clearInterval(incrementIntervalRef.current);
            incrementIntervalRef.current = null;
        }
    }

    const stopDecrement = () => {
        if (decrementIntervalRef.current) {
            clearInterval(decrementIntervalRef.current);
            decrementIntervalRef.current = null;
        }
    }


    useEffect(() => {
        return () => {
            stopIncrement();
            stopDecrement();
        };
    }, []);

    return (
        <div className="flex items-center space-x-0 border rounded-lg overflow-hidden shadow-sm relative">
            <span className={`absolute left-1/2 top-1/2 transform -translate-y-1/2 ${value >= 10 ? "translate-x-5" : "translate-x-4"}`}>€</span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={startDecrement}
                onMouseUp={stopDecrement}
                onMouseLeave={stopDecrement}
                onTouchStart={startDecrement}
                onTouchEnd={stopDecrement}
                disabled={value <= min}
                className="h-10 rounded-none border-r hover:bg-gray-100 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="icon icon-tabler icons-tabler-outline icon-tabler-minus">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M5 12l14 0"/>
                </svg>
            </Button>

            <Input 
                type="number"
                value={value}
                onChange={handleInputChange}
                min={min}
                max={max}
                step={step}
                className="h-10 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent!"
                {...props}
            />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onMouseDown={startIncrement}
                onMouseUp={stopIncrement}
                onMouseLeave={stopIncrement}
                onTouchStart={startIncrement}
                onTouchEnd={stopIncrement}
                disabled={value >= max}
                className="h-10 rounded-none border-l hover:bg-gray-100 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 5l0 14"/>
                    <path d="M5 12l14 0"/>
                </svg>
            </Button>
        </div>
    )
}
