import { useState } from 'react';
import { renderAsync } from 'docx-preview';

const useDocxImport = () => {
    const [loading, setLoading] = useState(false);
    const [docxHtml, setDocxHtml] = useState("");

    const onUpload = async (e) => {
        setLoading(true);
        if (!e.target.files) {
            setLoading(false);
            return;
        }

        try {
            // Create a temporary container to render the DOCX content
            const tempContainer = document.createElement('div');
            document.body.appendChild(tempContainer);

            await renderAsync(e.target.files[0], tempContainer, undefined, {
                renderChanges: false,
                renderHeaders: false,
                renderFooters: false,
                renderFootnotes: false,
                renderEndnotes: false,
                renderComments: false,
                renderAltChunks: false
            });

            // Remove all elements with class "docx_heading3"
            const elements = tempContainer.getElementsByClassName("docx_heading3");
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }

            // Get the rendered HTML content
            const renderedHtml = tempContainer.getElementsByClassName("docx-wrapper")[0].innerHTML;
            setDocxHtml(renderedHtml);

            // Clean up the temporary container
            document.body.removeChild(tempContainer);
        } catch (error) {
            console.error("Error rendering DOCX file:", error);
        } finally {
            setLoading(false);
        }
    };

    return { onUpload, loading, docxHtml };
};

export default useDocxImport;
