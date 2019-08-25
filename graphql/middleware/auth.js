import decodeJWT from "./decodeJWT";

const auth = async req => {
    let token = null;

    if (req.get(process.env.token_prefix)) {
        token = req.get(process.env.token_prefix).replace(/^Bearer /, "");
    }

    if (token) {
        const user = await decodeJWT(token);
        return user;
    } else {
        return null;
    }
};

export default auth;
