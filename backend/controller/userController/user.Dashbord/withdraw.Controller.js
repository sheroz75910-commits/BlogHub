import ApiError from "../../../utils/ApiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import withdraw from "../../../models/withdraw.Model.js"
// import { check } from "express-validator";
import { DollerTomile } from "../../../helper/earningCalculation.js";
import User from "../../../models/Signup.model.js";
// import { use } from "passport";
// import User from "../../../models/Signup.model.js";

const withdrawController = asyncHandler(async (req, res) => {

    const { amount, method, accountDetails } = req.body;
    const userId = req.user._id;

     if (!userId) {
        req.flash("error", "something went wrong");
        return res.redirect("/profile/Dashbord/Withdraw");
    }


      if (!amount || !method || !accountDetails) {
        req.flash("error", "something went wrong");
        return res.redirect("/profile/Dashbord/Withdraw");
    }

  const numaricAmount = Number(amount)
  console.log("numaricAmount", numaricAmount);
  
   
    if (isNaN(numaricAmount) || numaricAmount <= 0) {
        req.flash("error", "Invalid amount");
        return res.redirect("/profile/dashboard/withdraw");
    }


   const withdrawAmountFromUser = DollerTomile(numaricAmount)


   console.log("withdraw", withdrawAmountFromUser);
   



   const withdrawLimiit = 10000
   
    if (withdrawAmountFromUser < withdrawLimiit) {
        console.log("the amount should be greater then 10$");
        
         req.flash("error", "For Withdraw Amount Must be Greator then 10$");
        return res.redirect("/profile/Dashbord/Withdraw");
    }
  

      const user = await User.findById(userId).select("balanceMills");
  console.log("user", user);
  
      if (!user) {
         req.flash("error", "User not fount");
        return res.redirect("/profile/Dashbord/Withdraw");
        
      }

      if (user.balanceMills < withdrawAmountFromUser) {
        
       req.flash("error", "You have not Insufficient  Balance");
        return res.redirect("/profile/Dashbord/Withdraw");
      }


     user.balanceMills -=withdrawAmountFromUser
       await user.save();

   try {
     await withdraw.create({
         user : userId,
         amount : withdrawAmountFromUser,
         accountDetails,
         method
     })
   } catch (error) {

      user.balanceMills +=withdrawAmountFromUser
      await user.save()

    req.flash("error", "Withdrawal failed, try again");
        return res.redirect("/profile/dashboard/withdraw");
   }
    console.log("this is the end");
    
     
    req.flash("success", "Withdrawal request submitted successfully");
    return res.redirect("/profile/dashboard/withdraw");     
    })
    
    export default withdrawController
    
        // const userId = req.user._id
        // console.log("userId", userId);
    
    
        // const user = await User.find(userId).select("username")
        
        // console.log("user from the withdrawController", user);
    
    
        // if (!amount || !method || !accountDetails) {
        //     req.flash("error", "something went wrong");
        //     return res.redirect("/profile/Dashbord/Withdraw");
    
        // }
    
        // if (amount >= 10) {
        //     req.flash("error", "the ammount should be greater then 10$!");
        //     return res.redirect("/profile/Dashbord/Withdraw");
        // }
    
    
        // console.log("here i am going to create withdraw request");
    
        // const withdrawData = await withdraw.create({
        //     user: userId,
        //     amount,
        //     method,
        //     accountDetails,
        // })
        // console.log("withdrawData", withdrawData);
        // console.log("here i am going to create withdraw request");
    
        // await User.findById(id, {})
    
    
        // await withdrawData.save({validateBeforeSave : false})