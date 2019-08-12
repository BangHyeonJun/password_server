import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";

const allTypes = fileLoader(path.join(__dirname, "./types/**/*.graphql"));

// Resolver는 뒤에 Resolver라고 붙여줘야 합니다.
const allResolvers = fileLoader(
    path.join(__dirname, "./types/**/*Resolver.js")
);

const typeDefs = makeExecutableSchema({
    typeDefs: mergeTypes(allTypes),
    resolvers: mergeResolvers(allResolvers)
});

export default typeDefs;
