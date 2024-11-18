const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 3000

app.use(express.json())

const dataFilePath = path.join(__dirname,'data.json')

function readData(){
    const rawData = fs.readFileSync(dataFilePath)
    return JSON.parse(rawData)
}

function writeData(data){
    fs.writeFileSync(dataFilePath,JSON.stringify(data,null,2))
}

app.get('/items',(req, res) => { 
    const items = readData()
    res.json(items)
})

app.get('/items/:id',(req,res)=>{
    const items = readData()
    const item = items.find(i=>i.id === parseInt(req.params.id))
    if(!item) return res.status(404).send('item not found')
    res.json({
        message:"data kamu",
        data : item
    })
})  

app.post('/items',(req,res)=>{
    const items = readData()
    const newItem = {
        id:items.length + 1,
        ...req.body
    } 
    items.push(newItem)
    writeData(items)
    res.status(201).json(newItem)
})

app.put('/items/:id',(req,res)=>{   
    const items = readData()
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id))
    if(itemIndex === -1) return res.status(404).send('item not found')

    items[itemIndex] = { ...items[itemIndex], ...req.body}
    writeData(items)
    res.json(items[itemIndex])
})

app.delete('/items/:id',(req,res)=>{
    let items = readData()
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id))
    if(itemIndex === -1) return res.status(404).send('item not found')   
        
    items = items.filter(i=> i.id !== parseInt(req.params.id))      
    writeData(items)
    res.status(204).send('berhasil di hapus')
})


app.listen(port,()=>{
    console.log(`server run to ${port}`)
})                  

