import { useEffect } from "react";

export const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
}

export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}

export const useTitle = (title) => {
    useEffect(() => {
        document.title = title + " • LinkVerse";
    }, [title]);
};

export async function copyToClipboard(url) {
    try {
        await navigator.clipboard.writeText(url);
    } catch (err) {
        console.error("Không thể sao chép URL:", err);
    }
}