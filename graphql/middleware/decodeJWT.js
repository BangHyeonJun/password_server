import jwt from "jsonwebtoken";

const decodeJWT = async token => {
    try {
        // if (!payload) {
        //     //no token in the header
        //     throw new Error("No token provided");
        // }

        // if (prefix !== tokenPrefix) {
        //     //unexpected prefix or format
        //     throw new Error("Invalid header format");
        // }

        const decode = await jwt.verify(
            token,
            process.env.token_sort,
            (err, data) => {
                if (err) {
                    //token is invalid
                    throw new Error("Invalid token!");
                } else {
                    return {
                        _id: data._id,
                        role: data.role
                    };
                }
            }
        );
        return decode;
    } catch (error) {
        console.log("error !!!");
        return undefined;
    }
};

export default decodeJWT;
