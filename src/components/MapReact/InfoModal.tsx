export default function InfoModal() {
  return (
    <button className="fixed top-24 right-4 p-2 rounded-lg bg-sky-500 text-white hover:scale-110 active:scale-90 transition-all duration-200">
      <svg
        width="30"
        height="30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 1.754a13.246 13.246 0 1 0 0 26.492 13.246 13.246 0 0 0 0-26.492M3.654 15a11.346 11.346 0 1 1 22.692 0 11.346 11.346 0 0 1-22.692 0M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M12 12h3a1 1 0 0 1 1 1v7h2v2h-6v-2h2v-6h-2z"
          fill="currentColor"
          fill-rule="evenodd"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  );
}
