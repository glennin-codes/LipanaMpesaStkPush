const CreateToken=async(req,res,next)=>{
      //getting the  auth ..by encoding both consumer key and consumerSecret
  
    const secret = process.env.MPESA_SECRET;
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
//AUTH
const auth  = new Buffer.from(`${consumerKey}:${secret}`).toString(
    "base64"
  );
}
module.exports={CreateToken}