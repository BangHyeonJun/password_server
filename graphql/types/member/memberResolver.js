import Member from "./memberSchema";
import moment from "moment";
import "moment-timezone";
import bcrypt from "bcrypt";
import createJWT from "../../middleware/createJWT";

export default {
    Query: {
        // 로그인 기능
        signin: async (_, { email, password }) => {
            if (!email || !password) {
                throw new Error("이메일 또는 패스워드는 필수 값 입니다.");
            }

            const user = await Member.findOne({ email: email });

            if (!user) {
                throw new Error("해당 아이디는 존재하지 않습니다.");
            }

            if (user) {
                if (await bcrypt.compareSync(password, user.password)) {
                    const uId = user._id;
                    const uRole = user.role;

                    return createJWT(uId, uRole);
                }

                throw new Error("패스워드가 일치하지 않습니다.");
            }

            throw new Error("유저를 찾을수 없습니다.");
        },

        checkSession: async (parent, args, context) => {
            const TokenUser = await context.req.user;
            if (TokenUser) {
                const member = await Member.findById(
                    TokenUser._id
                ).countDocuments();

                if (member) {
                    return true;
                }
            }
            return false;
        },

        getMembers: async (_, args) => {
            return await Member.find({});
        },

        getMember: async (_, { id }) => {
            return await Member.findById(id);
        },

        getLoginMember: async (parent, args, context) => {
            const TokenUser = await context.req.user;

            if (TokenUser) {
                const member = await Member.findById(TokenUser._id);

                return member;
            } else {
                throw new Error(
                    "세션이 만료되었거나, 비정상적인 접근을 하였습니다."
                );
            }
        }
    },

    Mutation: {
        // 회원가입
        signup: async (_, { email, password }, ctx) => {
            // 입력된 email이 존재하는지 확인
            let user = await Member.find({ email: email }).count();

            // 유저 체크
            if (user) {
                throw new Error("해당 이메일을 가진 유저가 존재합니다.");
            }

            // 사용자 이메일, 패스워드 초기화
            const uEmail = email;
            const uPassword = password;
            const uRole = "member";

            // 멤버 객체 생성
            const newbey = new Member({
                email: uEmail,
                password: await bcrypt.hashSync(uPassword, 10),
                role: uRole
            });

            if (await newbey.save()) {
                return true;
            } else {
                throw new Error("회원을 정상적으로 저장하지 못하였습니다.");
            }
        },

        // 패스워드 설정
        setPassword: async (_, { mId, email, password }) => {
            if (!mId) {
                throw new Error("아이디는 필수 값 입니다.");
            }

            if ((await Member.findById(mId).count()) < 1) {
                throw new Error("해당 아이디는 존재하지 않습니다.");
            }

            await Member.updateOne(
                { _id: mId },
                { $set: { password: await bcrypt.hashSync(password, 10) } },
                (err, collection) => {
                    if (err) throw new Error(err);
                    console.log("Record updated successfully");
                }
            );

            return true;
        }
    }
};

// 참고
// https://blog.pusher.com/handling-authentication-in-graphql-jwt/
// me: async (_, args, { member }) => {
//     return {
//         ok: true,
//         member,
//         error: null
//     };

// if (!member) {
//     throw new Error("인증을 하지 않았습니다.");
// }

// return await Member.findById(member.id);

// Mutation: {
//     // login: async (_, { email, password }) => {
//     //     const member = await Member.findOne({ email, password });
//     //     if (!member) {
//     //         throw new Error("이메일과 비밀번호가 올바르지 않습니다.");
//     //     }
//     //     // const valid = await bcrypt.compare(password, user.password)
//     //     return jsonwebtoken.sign(
//     //         { id: member._id, email: member.email },
//     //         "somereallylongsecretkey",
//     //         { expiresIn: "1min" }
//     //     );
//     // }
// }

// Mutation: {
//     // insertMember: async (
//     //     _,
//     //     { avatar, userid, username, email, introduce, sns }
//     // ) => {
//     //     return false;
//     //     // moment.tz.setDefault("Asia/Seoul");
//     //     // let now = moment().format("YYYY-MM-DD HH:mm:ss");
//     //     // let post = new Post({
//     //     //     mainImg: {
//     //     //         path: "",
//     //     //         width: 300,
//     //     //         height: 300
//     //     //     },
//     //     //     category: "test",
//     //     //     title,
//     //     //     publish_date: now,
//     //     //     content,
//     //     //     comment: []
//     //     // });
//     //     // if (await post.save()) {
//     //     //     return true;
//     //     // } else {
//     //     //     return false;
//     //     // }
//     // }
