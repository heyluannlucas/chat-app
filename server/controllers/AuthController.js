import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // Importa bcrypt para comparação de senhas

dotenv.config(); 

const maxAge = 3 * 24 * 60 * 60; // Ajuste maxAge para ser em segundos

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { // Usa jwt.sign
        expiresIn: maxAge,
    });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await User.create({ email, password });

        res.cookie("jwt", createToken(email, user.id), {
            maxAge: maxAge * 1000,
            secure: true,
            sameSite: "None",
        });

        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server error");
    }
};

// Função de login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const user = await User.findOne({ email }); // Busca o usuário pelo email
        if (!user) {
            return res.status(401).send("Invalid credentials"); // Se o usuário não for encontrado
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compara a senha
        if (!isMatch) {
            return res.status(401).send("Invalid credentials"); // Se a senha não corresponder
        }

        // Gera e envia o token JWT
        res.cookie("jwt", createToken(email, user.id), {
            maxAge: maxAge * 1000,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color:user.color,
            },
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server error");
    }
};