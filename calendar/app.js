var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var cookieSession = require("cookie-session")

var app = express();

app.use(cookieSession({
	keys:['asdash1v312gh','sadb12y3123gh']
}));
app.use(passport.initialize());
app.use(passport.session());

//Omniauth /Oauth
//estrategia de autenticasion con el id llave y redireccionamiento
//pasamos objetos del ususario en var user s epuede hacer en BD
//token de acceso para probar que ya hay persmiso a la info del usuario
//ya que expira se tiene que rerescar y su info de usuario en profile y cb la funcion
//que llama una vez que se aala acabado de crear al user

passport.use(new GoogleStrategy({
clientID: "746766374980-bkvdk4gufd5mee5j5rp9mdkv1eunrd2f.apps.googleusercontent.com",
clientSecret:"K8eEa_-FIqveTJMVozbCBJXB",
callbackURL:"http://127.0.0.1:8080/auth/google/callback",
},function(accesToken,refreshToken,profile,cb){
	var user ={
		accesToken:accesToken,
		refreshToken:refreshToken,
		profile:profile
	};

	return cb(null, user); //error 
}));
/*
se utiliza serialize y desepara ver como se vana guardar los
datos delusuario en la sesion express
Cundo inciia se ve comos eva agaurda rlso datos en serialize
y dess despues r guardar la sesion esas son peticiones
*/
//en este caso se guarda con todos los datoa 
passport.serializeUser(function(user,done){
	done(null,user);

});

passport.deserializeUser(function(user,done){
	done(null,user);
});
//sitio web con pug
app.set('view engine','pug');

app.get("/",function(req,res){

	if (isLoggedIn(req)) {
		res.render('home');
	}else{

	res.render('index');
}
});
//datos de la cuenta 
app.get("/auth/google/callback", passport.authenticate('google',{failureRedirect:'/'}),
	function(req,res){
		res.redirect('/')
});
//inicia sesion con google
app.post("/login",passport.authenticate('google',{

	//jason que es el scope
	scope:['profile',"https://www.googleapis.com/auth/calendar","https://www.googleapis.com/auth/userinfo.email"]

}));
//cerrar sesión
app.post("/logout",function(req,res){
	if (isLoggedIn(req)) {
		req.session.passport.user = null;
	}
	res.redirect('/')
});
//funcion de cookes i esya definodo y lohedo el user
function isLoggedIn(req){
	return typeof req.session.passport !=="undefined" && req.session.passport.user;
}
app.listen(8080)
