let count = 0;
const timer = setInterval(() => {
    if (count >= 10){
        clearInterval(timer);
    }
    console.log("Logged");
    console.log(count)
    count += 1;
}, 500);

