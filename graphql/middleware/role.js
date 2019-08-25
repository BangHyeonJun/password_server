import { rule } from "graphql-shield";

// Rules
const isAdmin = rule()(async (parent, args, ctx, info) => {
    let user = await ctx.req.user;
    console.log("isAdmin");
    return user.role === "admin";
});

const isManager = rule()(async (parent, args, ctx, info) => {
    let user = await ctx.req.user;
    console.log("isManager");
    return user.role === "manager";
});

const isMember = rule()(async (parent, args, ctx, info) => {
    let user = await ctx.req.user;
    console.log(user.role === "member");
    return user.role === "member";
});

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    let user = await ctx.req.user;
    return user.role === null;
});

// 참고 : https://www.npmjs.com/package/graphql-shield

export { isAdmin, isManager, isMember, isAuthenticated };
