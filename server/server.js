const express = require('express');
const fs = require('fs');
const historyApiFallback = require('connect-history-api-fallback');
const mongoose = require('mongoose');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../config/config');
const webpackConfig = require('../webpack.config');

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 8080;


// Configuration
// ================================================================================================

// Set up Mongoose
mongoose.connect(isDev ? config.db_dev : config.db);
mongoose.Promise = global.Promise;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./routes')(app);


if (isDev) {
    const compiler = webpack(webpackConfig);

    app.use(historyApiFallback({
        verbose: false
    }));

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        contentBase: path.resolve(__dirname, '../client/public'),
        stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
        }
    }));

    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(path.resolve(__dirname, '../dist')));
  
} else {
    app.use(express.static(path.resolve(__dirname, '../dist')));
    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../dist/index.html'));
        res.end();
    });
}

var io = require('socket.io').listen(app.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.log(err);
    }

    console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', port);
}));
var listLocation=[];
var listId=[];
io.sockets.on('connection', function (socket) {
        console.log('io.socket connection ' + socket.id);
        socket.emit('news', { hello: 'world' });
        io.emit('list location',listLocation) 
        // add driver
        socket.on('add location driver', function (data) { // khai báo mảng, concat data vào mảng, emit mảng về client
            console.log(data);
            if(listId.indexOf(socket.id==-1)){
                listId.push(socket.id)
                listLocation.push(data)//kiểm tra listLocation có socket.id đó hay chưa,chưa thì add vào mảng, indexOf(socket.id)
                io.emit('list location',listLocation)
            }else{
                console.log("error")// emit client
            }
        });
        //remove driver 
        socket.on('remove driver',()=>{
            console.log(listId.indexOf(socket.id))
            listLocation.splice(listId.indexOf(socket.id),1)
            listId.splice(listId.indexOf(socket.id))
            io.emit('list location',listLocation)
        })
        //khách hàng đặt xe
        socket.on('customer booking',(dataCustomer)=>{
            // tìm kiếm tài xế.
            // gửi dữ liệu cho tài xế
            //console.log(dataCustomer.start)
            io.to(listId[0]).emit('data khach hang',{
                directions:dataCustomer.directions,
                idCustomer:socket.id,
                placeStart:dataCustomer.start,
                placeGoal:dataCustomer.goal,
                infoName:dataCustomer.infoName,
                infoPhone:dataCustomer.infoPhone
            })
            //tai xe ko nhận
            //gửi dữ liệu cho khách hàng 
        })
         //{ nếu tài xế chấp nhận , tài xế hủy
        socket.on('driver accept',(data)=>{
            //console.log(socket.id)
            console.log(data)
            io.to(data.idCustomer).emit('find driver success',data.dataDriver)
            //socket.emit('find driver success',{data:'data tai xe'})
        }) // thêm socket.id để khác với các tài xế khác
        socket.on('driver cancel',()=>{
            // tim lại tài xế khác
            socket.emit('find driver success',{data:'tai xe khong nhan'})
            //send tai xe

        })
        socket.on('driver finish',(data)=>{
            console.log(data);
            io.to(data.idCustomer).emit('the trip is over')
        })
        //
        socket.on("disconnect",()=>{
            if(listId.indexOf(socket.id==-1)){
                listLocation.splice(listId.indexOf(socket.id),1)
                listId.splice(listId.indexOf(socket.id))
                io.emit('list location',listLocation)
            }
            console.log(socket.id+" disconnect ")
        })
});

module.exports = app;

