import jwt from "jsonwebtoken";

const createJWT = (_id, role) => {
    const payload = {
        _id: _id,
        role: role
    };

    const token = jwt.sign(payload, process.env.token_sort, {
        expiresIn: process.env.token_expire
    });

    return token;
};

export default createJWT;
