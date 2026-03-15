import User from "../../models/Signup.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

const setting = asyncHandler(async(req, res)=>{

  
    console.log("password", password);
    console.log("Newpassword", Newpassword);
    console.log("Confirmpassword", Confirmpassword);
  

    const {password, Newpassword, Confirmpassword} = req.body
    if (!password || !Newpassword || !Confirmpassword) {
        req.flash("error", "all fields are requird")
        return res.redirect("/setting") 
    }

    if (Newpassword !== Confirmpassword) {
         req.flash("error", "something weng wrong")
        return res.redirect("/setting") 
    }

 const user = await User.findById(req.user._id)
 if (!user) {
     req.flash("error", "something weng wrong")
        return res.redirect("/setting") 
 }

   const hashPassword = await user.isCorrectPassword(password)
   if (!hashPassword) {
      req.flash("error", "something weng wrong")
        return res.redirect("/setting") 
   }

   user.password = Newpassword;
   user.save()
   

   req.flash("success", "change password successfully")
        return res.redirect("/setting") 
   

})

export default setting;