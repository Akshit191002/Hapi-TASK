"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const user_1 = __importDefault(require("../model/user"));
exports.userRoutes = [
    // register Super Admin
    {
        method: 'POST',
        path: '/admin',
        handler: (req, h) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = req.payload;
            const isAdmin = yield user_1.default.findOne({ role: 'superAdmin' });
            if (!isAdmin) {
                try {
                    const newAdmin = new user_1.default({
                        email,
                        password,
                        role: 'superAdmin',
                        isLogin: false
                    });
                    yield newAdmin.save();
                    return h.response(newAdmin).code(201);
                }
                catch (err) {
                    return h.response({ error: err.message }).code(400);
                }
            }
            else {
                return h.response({ msg: "Super admin already exists" }).code(400);
            }
        })
    },
    // login Super Admin
    {
        method: 'POST',
        path: '/admin/login',
        handler: (req, h) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = req.payload;
            try {
                const admin = yield user_1.default.findOne({
                    email,
                    role: 'superAdmin'
                });
                if (!admin) {
                    return h.response({ error: 'Authentication failed' }).code(401);
                }
                const isPasswordValid = yield (password == admin.password);
                if (!isPasswordValid) {
                    return h.response({ error: 'Authentication failed' }).code(401);
                }
                const adminData = {
                    email: admin.email,
                    role: admin.role,
                };
                admin.isLogin = true;
                yield admin.save();
                return h.response({ success: true, user: adminData }).code(200);
            }
            catch (error) {
                req.log('error');
                return h.response({ error: 'Login processing failed' }).code(500);
            }
        })
    },
    // Create Sub Admin
    {
        method: 'POST',
        path: '/sub-admin/create',
        handler: (req, h) => __awaiter(void 0, void 0, void 0, function* () {
            const { email, password } = req.payload;
            const isAdmin = yield user_1.default.findOne({ isLogin: true });
            try {
                if (isAdmin) {
                    const newSubAdmin = new user_1.default({
                        email,
                        password,
                        role: 'subAdmin',
                    });
                    yield newSubAdmin.save();
                    return h.response(newSubAdmin).code(201);
                }
                else {
                    return h.response({ msg: 'admin not login' }).code(400);
                }
            }
            catch (err) {
                return h.response({ error: err.message }).code(400);
            }
        })
    },
    // edit sub admin
    {
        method: 'patch',
        path: '/sub-admin/edit',
        handler: (req, h) => __awaiter(void 0, void 0, void 0, function* () {
            const payload = req.payload;
            const isAdmin = yield user_1.default.findOne({ isLogin: true });
            try {
                if (isAdmin) {
                    const updates = {};
                    if (payload.email)
                        updates.email = payload.email;
                    if (payload.password)
                        updates.password = payload.password;
                    const subAdmin = yield user_1.default.findOne({
                        _id: payload.id,
                        role: 'subAdmin'
                    });
                    if (!subAdmin) {
                        return h.response({ error: 'Sub-admin not found' }).code(404);
                    }
                    const updatedAdmin = yield user_1.default.findByIdAndUpdate(payload.id, { $set: updates });
                    return h.response({ msg: updatedAdmin }).code(200);
                }
                else {
                    return h.response({ msg: "Super admin not login" }).code(400);
                }
            }
            catch (err) {
                return h.response({ error: err.message }).code(400);
            }
        })
    },
    // delete sub admin
    {
        method: 'DELETE',
        path: '/sub-admin/delete',
        handler: (req, h) => __awaiter(void 0, void 0, void 0, function* () {
            const isAdmin = yield user_1.default.findOne({ isLogin: true });
            const payload = req.payload;
            try {
                if (isAdmin) {
                    // const sub=await userModel.findOne({id:payload.id,role:'subAdmin'});
                    // if(sub){
                    const deletedAdmin = yield user_1.default.findByIdAndDelete(payload.id);
                    if (!deletedAdmin) {
                        return h.response({ error: 'Sub-admin not found' }).code(404);
                    }
                    return h.response({
                        success: true,
                        message: 'Sub-admin deleted successfully'
                    }).code(200);
                    // }
                    // else{
                    //     return h.response({message: 'You cant delete Super Admin'}).code(400);
                    // }
                }
                else {
                    return h.response({ msg: "Super Admin not login" }).code(400);
                }
            }
            catch (err) {
                return h.response({ error: 'Deletion failed', details: err.message }).code(500);
            }
        })
    },
    //logout Super Admin
    {
        method: 'post',
        path: '/admin/logout',
        handler: (req, h) => __awaiter(void 0, void 0, void 0, function* () {
            const isAdmin = yield user_1.default.findOne({ isLogin: true });
            try {
                if (isAdmin) {
                    const admin = yield user_1.default.findOne({
                        role: 'superAdmin'
                    });
                    if (admin) {
                        admin.isLogin = false;
                        yield admin.save();
                        return h.response({ error: 'Logout Successfully' }).code(200);
                    }
                }
                else {
                    return h.response({ msg: "Super admin already logout" }).code(400);
                }
            }
            catch (err) {
                return h.response({ error: err.message }).code(400);
            }
        })
    },
];
