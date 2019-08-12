import decodeJWT from "./decodeJWT";

const auth = async req => {
    let token = null;

    if (req.get(process.env.token_prefix)) {
        token = req.get(process.env.token_prefix).replace(/^Bearer /, "");
    }

    console.log(token);

    if (token) {
        const user = await decodeJWT(token);
        console.log(user);
        return user;
    } else {
        return null;
    }
};

export default auth;
