import { rule, shield, and, or, not } from "graphql-shield";
import { isAdmin, isManager, isMember, isAuthenticated } from "./role";

const permission = shield({
    Query: {
        /* member */
        getLoginMember: isAdmin,
        getMember: or(isMember, isManager, isAdmin, isAuthenticated),
        getMembers: or(isAdmin),

        /* post */
        getPosts: or(isAuthenticated, isAdmin),
        getPost: or(isAdmin, isManager, isMember)
    },
    Mutation: {
        /* member */
        login: isAuthenticated,
        setPassword: or(isMember, isAdmin),
        signup: or(isMember, isAdmin),
        setUserInfo: or(isMember, isAdmin)
    }
});

export default permission;
// 참고 : https://www.npmjs.com/package/graphql-shield
