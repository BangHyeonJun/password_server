// /* 이미지 파일 저장용 */
// const storeUpload = ({ stream, filename }) =>
//     new Promise((resolve, reject) =>
//         stream
//             .pipe(createWriteStream(filename))
//             .on("finish", () => resolve())
//             .on("error", reject)
//     );
import { GraphQLSchema, GraphQLObjectType, GraphQLBoolean } from "graphql";
import { GraphQLUpload } from "graphql-upload";

export default {
    Query: {},
    Mutation: {
    }
};

// export default {
//     Upload: GraphQLUpload,

//     Query: {},

//     Mutation: {
//         singleUpload: {
//             args: {
//                 image: {
//                     description: "Image file.",
//                     type: GraphQLUpload
//                 }
//             },
//             async resolve(parent, { file }) {
//                 const { filename, mimetype, encoding } = await file;
//                 console.log("file : ", file);
//                 console.log("filename : ", filename);
//                 console.log("minetype : ", mimetype);
//                 console.log("encoding : ", encoding);

//                 const returnFile = { filename, mimetype, encoding };
//                 return returnFile;
//             }
//         }
//     }
// };
