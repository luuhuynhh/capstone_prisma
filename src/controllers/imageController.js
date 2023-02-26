const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { serverErrorCode, successCode, badRequestCode, unauthorizedCode } = require('../config/response');

const prisma = new PrismaClient();

const postImage = async (req, res, next) => {
    try {

        const { file, description, user } = req;

        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập để thực hiện chức năng này");
        }

        if (!file) {
            return badRequestCode(res, "Hãy chọn một ảnh để upload");
        }

        fs.readFile(`${process.cwd()}/public/images/${file.filename}`, async (err, data) => {
            if (err) return serverErrorCode(res, "Lỗi server");

            const path = `data:${file.mimetype};base64,${Buffer.from(data.toString("base64"))}`;
            //delete file BE
            fs.unlinkSync(`${process.cwd()}/public/images/${file.filename}`);

            const newImage = {
                name: file.originalname,
                path,
                description,
                user_id: user.user_id
            }

            const image = await prisma.image.create({ data: newImage });
            return successCode(res, { image }, "Thêm ảnh thành công");
        })

    } catch (err) {
        console.log(err);
        serverErrorCode(res, "Lỗi server");
    }
}

module.exports = {
    postImage
}