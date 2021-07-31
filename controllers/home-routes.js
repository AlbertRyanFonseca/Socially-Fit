const router = require("express").Router();
const {
    Post,
    User,
    Comment,
    Picture,
    Type,
    Tags,
    Difficulty,
    PostTags,
} = require("../models");
const sequelize = require("../config/connection");
const isSignedIn = require("../utils/userAuth");
const { Op } = require("sequelize");

router.get("/", (req, res) => {
    res.render("homepage");
});

router.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/exercises");
        return;
    }

    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/profile", isSignedIn, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id,
        },
        attributes: [
            "id",
            "title",
            "description",
            "created_at",
            [
                sequelize.literal(
                    "(SELECT COUNT(*) FROM votes WHERE post.id = votes.post_id)"
                ),
                "vote_count",
            ],
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    "id",
                    "comment_text",
                    "user_id",
                    "post_id",
                    "created_at",
                    [
                        sequelize.literal(
                            "(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)"
                        ),
                        "comment_count",
                    ],
                ],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            },
            {
                model: Picture,
                attributes: ["image_url"],
            },
        ],
    })
        .then((dbPostData) => {
            const posts = dbPostData.map((post) => {
                post.dataValues.loggedIn = req.session.loggedIn;
                return post.get({ plain: true });
            });
            res.render("profile", {
                posts,
                loggedIn: req.session.loggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.get("/filtered-exercises", (req, res) => {
    Post.findAll({
        where: {
            [Op.or]: [
                {
                    difficulty_id: {
                        [Op.eq]: [req.query.difficulty],
                    },
                },
                {
                    type_id: {
                        [Op.eq]: [req.query.type],
                    },
                },
            ],
        },
        include: [
            {
                model: Comment,
                attributes: [
                    "id",
                    "comment_text",
                    "post_id",
                    "user_id",
                    "created_at",
                ],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            },
            {
                model: Picture,
                attributes: ["image_url"],
            },
            {
                model: Tags,
                attributes: ["title"],
                through: PostTags,
            },
            {
                model: Difficulty,
                attributes: ["difficulty"],
            },
        ],
        attributes: [
            "id",
            "title",
            "created_at",
            "description",
            [
                sequelize.literal(
                    "(SELECT COUNT(*) FROM votes WHERE post.id = votes.post_id)"
                ),
                "vote_count",
            ],
        ],
        
    }).then((dbPostData) => {
        const posts = dbPostData.map((post) => {
            post.dataValues.loggedIn = req.session.loggedIn;
            return post.get({ plain: true });
        });
        console.log(posts);
        res.render("exercises", {
            posts,
        });
    });
});

router.get("/exercises", (req, res) => {
    Post.findAll({
        attributes: [
            "id",
            "title",
            "description",
            "created_at",
            [
                sequelize.literal(
                    "(SELECT COUNT(*) FROM votes WHERE post.id = votes.post_id)"
                ),
                "vote_count",
            ],
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    "id",
                    "comment_text",
                    "user_id",
                    "post_id",
                    "created_at",
                    [
                        sequelize.literal(
                            "(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)"
                        ),
                        "comment_count",
                    ],
                ],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            },
            {
                model: Picture,
                attributes: ["image_url"],
            },
        ],
    })
        .then((dbPostData) => {
            const posts = dbPostData.map((post) => {
                post.dataValues.loggedIn = req.session.loggedIn;
                return post.get({ plain: true });
            });
            res.render("exercises", {
                posts,
                loggedIn: req.session.loggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// router.get("/type", (req, res) => {
//     Type.findAll({
//         attributes: ["id", "type"],
//         // where: {
//         //     // user_id: req.session.user_id
//         // },
//         // include: [
//         //      {
//         //         model: Tags,
//         //         attributes: ['id', 'title'],
//         //     },
//         //     {
//         //         model: Difficulty,
//         //         attributes: ['id', 'difficulty']
//         //     }
//         // ]
//     })
//         .then((dbType) => {
//             console.log(dbType);
//             if (!dbType) {
//                 res.status(404).json({ message: "No info found!" });
//                 return;
//             }
//             const options = dbType.map((data) => data.get({ plain: true }));
//             console.log(options);

//             res.render("type-create", {
//                 options,
//                 // loggedIn: req.session.loggedIn
//             });
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

router.get("/create", isSignedIn, (req, res) => {
    Picture.findAll({
        attributes: ["image_url", "id"],
    })
        .then((dbPostData) => {
            const posts = dbPostData.map((post) => {
                post.dataValues.loggedIn = req.session.loggedIn;
                return post.get({ plain: true });
            });
            res.render("create-exercise", {
                posts,
                loggedIn: req.session.loggedIn,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
