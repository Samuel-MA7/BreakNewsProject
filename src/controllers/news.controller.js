import { createService, 
    findAllService, 
    countNews, 
    topNewsService, 
    findByIdService, 
    searchByTitleService, 
    findByUserService,
    updateService, 
    deleteNewsService,
    likeNewsService,
    deleteLikeNewsService,
    commentNewsService,
    deleteCommentService } from "../services/news.service.js";

export const create = async (req, res) => {
try {
    const { title, text, banner } = req.body;

    if (!title || !text || !banner) {
        res.status(400).send({ message: "Submit all fields for registration"});
    }

    await createService({
        title,
        text,
        banner,
        user: req.userId,
    })

    res.send(201);
} catch (err) {
    res.status(500).send({ message: err.message});
}
};

export const findAll = async (req, res) => {
try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
        limit = 5;
    }

    if (!offset) {
        offset = 0;
    }

    const news = await findAllService(limit, offset);
    const total = await countNews();
    const currentUrl = req.baseUrl;

    const next = limit + offset;
    const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null;

    if (news.length === 0) {
        res.status(400).send({ message: "There are no news!"});
    }

    res.send({
        nextUrl,
        previousUrl,
        limit,
        offset,
        total,

        results: news.map((item) => ({
            id: item._id,
            title: item.title,
            text: item.text,
            banner: item.banner,
            likes: item.likes,
            comments: item.comments,
            name: item.user.name,
            userName: item.user.username,
            userAvatar: item.user.avatar,
        }))
    });
} catch (err) {
    res.status(500).send({ message: err.message});
}    
};

export const topNews = async (req, res) => {
try {
    const news = await topNewsService();

    if (!news) {
        return res.status(400).send({ message: "Error! There is no registered news."});
    }

    res.send({
        news: {
            id: news._id,
            title: news.title,
            text: news.text,
            banner: news.banner,
            likes: news.likes,
            comments: news.comments,
            name: news.user.name,
            userName: news.user.username,
            userAvatar: news.user.avatar,
        },
    });
} catch (err) {
    res.status(500).send({ message: err.message});
}  
}; 

export const findById = async (req, res) => {
try{
    const { id } = req.params;

    const news = await findByIdService(id);

    return res.send({
        news: {
            id: news._id,
            title: news.title,
            text: news.text,
            banner: news.banner,
            likes: news.likes,
            comments: news.comments,
            name: news.user.name,
            userName: news.user.username,
            userAvatar: news.user.avatar,
        },
    });

} catch (err) {
    res.status(500).send({ message: err.message});
}
};

export const searchByTitle = async (req, res) => {
try {
    const { title } = req.query;

    const news = await searchByTitleService(title);

    if (news.length === 0) {
        return res.status(400).send({ message: "There is no post with this title!"});
    }

    return res.send({
        results: news.map((item) => ({
            id: item._id,
            title: item.title,
            text: item.text,
            banner: item.banner,
            likes: item.likes,
            comments: item.comments,
            name: item.user.name,
            userName: item.user.username,
            userAvatar: item.user.avatar,
        })),
    });

} catch (err) {
    res.status(500).send({ message: err.message});
}
};

export const findByUser = async (req, res) => {
try {
    const id = req.userId;
    const news = await findByUserService(id);

    return res.send({
        results: news.map((item) => ({
            id: item._id,
            title: item.title,
            text: item.text,
            banner: item.banner,
            likes: item.likes,
            comments: item.comments,
            name: item.user.name,
            userName: item.user.username,
            userAvatar: item.user.avatar,
        })),
    });
} catch (err) {
    res.status(500).send({ message: err.message});
}
};

export const update = async (req, res) => {
try {
    const { title, text, banner } = req.body;
    const { id } = req.params;

    if (!title && !text && !banner) {
        res.status(400).send({ message: "Submit all fields for registration" });
    }

    const news = await findByIdService(id);

    if (news.user._id != req.userId) {
        return res.status(400).send({ message: "You can't modify news you didn't make" });
    }

    await updateService(id, title, text, banner);

    return res.send({ message: "Post successfully modified!" });
} catch (err) {
    res.status(500).send({ message: err.message});
}
};

export const deleteNews = async (req, res) => {
try {
    const { id } = req.params;

    const news = await findByIdService(id);

    if (news.user._id != req.userId) {
        return res.status(400).send({ message: "You can't delete news you didn't make" });
    }

    await deleteNewsService(id);

    return res.send({ message: "Post successfully deleted!" });
} catch (err) {
    res.status(500).send({ message: err.message});
}
};

export const likeNews = async (req, res) => {
try{
    const { id } = req.params;
    const userId = req.userId;

    const newsLiked = await likeNewsService(id, userId);

    if (!newsLiked) {
        await deleteLikeNewsService(id, userId);
        return res.status(200).send({ message: "Like removed" });
    }

    res.send({ message: "Liked!" });
} catch (err) {
    res.status(500).send({ message: err.message });
}
};

export const commentNews = async (req, res) => {
try {
    const { id } = req.params;
    const userId = req.userId;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).send({ message: "You wrote no comment"});
    }

    await commentNewsService(id, comment, userId);

    res.send({ message: "Comment posted" })
} catch (err) {
    res.status(500).send({ message: err.message });
}
};

export const deleteComment = async (req, res) => {
try {
    const { newsId, commentId } = req.params;
    const userId = req.userId;

    const commentDeleted = await deleteCommentService(newsId, commentId, userId);

    const commentSeeker = commentDeleted.comments.find(
        (comment) => comment.commentId === commentId 
    );

    if (!commentSeeker) {
        return res.status(404).send({ message: "Comment not found" });
    }

    if (commentSeeker.userId !== userId) {
        return res.status(400).send({ message: "This comment is not yours" });
    }

    res.send({ message: "Comment removed" })
} catch (err) {
    res.status(500).send({ message: err.message });
}
};