const fetchData = ()=> {
    const promise = new Promise ((resolve, reject)=>{
        setTimeout(()=>{
            resolve("DONE!");
    
        },1500);
    });
    return promise;
};

setTimeout (()=>{
    console.log("THANS FOR BANKING WITH US!");
    fetchData()
    .then(text=>{
        console.log(text);
        return fetchData();
    })
    .then(text2 =>{
        console.log(text2);
    });
},2000
);

console.log("HELLO");
console.log("HI");