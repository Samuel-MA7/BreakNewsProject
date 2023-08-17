import News from "../models/News.js";

export const createService = (body) => News.create(body); 

export const findAllService = (limit, offset) => News.find().sort({ 
    _id: -1 }).skip(offset).limit(limit).populate("user");

export const countNews = () => News.countDocuments();

export const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("user");

export const findByIdService = (id) => News.findById(id).populate("user");

export const searchByTitleService = (title) => News.find({
    title: { $regex: `${title || ""}`, $options: "i" },
}).sort({ _id: -1 }).populate("user");

export const findByUserService = (id) => News.find({
    user: id}).sort({ _id: -1 }).populate("user");

export const updateService = (id, title, text, banner) => News.findOneAndUpdate({ 
    _id: id}, { title, text, banner }, { rawResult: true });

export const deleteNewsService = (id) => News.findByIdAndDelete({ _id: id });

export const likeNewsService = (newsId, userId) => News.findOneAndUpdate(
    { _id: newsId, "likes.userId": { $nin: [userId] } }, 
    { $push: { likes: { userId, created: new Date() } } }
);

export const deleteLikeNewsService = (newsId, userId) => News.findOneAndUpdate(
    { _id: newsId }, 
    { $pull: { likes: { userId} } }
);

export const commentNewsService = (newsId, comment, userId) => {
    let commentId = Math.floor(Date.now() * Math.random()).toString(30);

    return News.findOneAndUpdate(
        { _id: newsId },
        { $push: { comments: { commentId, userId, comment, createdAt: new Date() } } }
    );
};

export const deleteCommentService = (newsId, commentId, userId) => News.findOneAndUpdate(
    { _id: newsId },
    { $pull: { comments: { commentId, userId } } }
);