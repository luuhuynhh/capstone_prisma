const { PrismaClient } = require("@prisma/client");
const { serverErrorCode, unauthorizedCode, badRequestCode, notFoundCode, successCode } = require("../config/response");

const prisma = new PrismaClient()

const saveImage = async (req, res, next) => {
    try {
        let { image_id } = req.body;
        const user = req.user;

        //validate
        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống");
        }

        if (!image_id) {
            return badRequestCode(res, "Vui lòng cung cấp thông tin id hình ảnh bạn muốn lưu");
        }

        image_id = +image_id;
        if (Number.isNaN(image_id)) {
            return badRequestCode(res, "Id hình ảnh không hợp lệ");
        }

        const imageDB = await prisma.image.findFirst({
            where: {
                image_id
            }
        })

        if (!imageDB) {
            return notFoundCode(res, "Không tìm thấy hình ảnh muốn lưu");
        }

        const saveImageDB = await prisma.save_image.findFirst({
            where: {
                image_id,
                user_id: user.user_id
            }
        })

        if (saveImageDB) {
            return badRequestCode(res, "Ảnh này đã tồn tại trong danh sách đã lưu rồi");
        }

        const saveImageModel = {
            user_id: user.user_id,
            image_id,
            save_date: new Date()
        }

        const newSaveImage = await prisma.save_image.create({ data: saveImageModel });
        return successCode(res, { saveImage: newSaveImage }, "Lưu hình ảnh thành công");
    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const unSaveImage = async (req, res, next) => {
    try {
        let { image_id } = req.body;
        const user = req.user;

        //validate
        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống");
        }

        if (!image_id) {
            return badRequestCode(res, "Vui lòng cung cấp thông tin id hình ảnh bạn muốn lưu");
        }

        image_id = +image_id;
        if (Number.isNaN(image_id)) {
            return badRequestCode(res, "Id hình ảnh không hợp lệ");
        }

        const imageDB = await prisma.image.findFirst({
            where: {
                image_id
            }
        })

        if (!imageDB) {
            return notFoundCode(res, "Không tìm thấy hình ảnh muốn lưu");
        }

        const saveImageDB = await prisma.save_image.findFirst({
            where: {
                image_id,
                user_id: user.user_id
            }
        })

        if (!saveImageDB) {
            return badRequestCode(res, "Ảnh này không tồn tại trong danh sách đã lưu rồi");
        }

        const newSaveImage = await prisma.save_image.delete({
            where: {
                save_id: saveImageDB.save_id
            }
        });
        return successCode(res, { saveImage: newSaveImage }, "Gỡ lưu hình ảnh thành công");

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const checkIfSaved = async (req, res, next) => {
    try {
        let { image_id } = req.query;
        const user = req.user;

        //validate
        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống");
        }

        if (!image_id) {
            return badRequestCode(res, "Vui lòng cung cấp thông tin id hình ảnh muốn kiểm tra");
        }

        image_id = +image_id;
        if (Number.isNaN(image_id)) {
            return badRequestCode(res, "Id hình ảnh không hợp lệ");
        }

        const imageDB = await prisma.image.findFirst({
            where: {
                image_id
            }
        })

        if (!imageDB) {
            return notFoundCode(res, "Không tìm thấy hình ảnh muốn kiểm tra");
        }

        const saveImageDB = await prisma.save_image.findFirst({
            where: {
                image_id,
                user_id: user.user_id
            }
        })

        if (!saveImageDB) {
            return successCode(res, { saved: false }, "Hình ảnh này không nằm trong danh sách đã lưu");
        }

        return successCode(res, { saved: true }, "Hình ảnh này có nằm trong danh sách đã lưu")
    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

module.exports = {
    saveImage,
    unSaveImage,
    checkIfSaved
}