import Post from "./postSchema";
import moment from "moment";
import "moment-timezone";

import fs from "fs";
import Sharp from "sharp";

export default {
    Query: {
        getPosts: async () => {
            return await Post.find({});
        },

        getPost: async (_, { id }) => {
            console.log(await Post.findById(id));
            return await Post.findById(id);
        }
    },

    Mutation: {
        insertPost: async (_, { userID, hashtag, title, text, html }) => {
            // TODO : 메인 이미지 작업 진행해야함

            moment.tz.setDefault("Asia/Seoul");
            let now = moment().format("YYYY-MM-DD HH:mm:ss");
            let post = new Post({
                writer: userID,
                mainImg: "test",
                hashtag: hashtag,
                title: title,
                publish_date: now,
                text: text,
                html: html,
                comment: new Array()
            });

            if (await post.save()) {
                return post;
            } else {
                throw new Error("포스트가 정상적으로 저장되지 않았습니다.");
            }
        },

        UploadMainImg: async (obj, { postID, file }) => {
            const mainImg = await file;
            const { filename, mimetype, encoding, createReadStream } = mainImg;

            const readStream = createReadStream(filename, {
                encoding: encoding
            });

            // const roundedCornerResizer = Sharp()
            //     .resize(400, 1080)
            //     .png();

            readStream
                // .pipe(roundedCornerResizer)
                .pipe(fs.createWriteStream(filename));

            // readStream.on("data", function(e) {
            //     fs.write(e);
            // });

            // fs.writeFile(filename, mainImg, "binary", function(err) {
            //     if (err) throw err;
            //     console.log("File saved.");
            //     console.log(filename);

            //     Jimp.read(filename, function(err, image) {
            //         console.log(image);

            //         if (err) throw err;
            //         image
            //             .resize(256, 256) // resize
            //             .quality(60) // set JPEG quality
            //             .greyscale() // set greyscale
            //             .write("lena-small-bw.jpg"); // save
            //     });
            // });

            await Post.updateOne(
                { _id: postID },
                {
                    $set: {
                        mainImg: filename
                    }
                },
                (err, collection) => {
                    if (err) throw new Error(err);
                    console.log("Record updated successfully");
                }
            );

            const returnFile = { filename, mimetype, encoding };
            return returnFile;
        }
    }
};
