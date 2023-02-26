const { PrismaClient, Prisma } = require('@prisma/client');
const { MISSING_INFO } = require('../config/errorMessage');
const { badRequestCode, serverErrorCode, notFoundCode, successCode, unauthorizedCode } = require('../config/response');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { API_SECRET } = require('../config/secret');

const prisma = new PrismaClient()

const resgister = async (req, res, next) => {
    try {
        const {
            // user_id,
            password,
            fullname,
            email,
            age,
            avatar
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
            avatar
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

module.exports = {
    resgister,
    signin,
    logout
}