const { serverErrorCode, unauthorizedCode, badRequestCode, successCode, notFoundCode, forbiddenCode } = require("../config/response");
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

const updateComment = async (req, res, next) => {
    try {
        let { comment_id } = req.params;
        const { content } = req.body;
        const user = req.user;

        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống")
        }

        if (!comment_id) {
            return badRequestCode(res, "Hãy thêm thông tin id bình luận")
        }

        if (Number.isNaN(+comment_id)) {
            return badRequestCode(res, "Id bình luận không hợp lệ")
        }

        const commentDB = await prisma.comment.findFirst({
            where: {
                comment_id: +comment_id
            }
        })

        if (!commentDB) {
            return notFoundCode(res, "Không tìm thấy bình luận muốn chỉnh sửa")
        }

        if (user.user_id !== commentDB.user_id) {
            return forbiddenCode(res, "Bạn không có quyền thực hiện tác vụ này")
        }

        if (!content) {
            return badRequestCode(res, "Vui lòng nhập nội dung bình luận")
        }

        const commentUpdate = await prisma.comment.update({
            where: {
                comment_id: +comment_id
            },
            data: {
                content
            }
        })

        return successCode(res, { comment: commentUpdate }, "Cập nhật bình luận thành công")

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const deleteComment = async (req, res, next) => {
    try {
        let { comment_id } = req.params;
        const user = req.user;

        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống")
        }

        if (!comment_id) {
            return badRequestCode(res, "Hãy thêm thông tin id bình luận")
        }

        if (Number.isNaN(+comment_id)) {
            return badRequestCode(res, "Id bình luận không hợp lệ")
        }

        const commentDB = await prisma.comment.findFirst({
            where: {
                comment_id: +comment_id
            }
        })

        if (!commentDB) {
            return notFoundCode(res, "Không tìm thấy bình luận muốn xóa")
        }

        if (user.user_id !== commentDB.user_id) {
            return forbiddenCode(res, "Bạn không có quyền thực hiện tác vụ này")
        }


        const commentDelete = await prisma.comment.delete({
            where: {
                comment_id: +comment_id
            }
        })

        return successCode(res, { comment: commentDelete }, "Xóa bình luận thành công")
    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

module.exports = {
    postComment,
    getCommentsByImageId,
    updateComment,
    deleteComment
}