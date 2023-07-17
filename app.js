const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
var path=require("path");

const app=express();
let items=[];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});
const itemsSchema=new mongoose.Schema({
name:String
})
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
    name:"welcome to todo list"
});
const item2=new Item({
    name:"press plues to add new item"
});
const item3=new Item({
    name:"thank u"
});
const defaultItems=[item1,item2,item3];

const listSchema={
    name:String,
    item:[itemsSchema]
}
    const List=mongoose.model("List",listSchema);





app.get('/',function(req,res){
   Item.find().then(function(foundItems){
if(foundItems.length===0){
    Item.insertMany(defaultItems).then(function(){
    
        console.log("succesfully saved");
 }).catch(function(err){

    console.log(err);})
    res.redirect("/");
}




else{


    res.render("list",{KindOfDay:day,NewListItem:foundItems});
   }
});

  
    let today=new Date();
    //var CurrentDay=today.getDay();
    var options={
weekday:"long",
day:"numeric",
month:"long"
    };
    var day=today.toLocaleString("en-US",options);
    //res.render("list",{KindOfDay:day,NewListItem:items});
});

app.get("/:customListName",function(req,res){
    const customListName=req.params.customListName;
List.findOne({name:customListName}).then(function(foundList)
 {
    
        if(!foundList){
            console.log("doesnt exits")}
        }).catch(function(err){
            if(err)
            console.log("exists");
        })
        

        
    


    const list=new List({
        name:customListName ,
        items:defaultItems
    })
    list.save();
    });

app.post("/",function(req,res){
    var inp=req.body.add;
const item=new Item({
    name:inp
});
item.save();
res.redirect("/");
})

// app.post("/delete",function(req,res){
//     const deleteid=req.body;
//     Item.findByIdAndRemove(deleteid).then(function(err){
//         if(!err){
//         console.log("successfully deleted check");}
//         res.redirect("/");
//         })
//     .catch(function(err){
//         console.log(err);
// })
// });

app.get('/about',function(req,res){
    res.render("about");
    //res.redirect("/about");
});



app.listen(3000 ,function(req,res){
    console.log("listening to server 3000");
});