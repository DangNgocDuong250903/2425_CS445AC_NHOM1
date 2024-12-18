import { useState, useCallback } from "react";

function useDragAndDrop(onDropCallback) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (event) => {
            event.preventDefault();
            setIsDragging(false);

            const droppedFiles = Array.from(event.dataTransfer.files);
            setFiles(droppedFiles);

            if (onDropCallback) {
                onDropCallback(droppedFiles);
            }
        },
        [onDropCallback]
    );

    return {
        isDragging,
        files,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
}

export default useDragAndDrop;
