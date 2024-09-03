const person = {
    name:"wale",
    age:22,
    greet() {
        console.log("Hi, I am " +this. name + " and I am " + this .age)
    }
};

const printName =({name}) => {
    console.log(name);
}
printName(person);

const {name, age}=person;
console.log(name, age);

// const copiedperson= {...person};
// console.log(copiedperson);

const hobbies= ["sports", "cooking"];
const [hobby1, hobby2]= hobbies;
console.log(hobby1, hobby2);

// //for(let hobby of hobbies) {
//     //console.log(hobby);
// //}
// hobbies.push("Programming");
// console.log(hobbies.map(hobby => "Hobby: " + hobby));
//console.log(hobbies);
//console.log(hobbies);
//const copiedArray = hobbies.slice();
// const copiedArray = [...hobbies];
// console.log(copiedArray);

// const toArray =(...args)=> {
//     return args;
// };

// console.log(toArray(1, 2, 3, 4));