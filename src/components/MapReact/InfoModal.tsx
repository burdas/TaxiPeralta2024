import { useState } from "react";

const infoItems = [
  "El precio que muestra la calculadora es orientativo.",
  "No están incluidos peajes, aparcamiento ni otros costes.",
  "Si la distancia entre origen y destino es larga, puede experimentar un retardo al calcular la ruta.",
  "Se pueden poner solo nombres de poblaciones (Ej: Peralta, Pamplona, etc).",
  "Se pueden poner direciones de la siguiente manera: Avda/calle, número y población.",
];

export default function InfoModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-24 right-4 p-2 rounded-lg bg-sky-500 text-white hover:scale-110 active:scale-90 transition-all duration-200"
        onClick={() => setOpen(true)}
        title="Información de la calculadora"
      >
        <svg
          width="30"
          height="30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 1.754a13.246 13.246 0 1 0 0 26.492 13.246 13.246 0 0 0 0-26.492M3.654 15a11.346 11.346 0 1 1 22.692 0 11.346 11.346 0 0 1-22.692 0M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M12 12h3a1 1 0 0 1 1 1v7h2v2h-6v-2h2v-6h-2z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <aside
          className="fixed inset-0 bg-black/10 dark:bg-white/10 flex justify-center items-center z-50 animate-modalf"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-black rounded-lg py-4 px-8 ring-2 ring-sky-500/60 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row justify-end">
              <button
                id="imgDialogClose"
                className="border-2 border-sky-500 rounded-xl p-2 text-sky-500 hover:text-white dark:hover:text-black hover:bg-sky-500"
                onClick={() => setOpen(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.139 3.805a0.667 0.667 0 0 0 -0.944 -0.944L10 9.057 3.805 2.861a0.667 0.667 0 1 0 -0.944 0.944L9.057 10l-6.196 6.195a0.667 0.667 0 0 0 0.944 0.944L10 10.943l6.195 6.196a0.667 0.667 0 0 0 0.944 -0.944L10.943 10z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <h2 className="dark:text-white text-md sm:text-2xl text-center w-full font-bold">
              Información
            </h2>
            <ul className="mt-4 mx-auto max-w-[400px] mb-6">
              {infoItems.map((m, i) => (
                <li
                  key={i}
                  className="flex flex-row gap-4 p-2 ring-sky-500/60 hover:ring-2 transition-all hover:scale-105 duration-200 rounded-lg items-center"
                >
                  <svg
                    width="30"
                    height="30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-sky-500 flex-none"
                  >
                    <path
                      d="M15 1.754a13.246 13.246 0 1 0 0 26.492 13.246 13.246 0 0 0 0-26.492M3.654 15a11.346 11.346 0 1 1 22.692 0 11.346 11.346 0 0 1-22.692 0M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M12 12h3a1 1 0 0 1 1 1v7h2v2h-6v-2h2v-6h-2z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="dark:text-white text-sm sm:text-md flex-grow text-pretty">{m}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </>
  );
}
