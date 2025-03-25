const Blacklist = require('../models/Blacklist');
const User = require('../models/User');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
      options.secure = true;
    }
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  };

exports.register=async(req,res,next)=>{
    try{
        const{name,tel,email,password,role} = req.body;

        const user = await User.create({
            name,
            tel,
            email,
            password,
            role
        });

        //const token=user.getSignedJwtToken();
        //res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);

    }catch(err){
        if(err.code===11000){
            return res.status(400).json({success:false,msg:'User already exists'});
        }
        res.status(400).json({success:false, msg:err.message});
        console.log(err.stack);
    }
    
}

exports.login=async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({success:false, msg:'Please provide an email and password'});
    }

    const user = await User.findOne({email}).select('+password');

    if(!user){
        return res.status(400).json({success:false, msg:'Invalid credentials'});
    }

    const isBan = await Blacklist.findOne({'bannedId':user._id});

    if(isBan){
        return res.status(400).json({success:false,message:'You got ban!'});
    }

    //const token=user.getSignedJwtToken();
    //res.status(200).json({success:true,token});
    sendTokenResponse(user,200,res);

    
}

//@desc Get current Logged in user
//@route POST /api/v1/auth/me
//@access Private
exports.getMe=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({success:true,data:user});
}

 //@desc     Log user out / clear cookie
 //@route    GET /api/v1/auth/logout
 //@access   Private
 exports.logout=async(req,res,next)=>{
    res.cookie('token','none',{
        expires:new Date(Date.now()+ 10*1000),
        httpOnly:true
    });
        res.status(200).json({
            success:true,
            data:{}
    });
};