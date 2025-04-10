import { ServerRoute } from '@hapi/hapi'
import userModel from '../model/user'

interface user {
    email: String,
    password: String,
}

interface EditSubAdmin {
    id: string;
    email: string;
    password: string;
}

interface deleteSubAdmin {
    id: String;
    role:'subAdmin'
}


export const userRoutes: ServerRoute[] = [

    // register Super Admin
    {
        method: 'POST',
        path: '/admin',
        handler: async (req, h) => {
            const { email, password } = req.payload as user
            const isAdmin = await userModel.findOne({ role: 'superAdmin' })
            
            if (!isAdmin) {
                
                try {
                    const newAdmin = new userModel({
                        email,
                        password,
                        role: 'superAdmin',
                        isLogin: false
                    })

                    await newAdmin.save()
                    return h.response(newAdmin).code(201)
                }

                catch (err) {
                    return h.response({ error: (err as Error).message }).code(400)
                }
            
            }
            
            else {
                return h.response({ msg: "Super admin already exists" }).code(400)
            }
        }
    },

    // login Super Admin
    {
        method: 'POST',
        path: '/admin/login',
        handler: async (req, h) => {
            const { email, password } = req.payload as user
    
            try {
    
                const admin = await userModel.findOne({
                    email,
                    role: 'superAdmin'
                })
    
                if (!admin) {
                    return h.response({ error: 'Authentication failed' }).code(401);
                }
    
                const isPasswordValid = await (password == admin.password);
    
                if (!isPasswordValid) {
                    return h.response({ error: 'Authentication failed' }).code(401);
                }
    
                const adminData = {
                    email: admin.email,
                    role: admin.role,
                };
    
                admin.isLogin = true
                await admin.save()
    
                return h.response({ success: true, user: adminData }).code(200);
    
            }
            catch (error) {
                req.log('error');
                return h.response({ error: 'Login processing failed' }).code(500);
            }
        }
    },
    
    // Create Sub Admin
    {
        method: 'POST',
        path: '/sub-admin/create',
        handler: async (req, h) => {
    
            const { email, password } = req.payload as user
            const isAdmin = await userModel.findOne({ isLogin: true })
    
            try {
    
                if (isAdmin) {
                    const newSubAdmin = new userModel({
                        email,
                        password,
                        role: 'subAdmin',
                    })
                    await newSubAdmin.save()
                    return h.response(newSubAdmin).code(201)
    
                }
                else {
                    return h.response({ msg: 'admin not login' }).code(400)
                }

            }
            catch (err) {
                return h.response({ error: (err as Error).message }).code(400)
            }

        }
    },

    // edit sub admin
    {
        method: 'patch',
        path: '/sub-admin/edit',
        handler: async (req, h) => {
            
            const payload = req.payload as EditSubAdmin
            const isAdmin = await userModel.findOne({ isLogin: true })
            
            try {
            
                if (isAdmin) {
                    const updates: any = {};
                    if (payload.email) updates.email = payload.email;
                    if (payload.password) updates.password = payload.password;

                    const subAdmin = await userModel.findOne({
                        _id: payload.id,
                        role: 'subAdmin'
                    })
            
                    if (!subAdmin) {
                        return h.response({ error: 'Sub-admin not found' }).code(404);
                    }
            
                    const updatedAdmin = await userModel.findByIdAndUpdate(
                        payload.id,
                        { $set: updates },
                    )
                    return h.response({ msg: updatedAdmin }).code(200)
            
                }
                else {
                    return h.response({ msg: "Super admin not login" }).code(400)
                }

            }
            catch (err) {
                return h.response({ error: (err as Error).message }).code(400)
            }
        }
    },

    // delete sub admin
    {
        method: 'DELETE',
        path: '/sub-admin/delete',
        handler: async (req, h) => {
           
            const isAdmin = await userModel.findOne({ isLogin: true })
            const payload = req.payload as deleteSubAdmin
           
            try {
           
                if (isAdmin) {
                    // const sub=await userModel.findOne({id:payload.id,role:'subAdmin'});
                    // if(sub){
                        const deletedAdmin = await userModel.findByIdAndDelete(payload.id);
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
                    return h.response({ msg: "Super Admin not login" }).code(400)
                }
           
            }
            catch (err) {
                return h.response({ error: 'Deletion failed', details: (err as Error).message }).code(500);
            }
        }
    },

    //logout Super Admin
    {
        method: 'post',
        path: '/admin/logout',
        handler: async (req, h) => {
            
            const isAdmin = await userModel.findOne({ isLogin: true })
            
            try {
            
                if (isAdmin) {
                    const admin = await userModel.findOne({
                        role: 'superAdmin'
                    })
            
                    if (admin) {
                        admin.isLogin=false;
                        await admin.save()
                        return h.response({ error: 'Logout Successfully' }).code(200);
                    }
                
                }
                else {
                    return h.response({ msg: "Super admin already logout" }).code(400)
                }
            
            }
            catch (err) {
                return h.response({ error: (err as Error).message }).code(400)
            }
        }
    },
]