export const formatDuration = (start, end) => {
    if (!start || !end) return "N/A";

    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};

export const formatTime = (timeString) => {
    if (!timeString) return "Not set";
    const date = new Date(timeString);
    return date.toLocaleTimeString();
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};
