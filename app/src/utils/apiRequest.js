export const request = (url, method, bodyParams) => {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyParams ? JSON.stringify(bodyParams) : undefined,
    });
};

function withToken(httpConfig) {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        httpConfig.headers['Authorization'] = `jwt_token ${user}`;
    } catch (err) {
        console.error(err);
    }
    return httpConfig;
};

export const requestWithToken = (url, method, bodyParams) => {
    const config = withToken({
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyParams ? JSON.stringify(bodyParams) : undefined,
    });

    return fetch(url, config);
};


