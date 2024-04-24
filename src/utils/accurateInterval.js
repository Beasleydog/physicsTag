function accurateInterval(callback, interval) {
    let nextTime;
    let nearbyThreshold = 3/4;

    const main=()=>{
        callback();
        nextTime=Date.now()+interval;
        setTimeout(nearby,interval*nearbyThreshold);
    }
    const nearby=()=>{
        //We are near the next scheduled time, use while loop
        while(Date.now()<nextTime){
            //Wait
        }
        main();
    }

    main();
}
module.exports = accurateInterval;