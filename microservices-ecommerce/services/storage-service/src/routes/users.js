const express = require("express");

const {
    getAllUsers,
    getUserById,
    createUser
} = require("../repositories/userRepository");

const router = express.Router();


router.get("/", async (req, res) => {

    try {

        const users = await getAllUsers();

        res.json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve users"
        });
    }
});


router.get("/:id", async (req, res) => {

    try {

        const user =
            await getUserById(req.params.id);

        if (!user) {

            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve user"
        });
    }
});


router.post("/", async (req, res) => {

    try {

        const { name, email } = req.body;

        if (!name || !email) {

            return res.status(400).json({
                error: "name and email are required"
            });
        }

        const user =
            await createUser(name, email);

        res.status(201).json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to create user"
        });
    }
});


module.exports = router;
