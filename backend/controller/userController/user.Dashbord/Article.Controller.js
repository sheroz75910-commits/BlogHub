import { Articals } from "../../../models/ArticalModel.js";
import Category from "../../../models/categorie.model.js";
import { Profile } from "../../../models/profile.model.js";
import { RPMGroup } from "../../../models/RPMGroup.model.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import uploadOnCloudinary from "../../../utils/cloudinary.js";


const articalUpload = asyncHandler(async (req, res) => {
  console.log("trcyubiomp,cyvguhbijnokml");
  console.log("req.body", req.body);
  

    console.log("ARTICLE UPLOAD HIT", new Date().toISOString());

  const { title, tags, short_description, content, publish_date, meta_title, meta_description, category } = req.body;


console.log("category",category);

  if (!title || !tags || !short_description || !content || !publish_date || !meta_title || !meta_description || !category) {
       req.flash("error", "All fields are required");
        return res.redirect("/Artical");
  }
  
    



  // if (!content) {
  //   throw new ApiError("content is required", 400);
    
  //   //  req.flash("error", "the conetnt length must be greater then 100")
  //   //     return res.redirect("/");
  // }

  // Call OpenAI Moderation API

 
  

  const profileCategories = await Profile.findOne({User : req.user._id}).select("category")
  console.log("profileCategories", profileCategories);
  

  if (!profileCategories) {
       req.flash("success", "All fields are required");
        return res.redirect("/Artical");
  }

  if (!profileCategories.category.includes(category)) {
     req.flash("error", "Selected category is not allowed for your profile");
        return res.redirect("/Artical");
  }

  console.log("category", category);

  let imageUrl 
 try {
   imageUrl = await uploadOnCloudinary(req.file?.path)
 } catch (error) {
   req.flash("error", "the Image is required");
        return res.redirect("/Artical");
 }

 

  const profile = await Profile.findOne({ User: req.user._id });
  if (!profile) {
       req.flash("error", "Profile not found");
        return res.redirect("/Artical");
  }
  //   const cate = await Category.find()
  // console.log("cate", cate);


  const categoryData  = await Category.aggregate([
    { $unwind: "$topics" },
    { $match: { "topics.slug": category } },
    {
      $project: {
        rpm_group_id: "$topics.rpm_group_id"
      }
    }

  ])
  console.log("this is Categories", categoryData );

  if (!categoryData?.length) {
      req.flash("error", "Invalid category");
        return res.redirect("/Artical");
  }


  const rpm_group_id = categoryData[0].rpm_group_id
  // console.log("this is rpm_group_id", rpm_group_id);
  
  // if (!rpm_group_id) { 
  //   req.flash("error", "RPM not found for this category");
  //       return res.redirect("/Artical");
  // }

  const RPM = await RPMGroup.findById(rpm_group_id).select("rate_per_1000")
  console.log("RPM", RPM);

  if (!RPM) {
  req.flash("error", "RPM not found for this category");
        return res.redirect("/Artical");

  }

  //  const artical


 // ===== OPENAI MODERATION HERE =====
// const moderationResponse = await openai.moderations.create({
//   model: "omni-moderation-latest",
//   input: content
// });

// const result = moderationResponse.results[0];

// if (result.flagged) {
//   return res.status(400).json({ message: "Content contains harmful data" });
// }


  try {
        await Articals.create({
      User: req.user._id,
      title,
      featured_image: imageUrl.secure_url,
      tags,
      short_description,
      content,
      publish_date,
      username: profile._id,
      category,
      rpm: RPM.rate_per_1000,
      // share,
      estimatedEarningMills: 0,
      meta_description,
      meta_title,
      // author: profile._id,
    })

  } catch (error) {
     req.flash("error", "Article faild to Upload");
        return res.redirect("/Artical");
  }

  console.log("this artical befor populateartical", createArtical);



    req.flash("success", "Article Upload Successfull");
    return res.redirect("/profile/Dashbord/Artical");


})

export {
    articalUpload
}
