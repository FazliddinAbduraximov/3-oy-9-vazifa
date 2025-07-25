import Joi from "joi";

class AdminValidator {
    constructor() {
        this.passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&*]).{8,}$/;
        // this.passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&*]).{8,}$/;

    }
    create(data) {
        const admin = Joi.object({
            username: Joi.string().min(2).required().messages({
                "string.base": "Foydalanuvchi nomi matn bolishi kerak",
                "string.empty": "Foydalanuvchi nomi bosh bolmasligi kerak",
                "string.min": "Foydalanuvchi nomi kamida 2 ta belgidan iborat bolishi kerak",
                "any.required": "Foydalanuvchi nomi majburiy"
            }),
            email: Joi.string().email().required().messages({
                "string.base": "Email matn bolishi kerak",
                "string.empty": "Email bosh bolmasligi kerak",
                "string.email": "Email notogri formatda kiritilgan",
                "any.required": "Email majburiy"
            }),
            password: Joi.string().pattern(this.passRegex).required().messages({
                "string.pattern.base": "Parol kamida 8 ta belgi bolishi, katta va kichik harf, raqam hamda maxsus belgi (@$!%?&*) bo‘lishi kerak",
                "string.empty": "Parol bosh bolmasligi kerak",
                "any.required": "Parol majburiy"
            })
        })
        return admin.validate(data);
    }


    signIn(data) {
        const admin = Joi.object({
            username: Joi.string().required().messages({
                "string.base": "Foydalanuvchi nomi matn bolishi kerak",
                "string.empty": "Foydalanuvchi nomi bosh bolmasligi kerak",
                "string.min": "Foydalanuvchi nomi kamida 2 ta belgidan iborat bolishi kerak",
                "any.required": "Foydalanuvchi nomi majburiy"
            }),
            password: Joi.string().required().messages({
                "string.pattern.base": "Parol kamida 8 ta belgi bolishi, katta va kichik harf, raqam hamda maxsus belgi (@$!%?&*) bo‘lishi kerak",
                "string.empty": "Parol bosh bolmasligi kerak",
                "any.required": "Parol majburiy"
            })
        })
        return admin.validate(data);
    }


    update(data) {
        const admin = Joi.object({
            username: Joi.string().min(2).optional().messages({
                "string.base": "Foydalanuvchi nomi matn bolishi kerak",
                "string.empty": "Foydalanuvchi nomi bosh bolmasligi kerak",
                "string.min": "Foydalanuvchi nomi kamida 2 ta belgidan iborat bolishi kerak",
                "any.required": "Foydalanuvchi nomi majburiy"
            }),
            email: Joi.string().email().optional().messages({
                "string.base": "Email matn bolishi kerak",
                "string.empty": "Email bosh bolmasligi kerak",
                "string.email": "Email notogri formatda kiritilgan",
                "any.required": "Email majburiy"
            }),
            password: Joi.string().pattern(this.passRegex).optional().messages({
                "string.pattern.base": "Parol kamida 8 ta belgi bolishi, katta va kichik harf, raqam hamda maxsus belgi (@$!%?&*) bo‘lishi kerak",
                "string.empty": "Parol bosh bolmasligi kerak",
                "any.required": "Parol majburiy"
            })
        })
        return admin.validate(data);
    }

}

export default new AdminValidator();