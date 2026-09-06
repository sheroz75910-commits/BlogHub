import { Articals } from "../../../models/ArticalModel.js";
import asyncHandler from "../../../utils/asyncHandler.js";
// import { like } from "../artical.controller.js";
import Comment from "../../../models/comment.model.js";
import { Profile } from "../../../models/profile.model.js";
import ArticleLike from "../../../models/like.Model.js";
import { ArticleView } from "../../../models/view.Model.js";
import { ArticleShare } from "../../../models/share.Model.js";
import User from "../../../models/Signup.model.js";
// import { useId } from "react";
// import Categorie from "../../../models/categorie.model.js";


const userDashboard = asyncHandler(async (req, res) => {

  const userId = req.user._id

  console.log("tvdyt3vyue che cue e e   userId", userId);
  

  const profile = await Profile.findOne({ User: userId });

  if(!profile) return null;
  // all blogs
  const allPostedArtical = await Articals.countDocuments({ username: profile._id });

  console.log("these are all posted artical", allPostedArtical);



  // monthlyBlog

  const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)
  const monthlyCreatedArtical = await Articals.countDocuments(
    {
      username: profile._id,
      createdAt: { $gte: startDate, $lte: endDate }
    }
  )

  console.log("these are all monthly posted artical", monthlyCreatedArtical);


  // todayBlog
  const startDay = new Date()
  startDay.setHours(0, 0, 0, 0)
  const endDay = new Date()
  endDay.setHours(23, 59, 59, 999)

  const todayArtical = await Articals.countDocuments(
    {
      username: profile._id,
      createdAt: { $gte: startDay, $lte: endDay }
    }
  )
  console.log("these are all today posted artical", todayArtical);


  
  //    Total like of all blogs
  const articleIds = await Articals.find({username : profile._id}, {_id: 1})
  const articleId = articleIds.map(article => article._id)

  const allLikes = await ArticleLike.countDocuments({article : {$in : articleId}});
  
  console.log("allLikes", allLikes);
  


  //    Monthly like of blogs 
  const startDataForLikes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endDateForLikes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)

  const monthlyLikes = await ArticleLike.countDocuments({
      article :{$in : articleId},
    createdAt : {$gte : startDataForLikes, $lte : endDateForLikes}
  })
 

  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)
  const dayend = new Date()
  dayend.setHours(23, 59, 59, 999)

  const dayLikes = await ArticleLike.countDocuments({
     article :{$in : articleId},
    
    createdAt :{$gte : dayStart, $lte : dayend}
  })

  console.log("dayLikes", dayLikes);
  

  console.log("this is day likes", dayLikes);



  const comments = await Comment.countDocuments({articls : {$in : articleId}});
  console.log("all commmensts are", comments);



  const monthlyCommentStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthlyCommentEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)


  const monthlyComment = await Comment.countDocuments(
    {
      articls : {$in : articleId},
      createdAt: { $gte: monthlyCommentStart, $lte: monthlyCommentEnd }
    }
  )
  console.log("these are monylt commments ", monthlyComment);

  const dayCommetStart = new Date()
  dayCommetStart.setHours(0, 0, 0, 0)


  const dayCommetEnd = new Date()
  dayCommetEnd.setHours(23, 59, 59, 999)

  const dayCommets = await Comment.countDocuments(
    {
      articls : {$in : articleId},
      createdAt: { $gte: dayCommetStart, $lte: dayCommetEnd }

    }

  )
  console.log("these are  day comments", dayCommets);





  // const profile = await Profile.findOne({User : req.user._id});
  const Categorie = profile.category;


  const articalcount = await Articals.aggregate([
    { $match: { username: profile._id } },
    { $match: { category: { $in: Categorie } } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ])



  const categoryState = Categorie.map(cat => {
    const found = articalcount.find(c => c._id === cat)
    return {
      name: cat,
      count: found ? found.count : 0
    }
  })




const now = new Date();

const dayKey = now.toISOString().slice(0, 10);   // "2026-01-20"
const monthKey = dayKey.slice(0, 7);             // "2026-01"




const views = await ArticleView.find({article :{$in : articleId},})

console.log("view", views);






const totalViews = views.reduce((sum, view) => sum +(view?.monetized || 0), 0)
const monthViews = views.reduce((sum, view)=> sum +(view?.monthly?.get(monthKey)?.monetized || 0), 0)
const todayViews = views.reduce((sum, view) => sum +(view?.daily?.get(dayKey)?.monetized || 0), 0)
console.log("totalViews", totalViews);
console.log("monthViews", monthViews);
console.log("todayViews", todayViews);


const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 23, 59, 59, 999)


const StartdayDate = new Date();
StartdayDate.setHours(0,0,0,0)
const enddayDate = new Date();
enddayDate.setHours(23,59,59,999)



const totalShare = await ArticleShare.aggregate([
  {
    $match :{article : {$in : articleId}}
  },
  {
    $count : "total"
  }
]);

const Shares = await ArticleShare.aggregate([
  {
    $match :{
      article: { $in: articleId },
      createdAt :{$gte : monthStart, $lte : monthEnd}
    }
  },
  {
    $count : "total"
  }
  
]);
const daySharesArticle = await ArticleShare.aggregate([
  {
    $match :{
     article: { $in: articleId },
      createdAt :{$gte : StartdayDate, $lte : enddayDate}
    }
    
  },
  { 
    $count : "total"
  }
]);
// console.log("totalShareArticals", totalShareArticals);
//       console.log("monthlyShares", monthlyShares);
// console.log("dayShares", dayShares);
const totalShareArticals = totalShare[0]?.total || 0
const monthlyShares = Shares[0]?.total || 0
const dayShares = daySharesArticle[0]?.total || 0


  /***** ======== Section share END ========= *****/



  res.render("Dashbord/my-Dashboard.ejs", {
  
    title: 'Dashboard',
    allPostedArtical,
    monthlyCreatedArtical,
    todayArtical,
    likes: allLikes,
    monthlyLikes,
    dayLikes,
    comments,
    monthlyComment,
    dayCommets,
    categoryState,
    totalViews,
    monthViews,
    todayViews,
    totalShareArticals,
    monthlyShares,
    dayShares,

  });

})

const getDashbordChartData = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const userId = req.user._id

  // Fetch all articles once
  // .select("views.daily like shareHistory");
  // console.log("articles",articles);
  const profile = await Profile.findOne({User : userId})
  console.log("profile from db", profile);
  

  const articalId = await Articals.find({username : profile.id})
  const viewsArticles = await ArticleView.find({ article : {$in : articalId} })
  const likedArticals = await ArticleLike.find({article : {$in : articalId}})
  const shareArticals = await ArticleShare.find({article : {$in : articalId}})
  // console.log("viewsArticles", viewsArticles);
  // console.log("likedArtical", likedArticals);
  // console.log("shareArtical", shareArticals);
  
    

  const labels = [];
  const viewsArr = [];
  const likesArr = [];
  const sharesArr = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
  const dayKey = date.toISOString().slice(0, 10); // ✅ DEFINE HERE
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    labels.push(date.toISOString().slice(0, 10)); // MM-DD

    let dayViews = 0;
    let dayLikes = 0;
    let dayShares = 0;
    // console.log("dayViews", dayViews);
    // console.log("dayLikes", dayLikes);
    // console.log("dayViews", dayViews);
    

    // const dayLIke = await ArticleLike.find()

   viewsArticles?.forEach(articalView =>{
      dayViews += articalView.daily?.get(dayKey)?.monetized || 0 
   })
    likedArticals.forEach(like =>{
      const likeDate =  like.createdAt.toISOString().slice(0, 10)
      if (likeDate === dayKey)  dayLikes +=1
    })
    
    shareArticals.forEach(shareArtical =>{
       const shareDate = shareArtical.createdAt.toISOString().slice(0, 10)
       if (shareDate === dayKey) dayShares +=1
    })

    viewsArr.push(dayViews);
    likesArr.push(dayLikes);
    sharesArr.push(dayShares);
  }

  return res.json({
    labels,
    views: viewsArr,
    likes: likesArr,
    shares: sharesArr,
  });
});

// const getDashbordChartData = asyncHandler(async (req, res) => {
//   const days = parseInt(req.query.days) || 30;
//   const profile = await Profile.findOne({ User: req.user._id });
//   const labels = [];
//   const viewsArr = [];
//   const likesArr = [];
//   const sharesArr = [];

//   for (let i = days - 1; i >= 0; i--) {
//     const date = new Date();
//     date.setDate(date.getDate() - i);

//     const start = new Date(date);
//     start.setHours(0, 0, 0, 0);
//     const end = new Date(date);
//     end.setHours(23, 59, 59, 999);

//     labels.push(`${date.getMonth() + 1}/${date.getDate()}`);

//     // Views
//     const dailyV = await Articals.aggregate([
//        {$match : {username: profile._id}},
//       { $unwind: "$views" },
//       { $match: { "views.viewdAt": { $gte: start, $lte: end } } },
//       { $count: "count" }
//     ]);
//     viewsArr.push(dailyV.length > 0 ? dailyV[0].count : 0);

//     // Likes
//     const dailyL = await Articals.aggregate([
//        {$match : {username: profile._id}},
//       { $unwind: "$like" },
//       { $match: { "like.likedAt": { $gte: start, $lte: end } } },
//       { $count: "count" }
//     ]);
//     likesArr.push(dailyL.length > 0 ? dailyL[0].count : 0);

//     // Shares
//     const dailyS = await Articals.aggregate([
//        {$match : {username: profile._id}},
//       { $unwind: "$shareHistory" },
//       { $match: { "shareHistory.sharedAt": { $gte: start, $lte: end } } },
//       { $count: "count" }
//     ]);
//     sharesArr.push(dailyS.length > 0 ? dailyS[0].count : 0);


//   }

//     res.json({
//       labels,
//       views: viewsArr,
//       likes: likesArr,
//       shares: sharesArr
//     });
// })



export {
  userDashboard,
  getDashbordChartData
}

