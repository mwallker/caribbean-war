caribbean-war
=============

Game

User story part1

The User run this catching game. Then he/she saw a login page. The User logged on. Then he/she arrived to the tavern...to be continued...

//1.USER'S LOADING 
//1.1.AUTHORIZATION :
//REQUEST
{
	"action":"auth",
	"details":{
		"login":"mail",		//valid email
		"password":"somePassword"	//hashed string (sha256)
	}
}
//RESPONSE
{
	"action":"auth",
	"details":{				//{} if not found 
		"id": 35373,
		"name":"someName",
		"cash":2144 		
	}
}
//2.MENU FEATURES
//2.1.SHOPING
//2.1.1.PRE-LOAD ITEMS
//REQUEST
{
	"action":"shop",
	"details":{
		"request":"load",
		"param":1		//0 for ships, 1 for cannons, 2 for cannonballs	
	}
}
//RESPONSE
{
	"action":"shop",
	"details":{
		"result":[]		//items in shop
	}
}
//2.1.2.BUY ITEM
//REQUEST
{
	"action":"shop",
	"details":{
		"request":"buy",
		"param":113	
	}
}
//RESPONSE
{
	"action":"shop",
	"details":{
		"result":[]		
	}
}
//2.2.CHAT
//2.2.1.SENDING MESSAGE
//REQUEST
{
	"action":"chat",
	"details":{
		"sender":"",
		"target":1414,
		"message":"adads"
	}
}
//RESPONSE
{
	"action":"chat",
	"details":{
		"sender":"sgsf",
		"target":"",
		"message":"adads"
	}
}