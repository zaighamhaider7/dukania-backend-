const User = require("../models/Users")


const createStore = async (req, res) => {
    try {
        const { storeName, storeUsername, whatsappNumber, category, description } = req.body;

        if (!storeName) {
            return res.status(409).json({
                field: "storeName",
                msg: "Store Name is required"
            });
        }
        if (!storeUsername) {
            return res.status(409).json({
                field: "storeUsername",
                msg: "Store Username is required"
            });
        }
        if (!whatsappNumber) {
            return res.status(409).json({
                field: "whatsappNumber",
                msg: "Whatsapp Number is required"
            });
        }
        if (!category) {
            return res.status(409).json({
                field: "category",
                msg: "Category is required"
            });
        }

        if (req.user.storeName) {
            return res.status(409).json({
                msg: "Store already exists"
            });
        }

        const userNameExist = await User.findOne({ storeUsername });

        if (userNameExist) {
            return res.status(409).json({
                field: "storeUsername",
                msg: "Store Username already exists",
            });
        }

        const user = req.user;

        user.storeName = storeName;
        user.storeUsername = storeUsername;
        user.whatsappNumber = whatsappNumber;
        user.category = category;
        user.description = description;

        if (req.file) {
            user.logo = req.file.path;
        }

        await user.save();

        return res.status(200).json({
            msg: "Store created successfully",
            user
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}

const getStore = async (req, res) => {
    try {
        const { storeUsername } = req.params;

        console.log("Username:", req.params.storeUsername);

        const store = await User.findOne({ storeUsername })
            .select("storeName storeUsername whatsappNumber category description logo");

        if (!store) {
            return res.status(404).json({
                msg: "Store not found",
            });
        }

        return res.status(200).json({
            msg: "Store fetched successfully",
            store,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: "Internal Server Error",
        });
    }
};

module.exports = { createStore, getStore }
