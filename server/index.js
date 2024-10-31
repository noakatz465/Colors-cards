const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const port = 3001;
app.use(cors());

app.use(express.json());
app.listen(port, ()=>{
    console.log('App is listening!');   
})

const readCards = () =>{
    const data = fs.readFileSync('./data/db.json');
    return JSON.parse(data).cards;
};

const readColors = () =>{
    const data = fs.readFileSync('./data/db.json');
    return JSON.parse(data).colors;
};
const writeCards = (cards) => {
    const data = JSON.parse(fs.readFileSync('./data/db.json'));
    data.cards = cards;
    fs.writeFileSync('./data/db.json', JSON.stringify(data, null, 2));
};

const writeColors = (colors) => {
    const data = JSON.parse(fs.readFileSync('./data/db.json'));
    data.colors = colors;
    fs.writeFileSync('./data/db.json', JSON.stringify(data, null, 2)); 
};

app.get('/cards', (req, res) => {
    const cards = readCards();
    res.json(cards);
  });

  app.get('/colors', (req, res) => {
    const colors = readColors();
    res.json(colors);
  });

  app.post('/cards', (req, res) => {
    const { color, text } = req.body;
    if (!readColors().includes(color)) {
      return res.status(400).json({ error: 'Invalid color' });
    }
    const cards = readCards();
    const newCard = { id: cards.length + 1, color, text };
    cards.push(newCard);
    writeCards(cards);
    res.status(201).json(newCard);
  });

  app.post('/colors', (req, res) => {
    const {color} = req.body;
    const colors = readColors();
    if (colors.includes(color)) {
      return res.status(400).json({ error: 'Color already exists' });
    }
    colors.push(color);
    writeColors(colors);
    res.status(201).json({color});
  });

  app.put('/cards/:id', (req, res) => {
    const cardId = req.params.id;
    const updatedCard = req.body;
    const cards = readCards();
    const index = cards.findIndex(b => b.id == cardId);
    if (index != -1) {
        cards[index] = { ...cards[index], ...updatedCard };
        writeCards(cards);
        res.json(cards[index]);
    } else {
        res.status(404).send('Card not exist!');
    }
});

app.delete('/cards/:id', (req, res) => {
    const cardId = req.params.id;
    const cards = readCards();
    const index = cards.findIndex(b => b.id == cardId);

    if (index != -1) {
        const deletedCard = cards.splice(index, 1); 
        writeCards(cards);
        res.json(deletedCard[0]);
    } else {
        res.status(404).send('Card not exist!');
    }
});

app.delete('/colors/:color', (req, res) => {
    const color = req.params.color;
    const colors = readColors();
    const index = colors.findIndex(c => c === color);

    if (index !== -1) {
        const deletedColor = colors.splice(index, 1); 
        writeColors(colors);
        res.json({ deletedColor: deletedColor[0] });
    } else {
        res.status(404).send('Color not exist!');
    }
});

