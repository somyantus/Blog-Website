const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const aboutStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
const contactStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const app = express();



mongoose.connect("mongodb://localhost:27017/blogDb");

const blogSchema = new mongoose.Schema({
    title: String,
    content: String
});

const blogModel = mongoose.model("blog", blogSchema);


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/static", express.static(__dirname + "/public"));

app.get('/', function (req, res) {

    blogModel.find({}, function (err, postarr) {

        res.render("home", {

            homeContent: homeStartingContent,

            posts: postarr

        });

    });
    
});

app.get("/contact", function (req, res) {
    res.render('contact', {
        contactContent: contactStartingContent
    });
});

app.get("/about", function (req, res) {
    res.render('about', {
        aboutContent: aboutStartingContent
    });
});

app.get("/compose", function (req, res) {
    res.render('compose');
});

app.get('/post/:postID', function (req, res) {

    const requestedId = req.params.postID;

    blogModel.findOne({
        _id: requestedId
    }, function (err, post) {
        res.render("post", {
            title: post.title,
            content: post.content
        });
    });

});

app.post("/compose", function (req, res) {

    const blog1 = new blogModel({
        title: req.body.postTitle,
        content: req.body.postBody
    });

    blog1.save(function (err) {
        if (!err) {
            res.redirect("/");
        }
    });
    // const post = {
    //     title: req.body.postTitle ,
    //     content: req.body.postBody 
    //  };
    // postarr.push(post);

});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("Server is up and running");
});