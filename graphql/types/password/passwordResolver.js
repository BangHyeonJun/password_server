import Password from "./passwordSchema";
import moment from "moment";
import "moment-timezone";
import bcrypt from "bcrypt";
import createJWT from "../../middleware/createJWT";

export default {
    Query: {
        // 모든 패스워드 리스트를 불러옵니다.
        getPasswordList: async (_, args, ctx) => {
            const { _id } = await ctx.req.user;

            if (!_id) {
                throw new Error("세션이 만료되었습니다.");
            }

            console.log(await Password.find({ user: _id }));
            return await Password.find({ user: _id });
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

            // 패스워드 객체 생성
            const pPassword = new Password({
                user: _id,
                site,
                url,
                id,
                password,
                description,
                password: await bcrypt.hashSync(password, 10)
            });

            if (await pPassword.save()) {
                return true;
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
