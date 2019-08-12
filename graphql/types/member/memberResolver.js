import Member from "./memberSchema";
import moment from "moment";
import "moment-timezone";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import createJWT from "../../middleware/createJWT";
import SNS from "./sns";

export default {
    Query: {
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
        signup: async (_, { email }, ctx) => {
            // 입력된 email이 존재하는지 확인
            let user = await Member.find({ email: email }).count();

            // 유저 체크
            if (user) {
                throw new Error("해당 이메일을 가진 유저가 존재합니다.");
            }

            // 기본값으로 초기화
            const uEmail = email;
            const uPassword = "nuguna-" + randomstring.generate(10);
            const uNickname = "누구나-" + randomstring.generate(6);
            moment.tz.setDefault("Asia/Seoul");
            const uJoinDate = moment().format("YYYY-MM-DD HH:mm:ss");

            // 멤버 객체 생성
            const newbey = new Member({
                email: uEmail,
                password: await bcrypt.hashSync(uPassword, 10),
                nickname: uNickname,
                join_date: uJoinDate,
                role: "member"
            });

            if (await newbey.save()) {
                return {
                    email: uEmail,
                    password: uPassword
                };
            } else {
                throw new Error("회원을 정상적으로 저장하지 못하였습니다.");
            }
        },

        // 정보 수정
        setUserInfo: async (_, { id, avatar, nickname, introduce, sns }) => {
            let param = new Object();

            if (!id) {
                throw new Error("아이디는 필수 값 입니다.");
            }

            if ((await Member.findById(id).count()) < 1) {
                throw new Error("해당 아이디는 존재하지 않습니다.");
            }

            const userSNS = new Array();
            for (let i in sns) {
                let target = SNS[sns[i]["name"]];
                let url = sns[i]["url"];
                let form = {
                    code: target["code"],
                    image: target["image"],
                    url: url
                };
                userSNS.push(form);
            }
            param["sns"] = userSNS;
            param["introduce"] = introduce;
            param["nickname"] = nickname;
            param["avatar"] = avatar;

            await Member.updateOne(
                { _id: id },
                { $set: param },
                (err, collection) => {
                    if (err) throw new Error(err);
                    console.log("Record updated successfully");
                }
            );

            return await Member.findById(id);
        },

        // 패스워드 설정
        setPassword: async (_, { id, password }) => {
            if (!id) {
                throw new Error("아이디는 필수 값 입니다.");
            }

            if ((await Member.findById(id).count()) < 1) {
                throw new Error("해당 아이디는 존재하지 않습니다.");
            }

            await Member.updateOne(
                { _id: id },
                { $set: { password: await bcrypt.hashSync(password, 10) } },
                (err, collection) => {
                    if (err) throw new Error(err);
                    console.log("Record updated successfully");
                }
            );

            return true;
        },

        // 로그인 기능
        login: async (_, { email, password }) => {
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
