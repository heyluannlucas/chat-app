import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; // Verifica o cookie jwt

    if (!token) {
        return res.status(401).send("Unauthorized"); // Não autenticado
    }

    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) {
            return res.status(403).send("Invalid token"); // Token inválido
        }

        req.userId = payload.userId; // Armazena o ID do usuário para uso posterior
        next(); // Continua a request
    });
};
