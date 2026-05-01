export function getErrorMessage(error, fallback = "Something went wrong") {
    if (!error.response) {
        return "Cannot connect to server. Please check if backend is running.";
    }

    if (error.response.status === 401) {
        return "Your session expired. Please login again.";
    }

    if (error.response.status === 403) {
        return "You do not have permission to perform this action.";
    }

    if (error.response.status === 404) {
        return "Requested item was not found.";
    }

    if (error.response.status >= 500) {
        return "Server error. Please try again later.";
    }

    return error.response?.data?.message || fallback;
}