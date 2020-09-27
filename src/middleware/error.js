module.exports=(err, req, res ,next)=>{

    console.log(err);
    res.send(500).send('something fail')
    exist(1);
} 