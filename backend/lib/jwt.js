import jwt from "jsonwebtoken"

export default function createJWT(user,res) {
    // we create the jwt : 
    const token = jwt.sign(
        {
            userId : user._id,
            name : user.name,
        },
        process.env.SECRET_KEY,
        {expiresIn : "7d"},
    )

    // we create cookie  and send jwt inside the cookie : 
    res.cookie('authCookie',token,
        // todo : needs changes : 
        {
            maxAge : 7*24*60*60*1000,
            secure : false,
            sameSite : "lax",
            // Below helps protect against XSS attacks.
            httpOnly: true,
        }
    )
    return token;
}