const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
// Route 1: Get All the Notes using: GET "api/notes/fetchallnotes" Login required
router.get('/fetchallnotes', fetchuser, async (req,res)=>{
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");     
    }
})
// Route 2: Add a new Notes using: POST "api/notes/addnote" Login required
router.post('/addnote', fetchuser,[
        // this code are fore express validation
        body('title','Enter a valid title').isLength({ min: 3 }),
        body('subtitle','Enter a valid subtitle').isLength({min:3}),
        body('description','Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req,res)=>{
    try {
            
        const {title, subtitle, description, tag}= req.body;
         // if there are errors, return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Notes({
            title, subtitle, description, tag, user: req.user.id
        })
        const savedNote = await notes.save()


        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");        
    }
})
// Route 3: Update an existing Notes using: PUT "api/notes/updatenote" Login required
router.put('/updatenote/:id', fetchuser, async (req,res)=>{
    const {title,subtitle, description, tag}= req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if(title){newNote.title = title};
        if(subtitle){newNote.subtitle = subtitle};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if(!note){
        return res.status(404).send("Not Found");
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Note Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");        
    }
})
// Route 4: Delete an existing Notes using: Delete "api/notes/deletenote" Login required
router.delete('/deletenote/:id', fetchuser, async (req,res)=>{
    try {
        // Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){
        return res.status(404).send("Not Found");
        }
        // Allow deletion only if user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Note Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"success":"Note has been deleted"});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");        
    }
})
// Route 5: Delete an existing Notes using: Delete "api/notes/getone" Login required
router.get('/getone/:id', fetchuser, async (req,res)=>{
    try {
        // Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id);
        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");        
    }
})
module.exports = router;