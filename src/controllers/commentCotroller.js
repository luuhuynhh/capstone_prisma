const { serverErrorCode, unauthorizedCode, badRequestCode, successCode, notFoundCode } = require("../config/response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const postComment = async (req, res, next) => {
    try {
        let { image_id, content } = req.body;
        const user = req.user;

        //validate input
        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập hệ thống");
        }

        if (!image_id) {
            return badRequestCode(res, "Hãy thêm thông tin id hình ảnh muốn bình luận");
        }

        if (Number.isNaN(+image_id)) {
            return badRequestCode(res, "Id hình ảnh không hợp lệ");
        }

        image_id = +image_id;

        const imageDB = await prisma.image.findFirst({
            where: {
                image_id
            }
        })

        if (!imageDB) {
            return badRequestCode(res, "Không tìm thấy hình ảnh muốn bình luận");
        }

        if (!content) {
            return badRequestCode(res, "Hãy nhập nội dung bình luận");
        }

        const commentModel = {
            user_id: user.user_id,
            image_id,
            content,
            comment_date: new Date()
        }
        const newComment = await prisma.comment.create({
            data: commentModel
        });

        return successCode(res, { comment: newComment }, "Bình luận thành công");

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const getCommentsByImageId = async (req, res, next) => {
    try {
        let { limit, offset } = req.query;
        const user = req.user;
        let { image_id } = req.params;

        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống");
        }

        if (!image_id) {
            return badRequestCode(res, "Nhập thêm thông tin id hình ảnh muốn lấy bình luận");
        }

        if (Number.isNaN(+image_id)) {
            return badRequestCode(res, "Id hình ảnh không hợp lệ");
        }

        image_id = +image_id;

        const imageDB = await prisma.image.findFirst({
            where: {
                image_id
            }
        })

        if (!imageDB) {
            return notFoundCode(res, "Không tìm thấy hình ảnh muốn lấy bình luận");
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


        const comments = await prisma.comment.findMany({
            where: {
                image_id
            },
            ...(offset && { skip: offset }),
            ...(limit && { take: limit }),
            orderBy: [{ comment_id: 'desc' }]
        })

        if (!comments || !comments.length) {
            return notFoundCode(res, "Không tìm thấy bình luận nào");
        }

        return successCode(res, { comments }, "Lấy danh sách bình luận thành công");
    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

module.exports = {
    postComment,
    getCommentsByImageId
}