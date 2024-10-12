const jwt = require('jsonwebtoken');
const Book = require('../models/bookModel');
require('dotenv').config();

JWT_SECRET = process.env.JWT_SECRET ;

let addBook = async  (req ,res) =>{
    try {
        const token = req.cookies.token ;
        if(!token){
            return res.status(400).json({message : "Unauthorized"})
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded ;
        const name = req.user.name
        const {title , genre } = req.body

        const  recipe = new Book({
            title, 
            authorName : name,
            genre,
            availability: true,
        })
        await recipe.save()
        res.status(201).json({message : "Book create successfully",recipe : recipe})
    
    } catch (error) {
        res.status(500).json({message : "Server Error", error : error.message})
    }   
}
let allBook = async (req,res) =>{
    try {
        const token = req.cookies.token ;
        if(!token){
            return res.status(400).json({message : "Unauthorized"})
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const author = decoded.id ;
        const recipes = await Book.find()
        res.status(200).json(recipes)
    
    } catch (error) {
        res.status(500).json({message : "Server Error", error : error.message})
    }  
}
let updateBook = async (req,res) =>{
    const {title , genre } = req.body
    const id = req.params.id;
    try {

        let recipe = await Book.findByIdAndUpdate(id ,{title : title , genre : genre})
        if (!recipe) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(201).json({message : "Book update successfully", recipe : recipe})
    
    } catch (error) {
        res.status(500).json({message : "Server Error", error : error.message})
    }     
}
let deleteBook = async (req,res) =>{
    try {
        const id = req.params.id;

        await Book.findByIdAndDelete(id)
        res.status(201).json({message : "Book delete successfully"})
    
    } catch (error) {
        res.status(500).json({message : "Server Error", error : error.message})
    } 
}
let borrowBook =  async (req,res) =>{
    const id = req.params.id ;
    try {
        const token = req.cookies.token ;
        if(!token){
            return res.status(400).json({message : "Unauthorized"})
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded ;
        const userid = req.user.id ;
        const book = await Book.findById(id)
        if(!book){
            return res.status(404).json({message : "Book not found"})
        }
        if(!book.availability){
            return res.status(400).json({message : "Book is already borrowed"})
        }
        book.availability = false ;
        book.borrowedBy = userid;
        await book.save()
        res.status(201).json({message : "Book borrowed successfully" , book : book})
    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}                
const returnBook = async (req, res) => {
    const id = req.params.id;
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const userId = req.user.id;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.borrowedBy.toString() !== userId) {
            return res.status(400).json({ message: "Book is not borrowed by you" });
        }

        book.availability = true;
        book.borrowedBy = null;
        await book.save();

        res.status(200).json({ message: "Book returned successfully", book });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    addBook ,
    allBook ,
    updateBook ,
    deleteBook ,
    borrowBook ,
    returnBook
}