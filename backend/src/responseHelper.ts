
export const jsonResponseOk = (data?: any) => {
    return {
        error: false,
        data: data,
    }
}

export const jsonResponseError = (message: string) => {
    return {
        error: true,
        message: message,
    }
}

export const jsonResponseUnauthorized = () => {
    return {
        error: true,
        message: "Unauthorized",
    }
}

export const jsonResponseServerError = () => {
    return {
        error: true,
        message: "Internal Server Error",
    }
}

export const jsonResponseForbidden = () => {
    return {
        error: true,
        message: "Forbidden"
    }
}