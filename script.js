// Global variable to hold the generated PDF object
let generatedPdfDoc = null;

// Function to process images (renamed from convertImagesToPDF)
function processImages() {
    const fileInput = document.getElementById('imageUploader');
    const statusDiv = document.getElementById('status');
    const downloadSection = document.getElementById('downloadSection');
    const files = fileInput.files;

    if (files.length === 0) {
        statusDiv.textContent = 'Please select at least one image file.';
        return;
    }

    // Hide previous download button and reset status
    downloadSection.style.display = 'none';
    statusDiv.textContent = 'Generating PDF... (Please wait)';

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let imagesProcessed = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function(event) {
            const imgData = event.target.result;
            const img = new Image();
            
            img.onload = function() {
                const imgType = file.type.split('/')[1].toUpperCase();

                // Standard scaling logic (same as before)
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = doc.internal.pageSize.getHeight();
                const imgWidth = img.width;
                const imgHeight = img.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const finalWidth = imgWidth * ratio - 20; 
                const finalHeight = imgHeight * ratio - 20;
                const x = (pdfWidth - finalWidth) / 2;
                const y = (pdfHeight - finalHeight) / 2;

                if (imagesProcessed > 0) {
                    doc.addPage();
                }

                doc.addImage(imgData, imgType, x, y, finalWidth, finalHeight);

                imagesProcessed++;
                statusDiv.textContent = `Processing image ${imagesProcessed} of ${files.length}...`;

                // --- IMPORTANT CHANGE ---
                if (imagesProcessed === files.length) {
                    // 1. Store the completed PDF object
                    generatedPdfDoc = doc;
                    
                    // 2. Show success message and download button
                    statusDiv.textContent = '✅ PDF is ready for download!';
                    downloadSection.style.display = 'block';
                    fileInput.value = ''; // Clear the input
                }
            };
            img.src = imgData;
        };
    }
}

// Event Listener for the new Download Button
document.getElementById('downloadButton').addEventListener('click', function() {
    if (generatedPdfDoc) {
        // 3. Save the stored PDF object when the button is clicked
        generatedPdfDoc.save("converted_images.pdf");
    } else {
        alert("PDF is not ready yet. Please process the images first.");
    }
});
