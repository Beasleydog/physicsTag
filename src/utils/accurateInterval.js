function accurateInterval(callback, interval) {
    // //Set a noraml interval. Check the time elapsed and add or subtract any extra time to a count. If the count is greater than the interval, run the callback and reset the count.
    // let count = 0;
    // let lastTime = Date.now();

    // let intervalId = setInterval(() => {
    //     const now = Date.now();
    //     count += now - lastTime;
    //     lastTime = now;
    //     if (count >= interval) {
    //         count = 0;
    //         const before = Date.now();
    //         callback();
    //         const after = Date.now();
    //         const elapsed = after - before;
    //         console.log("Callback took", elapsed, "ms");
    //     }
    // }, 1);


    // return intervalId;
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