import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Importa bcrypt como um módulo padrão

const { genSalt, hash } = bcrypt; // Desestrutura as funções genSalt e hash

const userSchema = new mongoose.Schema({ 
    email: {
        type: String, 
        required: [true, "Email is required."],
        unique: true,
    }, 
    password: {
        type: String, 
        required: [true, "Password is required."],
    },
    firstName: {
        type: String, 
        required: false,
    },
    lastName: {
        type: String, 
        required: false,
    }, 
    image: {
        type: String, 
        required: false,
    },
    color: {
        type: Number, 
        required: false,
    },
    profileSetup: {
        type: Boolean, 
        default: false,
    },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) { // Verifica se a senha foi modificada
        const salt = await genSalt(10); // Gera um salt com 10 rounds
        this.password = await hash(this.password, salt); // Faz o hash da senha
    }
    next();
});

const User = mongoose.model("User", userSchema); // Nome do modelo deve ser "User" para seguir convenções

export default User;
