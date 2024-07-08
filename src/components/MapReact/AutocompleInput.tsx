import { useEffect, useRef } from "react"
import { getAutoComplete } from "../../utils/Map2";

interface AutocompleInputProps {
    title: string,
    placeHolder: string,
    setPlace: (place: google.maps.places.PlaceResult) => void
    map: google.maps.Map
}

export default function AutocompleInput({title, placeHolder, setPlace, map}: AutocompleInputProps) {

    const inputRef = useRef(null);

    useEffect(() => {
        getAutoComplete(inputRef.current!).then((inputAc) => {
            if (!map) return;
            inputAc.addListener("place_changed", () => {
                console.log("Llega");
                console.log(inputAc.getPlace());
                setPlace(inputAc.getPlace());
            });
            inputAc.bindTo("bounds", map);
        })
    }, [])

    return (
        <div>
          <label
            htmlFor="origen"
            className="text-sm font-medium text-black/80 dark:text-neutral-200/80"
          >
            {title}
          </label>
          <input
            id="origen"
            ref={inputRef}
            type="text"
            className="w-full outline-none bg-sky-900/20 border-1 border-blue-500 text-gray-900 text-sm rounded-lg focus:ring ring-blue-500 focus:border-blue-800 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={placeHolder}
          />
        </div>
    )
}