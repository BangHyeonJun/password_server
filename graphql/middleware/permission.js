import { rule, shield, and, or, not } from "graphql-shield";
import { isAdmin, isManager, isMember, isAuthenticated } from "./role";

const permission = shield({
    Query: {
        /* member */
        signin: true,
        checkSession: true,
        getLoginMember: isAdmin,
        getMember: or(isMember, isManager, isAdmin, isAuthenticated),
        getMembers: or(isAdmin)

        /* password */
    },
    Mutation: {
        /* member */
        signup: true,
        setPassword: or(isMember, isManager, isAdmin, isAuthenticated),

        /* password */
        inputPassword: or(isMember),
        editPassword: or(isMember, isManager, isAdmin, isAuthenticated),
        deletePassword: or(isMember, isManager, isAdmin, isAuthenticated)
    }
});

export default permission;
// 참고 : https://www.npmjs.com/package/graphql-shield
