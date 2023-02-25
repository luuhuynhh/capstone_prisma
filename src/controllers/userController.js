const { PrismaClient, Prisma } = require('@prisma/client');
const { MISSING_INFO } = require('../config/errorMessage');
const { badRequestCode } = require('../config/response');

const prisma = new PrismaClient()

const resgister = async (req, res, next) => {
    try {
        const {
            user_id,
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
        const newUserModel = {
            user_id,
            password,
            fullname,
            email,
            age,
            avatar
        }

        const createUser = await prisma.user.create({ data: newUserModel });
        console.log(createUser);
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    resgister
}