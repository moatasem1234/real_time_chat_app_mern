import bcryptjs from 'bcryptjs'
import bcrypt from 'bcryptjs'

import User from "../models/user.model.js"
import generateTokenAndSetCookie from '../utils/generateToken.js';


export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        // console.log(req.body);
        // تحقق من تطابق كلمة المرور
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                msg: "Passwords don't match",
            });
        }
        // تحقق من وجود المستخدم بالفعل
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "Username already exists",
            });
        }

        // تشفير كلمة المرور
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt); // إضافة await هنا

        // تحديد صورة الملف الشخصي بناءً على الجنس
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // إنشاء مستخدم جديد
        const newUser = new User({
            fullName,
            username,
            gender,
            password: hashedPassword,
            profilePic: gender === 'male' ? boyProfilePic : girlProfilePic, // استخدام ثلاثي الشرط
        });

        if (newUser) {
            // Generate jwt token 
            generateTokenAndSetCookie(newUser._id.toString(), res)
            // حفظ المستخدم في قاعدة البيانات
            await newUser.save();
            // إرسال الاستجابة الناجحة
            return res.status(201).json({
                success: true,
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    username: newUser.username,
                    profilePic: newUser.profilePic,
                    gender: newUser.gender,
                },
                msg: 'User created successfully',
            });
        }
        else {
            return res.status(400).json({
                success: false,
                msg: 'Invalid User data',
            });

        }

    } catch (error) {
        console.error("This error is from auth.controller.js signup function:", error);

        return res.status(500).json({
            success: false,
            msg: 'Something went wrong. Please try again later.',
            error
        });
    }
};

export const login = async (req, res) => {
    console.log(req.body)
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        console.log(user)

        const isPasswordCorrect = await bcrypt.compare(password.toString(), user?.password || "")


        if (!isPasswordCorrect || !user) {
            return res.status(400).json({
                success: false,
                msg: "Invalid username or password",
        
            });
        }

        generateTokenAndSetCookie(user._id.toString(), res)
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                profilePic: user.profilePic,
                gender: user.gender,
            },
            msg: 'User login successfully',
        });
    }
    catch (error) {
        console.error("This error is from auth.controller.js login function:", error);

        return res.status(500).json({
            success: false,
            msg: 'Something went wrong. Please try again later.',
            error
        });
    }

}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 })
        res.status(200).json({
            success: true,
            msg: 'User logout successfully',
        })
    }
    catch (error) {
        console.error("This error is from auth.controller.js logout function:", error);

        return res.status(500).json({
            success: false,
            msg: 'Something went wrong. Please try again later.',
            error
        });
    }
} 