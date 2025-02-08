const userService = require("../../services/user");
const {
    checkPassword,
    createToken,
    createRefreshToken,
} = require("../../utils/encryption");
const jwt = require("jsonwebtoken");

async function updateRefreshToken(res, payload) {
    const newRefreshToken = await createRefreshToken(payload);
    const decoded = jwt.verify(newRefreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.id;
    if (!userId) {
        throw new Error("User ID not found");
    }

    const userRefreshToken = await userService.createRefreshToken(
        userId,
        newRefreshToken
    );
    if (!userRefreshToken) {
        throw new Error("Failed to create refresh token");
    }

    res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: true,
    });

    return true;
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw new Error("Email dan password harus diisi");
        }

        const user = await userService.findOne({ email: email }, [
            "user.*",
            "department.name as dept_name",
        ]);
        if (!user) {
            throw new Error("Email atau password salah");
        }

        const isPasswordCorrect = await checkPassword(user.password, password);
        if (!isPasswordCorrect) {
            throw new Error("Email atau password salah");
        }

        const payload = {
            id: user.id,
            email: user.email,
            dept_id: user.dept_id,
            dept_name: user.dept_name,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };
        const token = await createToken(payload);
        const refreshToken = await updateRefreshToken(res, payload);
        if (!refreshToken) {
            throw new Error("Refresh Token gagal dibuat");
        }

        return res.status(200).json({
            message: "Success Login",
            data: {
                id: user.id,
                email: user.email,
                nama: user.nama,
                token,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            },
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
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

        res.clearCookie("refresh_token");
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

async function refreshToken(req, res) {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
        return res.status(400).send("Refresh token harus diisi");
    }

    try {
        const user = await userService.findOne(
            { refresh_token: refresh_token },
            ["user.*", "department.name as dept_name"]
        );
        if (!user) {
            throw new Error("Refresh token tidak valid");
        }

        const payload = {
            id: user.id,
            email: user.email,
            dept_id: user.dept_id,
            dept_name: user.dept_name,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };

        const newAccessToken = await createToken(payload);
        const newRefreshToken = await updateRefreshToken(res, payload);
        if (!newRefreshToken) {
            throw new Error("Refresh Token gagal dibuat");
        }

        return res.status(200).json({
            message: "Token refreshed successfully",
            token: newAccessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
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
    refreshToken,
    whoAmI,
};
