import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function showDangerToast(message: string) {
    Toastify({
        text: message + "  ",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#f43f5e",
        },
    }).showToast();
}

export function showOkToast(message: string) {
    Toastify({
        text: message + "  ",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#22c55e",
        },
    }).showToast();
}
