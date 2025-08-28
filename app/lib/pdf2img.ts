export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    loadPromise = import("pdfjs-dist/build/pdf.mjs")
        .then((lib) => {
            try {
                if (!lib.GlobalWorkerOptions.workerSrc) {
                    lib.GlobalWorkerOptions.workerSrc = workerSrc; // <- Use imported URL
                }
                pdfjsLib = lib;
                return lib;
            } catch (e) {
                console.error("Failed to set worker source:", e);
                throw e;
            }
        })
        .catch((err) => {
            console.error("Failed to load pdfjs:", err);
            throw err;
        });

    return loadPromise;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        const lib = await loadPdfJs();
        if (!lib) {
            return { imageUrl: "", file: null, error: "pdfjs library not loaded" };
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        if (!pdf) {
            return { imageUrl: "", file: null, error: "Could not open PDF" };
        }

        const page = await pdf.getPage(1).catch((err: any) => {
            throw new Error("Failed to load page 1: " + err);
        });

        const viewport = page.getViewport({ scale: 2 }); // safer scale
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            return { imageUrl: "", file: null, error: "Canvas context not available" };
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        await page.render({ canvasContext: context, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        console.error("PDF conversion failed:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}
