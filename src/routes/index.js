const {
    Router
} = require('express');
const axios = require('axios');
const router = Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('checking heartbeat')
});

router.post('/register', async (req, res) => {
    const {email,password} = req.body;
    const newUser = new User({email,password});
    const user = await User.findOne({email});
    if (user) return res.status(401).send('Ya existe el usuario registros\' con el correo electronico ingresado.');

    await newUser.save();
    const token = await jwt.sign({_id: newUser._id}, 'secretkey');
    res.status(200).json({token});
});

router.post('/login', async (req, res) => {
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if (!user) return res.status(401).send('El correo electronico no existe.');
    if (user.password !== password) return res.status(401).send('Contraseña incorrecta.');

    const token = await jwt.sign({ _id: user._id}, 'secretkey');
    return res.status(200).json({token});
});


router.get('/breeds', async (req, res) => {
    
     axios.get('https://api.thecatapi.com/v1/breeds?limit=10&page=0')
    .then((response) => {res.json(response.data); 
    })
    .catch((error) => {
        console.error('Error al obtener usuarios:', error);
    }); 

  
});

router.get('/breeds/:breed_id', async (req, res) => {
   
    const params = {breed_ids: req.params.breed_id};
    await axios.get('https://api.thecatapi.com/v1/breeds/',params)
        .then((response) => {res.json(response.data); })
        .catch((error) => {
            console.error('Error al obtener usuarios:', error);
        });
});

router.get('/breeds/search', async (req, res) => {

    const params = {breed_ids: req.params.breed_id};
    console.log(req);
    await axios.get('https://api.thecatapi.com/v1/images/search',params)
        .then((response) => {res.json(response.data); })
        .catch((error) => {
            console.error('Error al obtener usuarios:', error);
        });
});

router.get('/imagesbybreedid', async (req, res) => {
   
    const params = {breed_ids: req.body.breed_ids};
    //console.log(req.body.breed_ids);
    await axios.get('https://api.thecatapi.com/v1/images/search',params)
        .then((response) => {res.json(response.data); })
        .catch((error) => {
            console.error('Error al obtener usuarios:', error);
        });
});

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauhtorized Request');
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send('Unauhtorized Request');
        }

        const payload = await jwt.verify(token, 'secretkey');
        if (!payload) {
            return res.status(401).send('Unauhtorized Request');
        }
        req.userId = payload._id;
        next();
    } catch (e) {
        //console.log(e)
        return res.status(401).send('Unauhtorized Request');
    }
}

module.exports = router;
