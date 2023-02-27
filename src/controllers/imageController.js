const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { serverErrorCode, successCode, badRequestCode, unauthorizedCode, notFoundCode, forbiddenCode } = require('../config/response');

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
        let { name, limit, offset, user_id } = req.query;

        if (user_id) {
            user_id = +user_id;
            if (Number.isNaN(user_id)) {
                return badRequestCode(res, "Id người tạo ảnh không hợp lệ");
            }

            const userDB = await prisma.user.findFirst({
                where: {
                    user_id
                }
            })
            if (!userDB) {
                return notFoundCode("Người tạo ảnh không tồn tại");
            }
        }

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
                ...(user_id && { user_id }),
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

const getImageDetail = async (req, res, next) => {
    try {
        const { image_id } = req.params;

        if (!image_id) {
            return badRequestCode(res, "Hãy thêm thông tin id hình ảnh")
        }

        if (Number.isNaN(+image_id)) {
            return badRequestCode(res, "Id hình ảnh không hợp lệ")
        }

        const image = await prisma.image.findFirst({
            where: {
                image_id: +image_id
            },
            include: {
                user: true
            }
        })

        if (!image) {
            return notFoundCode(res, "Không tìm thấy hình ảnh nào")
        }

        return successCode(res, { image }, "Lấy chi tiết hình ảnh thành công")

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const getImageListSaved = async (req, res, next) => {
    try {
        let { user_id, offset, limit } = req.query;

        if (!user_id) {
            return badRequestCode(res, "Thêm thông tin id người dùng cần lấy ds ảnh đã lưu")
        }

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

        user_id = +user_id;
        if (Number.isNaN(user_id)) {
            return badRequestCode(res, "Id người dùng không hợp lệ");
        }

        const userDB = await prisma.user.findFirst({
            where: {
                user_id
            }
        })

        if (!userDB) {
            return notFoundCode("Người lưu ảnh không tồn tại");
        }

        const saveImageDB = await prisma.save_image.findMany({
            where: {
                user_id
            },
            ...(offset && { skip: offset }),
            ...(limit && { take: limit }),
            orderBy: [{ save_id: 'desc' }]
        })

        if (!saveImageDB || !saveImageDB.length) {
            return notFoundCode("Không tìm thấy hình ảnh nào")
        }

        const imagesDBPromises = saveImageDB.map(item => prisma.image.findFirst({ where: { image_id: item.image_id } }));
        const imagesDBResult = await Promise.all([...imagesDBPromises]);

        return successCode(res, { images: imagesDBResult }, "Lấy danh sách ảnh đã lưu thành công");

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const deleteImage = async (req, res, next) => {
    try {
        let { image_id } = req.params;
        const user = req.user;

        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống")
        }

        if (!image_id) {
            return badRequestCode(res, "Thêm thông tin id hình ảnh muốn xóa")
        }

        image_id = +image_id;
        if (Number.isNaN(image_id)) {
            return badRequestCode(res, "Id hình ảnh không hợp lệ")
        }

        const imageDB = await prisma.image.findFirst({
            where: {
                image_id
            }
        })

        if (!imageDB) {
            return notFoundCode(res, "Không tìm thấy hình ảnh muốn xóa")
        }

        if (user.user_id !== imageDB.user_id) {
            return forbiddenCode(res, "Bạn không có quyền thực hiện thao tác này")
        }

        //delete contrains FK related image
        const saveImageDBRelated = await prisma.save_image.deleteMany({
            where: {
                image_id
            }
        })

        const commentDBRelated = await prisma.comment.deleteMany({
            where: {
                image_id
            }
        })

        const imageDelete = await prisma.image.delete({
            where: {
                image_id
            }
        })

        return successCode(res, { image: imageDelete }, "Xóa hình ảnh thành công")

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server")
    }
}

module.exports = {
    postImage,
    getImageList,
    getImageDetail,
    getImageListSaved,
    deleteImage
}