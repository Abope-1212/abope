const fetchdata = ()=> {
    const promise = new Promise((resolve)=> {
        setTimeout(()=> {
            resolve("DONE!");
        }, 1500);
    });
    return promise;
    };


setTimeout (()=> {
    console.log("THANKS FOR BANKING WITH US");
    fetchdata() 
    .then(text=>{
        console.log(text);
         return fetchdata();
    })
    .then(text2 => {
        console.log(text2);
    })
    
}, 2000
);

console.log("Hello");
console.log("Hi");