import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";

const A4_ANCHO_PX = 794;
const A4_ALTO_PX = 1123;

export async function generarPdf(html: string, nombreArchivo: string): Promise<void> {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.cssText =
        `position:fixed;top:-9999px;left:-9999px;width:${A4_ANCHO_PX}px;height:${A4_ALTO_PX}px;border:none;`;
    document.body.appendChild(iframe);

    try {
        await new Promise<void>((resolve) => {
            iframe.onload = () => resolve();
        });

        const doc = iframe.contentDocument;
        if (!doc) throw new Error("No se pudo acceder al documento del iframe");

        const bodyStyle = doc.createElement("style");
        bodyStyle.textContent = `body{margin:0;width:${A4_ANCHO_PX}px;height:${A4_ALTO_PX}px;overflow:hidden;background:#fff;}`;
        doc.head.appendChild(bodyStyle);

        await new Promise((r) => setTimeout(r, 600));

        const body = doc.body;
        const canvas = await toCanvas(body, {
            width: A4_ANCHO_PX,
            height: A4_ALTO_PX,
            pixelRatio: 2,
            skipAutoScale: true,
            cacheBust: true,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const pdfAncho = pdf.internal.pageSize.getWidth();
        const pdfAlto = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "JPEG", 0, 0, pdfAncho, pdfAlto);
        pdf.save(nombreArchivo);
    } finally {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
    }
}
