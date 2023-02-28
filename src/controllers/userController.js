const { PrismaClient, Prisma } = require('@prisma/client');
const { MISSING_INFO } = require('../config/errorMessage');
const { badRequestCode, serverErrorCode, notFoundCode, successCode, unauthorizedCode, forbiddenCode } = require('../config/response');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { API_SECRET } = require('../config/secret');
const fs = require('fs');

const prisma = new PrismaClient()

const resgister = async (req, res, next) => {
    try {
        const {
            // user_id,
            password,
            fullname,
            email,
            age,
            // avatar
        } = req.body;

        if (!email) {
            const message = {
                EMAIL: MISSING_INFO("Email")
            }
            return badRequestCode(res, message)
        }

        //check email exist
        const existUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (existUser) {
            return badRequestCode(res, "Email này đã đăng ký trong hệ thống");
        }

        const newUserModel = {
            // user_id,
            password: bcrypt.hashSync(password, 8),
            fullname,
            email,
            age,
            // avatar
        }

        const createUser = await prisma.user.create({ data: newUserModel });

        return successCode(res, { user: createUser }, "Đăng ký thành công");

    } catch (err) {
        console.log(err)
        return serverErrorCode(res, "Lỗi server");
    }
}

const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //get user by email
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            return badRequestCode(res, "Thông tin đăng nhập không hợp lệ");
        }

        //comparing passwords
        const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return badRequestCode(res, "Thông tin đăng nhập không hợp lệ")
        }

        //signing token with user id
        const token = jwt.sign({
            id: user.user_id
        }, API_SECRET, {
            expiresIn: 86400
        });

        const data = {
            user: {
                user_id: user.user_id
            },
            accessToken: token
        }

        return successCode(res, data, "Đăng nhập hệ thống thành công");

    } catch (err) {
        console.log(err)
        return serverErrorCode(res, "Lỗi server");
    }
}

const logout = async (req, res, next) => {
    try {
        const { user, token } = req;
        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập hệ thống");
        }

        req.clearCookie('accessToken');
        req.redirect('/');

        return successCode(res, { user }, "Đăng xuất thành công");
    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const uploadAvatar = async (req, res, next) => {
    try {
        const { user, file } = req;
        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống");
        }

        if (!file) {
            const newUser = await prisma.user.update({
                where: {
                    user_id: user.user_id
                },
                data: {
                    avatar: null
                }
            })

            return successCode(res, { user: newUser }, "Cập nhật avatar thành công")
        }

        fs.readFile(`${process.cwd()}/public/images/${file.filename}`, async (err, data) => {
            if (err) return serverErrorCode(res, "Lỗi server");

            const path = `data:${file.mimetype};base64,${Buffer.from(data.toString("base64"))}`;
            //delete file BE
            fs.unlinkSync(`${process.cwd()}/public/images/${file.filename}`);

            const newUser = await prisma.user.update({
                where: {
                    user_id: user.user_id
                },
                data: {
                    avatar: path
                }
            })

            return successCode(res, { user: newUser }, "Cập nhật avatar thành công");
        })

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const getUserDetail = async (req, res, next) => {
    try {
        let { user_id } = req.params;

        if (!user_id) {
            return badRequestCode(res, "Thêm thông tin id người dùng cần lấy thông tin")
        }

        user_id = +user_id;
        if (Number.isNaN(user_id)) {
            return badRequestCode(res, "Id người dùng không hợp lệ")
        }

        const userDB = await prisma.user.findFirst({
            where: {
                user_id
            }
        })

        if (!userDB) {
            return notFoundCode(res, "Không tìm thấy người dùng này")
        }

        return successCode(res, { user: userDB }, "Lấy thông tin chi tiết người dùng thành công")

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

const updateUserDetail = async (req, res, next) => {
    try {
        let { user_id } = req.params;

        let { email, password, fullname, age } = req.body;

        const user = req.user;

        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập hệ thống")
        }

        if (!user_id) {
            return badRequestCode(res, "Thêm thông tin id người dùng cần lấy thông tin")
        }

        user_id = +user_id;
        if (Number.isNaN(user_id)) {
            return badRequestCode(res, "Id người dùng không hợp lệ")
        }

        if (user.user_id !== user_id) {
            return forbiddenCode(res, "Bạn không có quyền thực hiện thao tác này")
        }

        const userDB = await prisma.user.findFirst({
            where: {
                user_id
            }
        })

        if (!userDB) {
            return notFoundCode(res, "Không tìm thấy người dùng này")
        }


        if (email) {
            //check email exist
            const existUser = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: {
                        user_id
                    }
                }
            })

            if (existUser) {
                return badRequestCode(res, "Email này đã được người dùng khác đăng ký trong hệ thống");
            }
        }

        const newUserModel = {
            ...(password && { password: bcrypt.hashSync(password, 8) }),
            ...(fullname && { fullname }),
            ...(email && { email }),
            ...(age && { age: +age })
        }

        const updateUser = await prisma.user.update({
            where: {
                user_id
            },
            data: newUserModel
        })

        return successCode(res, { user: updateUser }, "Cập nhật thông tin người dùng thành công")

    } catch (err) {
        console.log(err);
        return serverErrorCode(res, "Lỗi server");
    }
}

module.exports = {
    resgister,
    signin,
    logout,
    uploadAvatar,
    getUserDetail,
    updateUserDetail
}