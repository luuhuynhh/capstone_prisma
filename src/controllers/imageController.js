const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { serverErrorCode, successCode, badRequestCode, unauthorizedCode, notFoundCode } = require('../config/response');

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
        return serverErrorCode(res, "Lỗi server");
    }
}

const getImageList = async (req, res, next) => {
    try {
        let { name, limit, offset } = req.query;

        //validate input
        let isValidLimit = true;
        let isValidOffset = true;

        if (limit) {
            limit = +limit;
            isValidLimit = !Number.isNaN(limit);
        }

        if (offset) {
            offset = +offset;
            isValidOffset = !Number.isNaN(offset);
        }

        if (!isValidLimit || !isValidOffset) {
            return badRequestCode(res, {
                ...(!isValidLimit && { LIMIT: "Không hợp lệ" }),
                ...(!isValidOffset && { OFFSET: "Không hợp lệ" }),
            })
        }

        const images = await prisma.image.findMany({
            where: {
                ...(name && {
                    name: {
                        contains: name,
                    }
                }),
            },
            ...(offset && { skip: offset }),
            ...(limit && { take: limit }),
            orderBy: [{ image_id: 'desc' }]
        })

        if (!images || !images.length) {
            return notFoundCode(res, "Không tìm thấy ảnh nào");
        }

        return successCode(res, { images }, "Lấy danh sách ảnh thành công");

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

module.exports = {
    postImage,
    getImageList
}