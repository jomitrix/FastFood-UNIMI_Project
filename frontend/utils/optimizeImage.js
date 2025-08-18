export async function optimizeImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 1920;
            const maxHeight = 1080;
            let { width, height } = img;

            // Scalo per proporzioni
            if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height;
                if (width > height) {
                    width = maxWidth;
                    height = Math.round(maxWidth / aspectRatio);
                } else {
                    height = maxHeight;
                    width = Math.round(maxHeight * aspectRatio);
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                            type: "image/webp",
                            lastModified: Date.now(),
                        });
                        resolve(webpFile);
                    } else {
                        reject(new Error("WebP conversion failed"));
                    }
                },
                "image/webp",
                0.85 // qualità di compressione
            );
        };

        img.onerror = () => {
            reject(new Error("Image upload failed"));
        };
    });
}