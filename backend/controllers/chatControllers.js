const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel')
const User = require('../models/userModel')


//Controller for : Creating and Fetching a One-on-One chat
const accessChat = asyncHandler(async (req, res) => {

    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    //check is the chat exist with this user
    var isChat = await Chat.find({
        isGroupChat: false,
        //check for both of id to match one of the logged in user and the other with whom chat is there
        $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ],
        
    }).populate("users", "-password")   //populating all the inf of users excet password
        .populate("latestMessage");     //inf realted to the latest message

        //is sender model we also populate the sender field and in isChat var we have all the data
        isChat = await User.populate(isChat,{
            path:'latestMessage.sender',
            select:"name pic email"
        });

        //if the chat exist we gonna return the chat or else we gonna create a new chat
        if(isChat.length>0){
            res.send(isChat[0]);
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };
             try {
                //creating a new chat
                const createdChat = await Chat.create(chatData);  

                //send created chat to the user
                const FullChat = await Chat.findOne({_id: createdChat._id}) 

                //populating the user array with no password
                .populate(
                    "users",
                    "-password"
                );
                res.status(200).send(FullChat);
             } catch (error) {
                res.status(400);
                throw new Error(error.message);
             }

        }

});

//Controller for: Fetching all the chats of the User
const fetchChats = asyncHandler(async(req,res)=>{
    try {
        //find chat fir the user if req.user._id
        Chat.find({users:{$elemMatch: { $eq: req.user._id } } } )
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async(results)=>{
            results = await User.populate(results, {
                path:"latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(results)
        });
    } catch (error) {
        
    }
})

//Controller for: Create a groupchat, It;s gonna take a array of users and name of groupchat
const createGroupChat = asyncHandler(async(req, res)=>{
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please fill all the fields"});
    }

    var users = JSON.parse(req.body.users);

    if(users.length<2) {
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }

})

//Controler for: Renaming the existing group chat
const renameGroup = asyncHandler(async(req, res)=>{
    const {chatName, chatId}= req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true,
        }
    )
        .populate("users","-password")
        .populate("groupAdmin","-password")

        if(!updatedChat){
            res.status(400)
            throw new Error("Chat not found")
        }else{
            res.json(updatedChat);
        }
})

//Controller for: Add a user to a group chat
const addToGroup = asyncHandler(async(req, res)=>{
    const {chatId, userId} = req.body;
    const added = await Chat.findByIdAndUpdate(chatId,
        {
            $push : {users: userId},
        },
        {
            new:true,
        }
        ).populate("users", "-password")
        .populate("groupAdmin", "-password")

        if(!added){
            res.status(400)
            throw new Error("Chat Not Found")
        }else{
            res.json(added)
        }

})

const removeFromGroup = asyncHandler(async(req, res)=>{
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId,
        {
            $pull : {users: userId},
        },
        {
            new:true,
        }
        ).populate("users", "-password")
        .populate("groupAdmin", "-password")

        if(!removed){
            res.status(400)
            throw new Error("Chat Not Found")
        }else{
            res.json(removed)
        }

})

module.exports = { accessChat, fetchChats, createGroupChat,renameGroup,addToGroup, removeFromGroup }
