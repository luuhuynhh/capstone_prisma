const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { unauthorizedCode } = require("../config/response");
const { API_SECRET } = require("../config/secret");

const prisma = new PrismaClient()

const getToken = (headers) => {
    if (!headers || !headers.authorization || headers.authorization.split(' ').length !== 2) {
        return null;
    }
    return headers.authorization.split(' ')[1];
};

const verifyToken = async (req, res, next) => {
    const token = getToken(req.headers);

    console.log(token)
    if (!token) {
        return unauthorizedCode(res, "Vui lòng đăng nhập hệ thống");
    }

    try {
        const data = jwt.verify(token, API_SECRET);

        console.log(data);
        const user = await prisma.user.findFirst({
            where: {
                user_id: data.id
            }
        })
        if (!user) {
            return unauthorizedCode(res, "Vui lòng đăng nhập hệ thống");
        } else {
            req.user = user;
            req.token = token;
            next();
        }
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return unauthorizedCode(res, "Token hết hạn. Vui lòng đăng nhập lại vào hệ thống");
        }

        return unauthorizedCode(res, "Vui lòng đăng nhập vào hệ thống");
    }
};
module.exports = verifyToken;