export const config = {
    iceServers: [{
            // urls: ["stun:stun.l.google.com:19302"],
            urls: ["stun:stun.evera.cloud:5349"],
        },
        {
            urls: "turn:turn.evera.cloud:5349",
            username: "test",
            credential: "test321",
        },
    ],
};

export const endpoint = process.env.VUE_APP_ENDPOINT