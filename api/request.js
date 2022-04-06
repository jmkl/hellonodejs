 const express = require("express");
 const router = express.Router();
 const { search, SafetyLevels } = require("ddgimages-node")

 router.get("/:key",async(req,res)=>{
     try{
        const nsfw = await search(req.params["key"], SafetyLevels.OFF)
         res.json({
             status:200,
             message:nsfw
         })

     }catch(error){
        return res.status(500).send(JSON.stringify("Something went wrong :("));
     }
  
 });
 router.get("/:key",(req,res)=>{
     res.json({status:200,message:"xxx"})
 })

 module.exports = router;