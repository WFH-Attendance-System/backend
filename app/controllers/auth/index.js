const userService = require("../../services/user");
const {
    checkPassword,
    createToken,
    createRefreshToken,
} = require("../../utils/encryption");

async function login(req, res) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw new Error("Email dan password harus diisi");
        }

        const user = await userService.findByEmail(email);
        const isPasswordCorrect = await checkPassword(user.password, password);

        if (!isPasswordCorrect) {
            throw new Error("Email atau password salah");
        }

        const payload = {
            id: user.id,
            email: user.email,
            dept_id: user.dept_id,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
        const token = await createToken(payload);
        const refreshToken = await createRefreshToken(payload);
        const userRefreshToken = await userService.createRefreshToken(
            user.id,
            refreshToken
        );
        if (!userRefreshToken) {
            throw new Error("Failed to create refresh token");
        }

        res.cookie("accessToken", token, { httpOnly: true, secure: true });
        return res.status(200).json({
            message: "Success Login",
            data: {
                id: user.id,
                email: user.email,
                nama: user.nama,
                token,
                refreshToken,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: e.message,
        });
    }
}

async function logout(req, res) {
    try {
        const logout = userService.logout(req.user.id);
        if (!logout) {
            throw new Error("Logout failed");
        }

        res.clearCookie("accessToken");
        res.status(200).json({
            message: "Logout success",
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: e.message,
        });
    }
}

async function whoAmI(req, res) {
    return res.json({
        message: "Success",
        data: req.user,
    });
}

module.exports = {
    login,
    logout,
    whoAmI,
};
