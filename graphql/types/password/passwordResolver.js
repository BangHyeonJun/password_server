import Password from "./passwordSchema";
import moment from "moment";
import "moment-timezone";
import bcrypt from "bcrypt";
import createJWT from "../../middleware/createJWT";
import Cryptr from "cryptr";

// const cryptr = new Cryptr(process.env.password_sort);

export default {
    Query: {
        getPassword: async (_, { id }, ctx) => {
            const { _id } = await ctx.req.user;

            if (!_id) {
                throw new Error("세션이 만료되었습니다.");
            }

            return await Password.findOne({ user: _id, _id: id });
        },

        // 모든 패스워드 리스트를 불러옵니다.
        getPasswordList: async (_, args, ctx) => {
            try {
                const { _id } = await ctx.req.user;

                if (!_id) {
                    throw new Error("세션이 만료되었습니다.");
                }

                const cryptr = new Cryptr(process.env.password_sort);

                return await Password.find({ user: _id }, function(err, res) {
                    if (err) {
                        return new Error("리스트 에러");
                    }

                    const result = res.map(item => ({
                        ...item,
                        _doc: {
                            ...item._doc,
                            password: cryptr.decrypt(item.password)
                        }
                    }));

                    console.log(result);
                });
            } catch (e) {
                return e;
            }
        },

        // 필터에 맞는 것을 가져옵니다.
        getPasswordWFilter: async (_, { filter }, ctx) => {
            const { _id } = await ctx.req.user;

            if (!_id) {
                throw new Error("세션이 만료되었습니다.");
            }

            console.log(filter);

            return await Password.find({
                $or: [
                    { id: filter },
                    { url: filter },
                    { site: filter },
                    { description: filter }
                ]
            });
        }
    },

    Mutation: {
        // 패스워드를 추가합니다.
        inputPassword: async (
            _,
            { site, url, id, password, description },
            ctx
        ) => {
            const { _id } = await ctx.req.user;

            if (!_id) {
                throw new Error("세션이 만료되었습니다.");
            }
            const cryptr = new Cryptr(process.env.password_sort);
            const pass = cryptr.encrypt(password);

            // 패스워드 객체 생성
            const pPassword = new Password({
                user: _id,
                site,
                url,
                id,
                password: pass,
                description
            });

            if (await pPassword.save()) {
                return await Password.find({ user: _id });
            } else {
                throw new Error("회원을 정상적으로 저장하지 못하였습니다.");
            }
        },

        // 패스워드를 수정합니다.
        editPassword: async (
            _,
            { pId, site, url, id, password, description },
            ctx
        ) => {
            console.log(pId);
            return true;
        },

        // 정보 수정
        deletePassword: async (_, { pId }) => {
            console.log(pId);
            return true;
        }
    }
};
