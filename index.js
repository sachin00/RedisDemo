const express = require('express')
const app = express()

const PORT = process.env.PORT || 9999;

const redis = require('redis');
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: '6379'
});

redisClient.connect();
redisClient.on('connect', (err) => console.log('Connected...'))

app.get('/', async (req, res) => {
    let keyname = 'budget';
    let getdata = await redisClient.get(keyname);
    let data = {
        id: 1,
        name: 'Daniel Kaluya'
    }

    if (getdata) {
        res.send(JSON.parse(getdata));
    }
    else {
        redisClient.set(keyname, JSON.stringify(data), {EX: 30});
        res.json({msg: 'Data inserted...'})
    }
})

app.get('/hashDataInsert', async (req, res) => {
    let parentKeyName = 'RootKey'
    let keyname = 'SecondKey';
    let getdata = await redisClient.hGet(parentKeyName, keyname);
    let data = {
        id: 5,
        name: 'Tessa Thompson'
    }

    if (getdata) {
        res.send(JSON.parse(getdata));
    }
    else {
        redisClient.hSet(parentKeyName, keyname, JSON.stringify(data));
        res.json({msg: 'Data inserted...'})
    }
})

app.get('/hashDataGetAll', async (req, res) => {
    let parentKeyName = 'RootKey'

    let getdata = await redisClient.hGetAll(parentKeyName);
    
    if (getdata) {
        res.send(getdata);
    }
    else {
        res.status(204).send('Null')
    }
})

app.delete('/deleteParentKey', async (req, res) => {
    let parentKeyName = 'RootKey'

    await redisClient.DEL(parentKeyName);
    
    res.send('Deleted')
})


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));