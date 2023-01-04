const express=require('express')
const router=express.Router();
const auth=require('../middleware/auth')
const User=require('../models/User');


router.get('/search-users',auth,async(req,res)=>{
    const query = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(query).find({ _id: { $ne: req.user._id } });
  res.send(users);
})

module.exports=router;