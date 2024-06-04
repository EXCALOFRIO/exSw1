const hello = () => {
    alert("Hello");
};

//console.log(hello());
//console.log(hello);

//hello(); // llamar funcion

function prompta(){
    let person = prompt("Enter Name", "Messi");
    document.getElementById("test").innerHTML = "Hello, " + person;
    console.log(person);
}

function testy(){
    console.log("Hello");
}

function confirma(){
    let str = confirm("Are you sure?");
    console.log(str);
}

let user = "John", age = 25, message = "hello";
//console.log(age);
//console.log(typeof(user));

const num = 10;
//console.log(num);
let num1 = 10;
num1 = 11
//console.log(num1);

//console.log(`La respuesta es ${1+2}`) // Template literals

//Conversions 
//console.log(String(22));
//console.log(Number("22"));
//console.log(+"33")
//console.log(Boolean(0));
//console.log(Boolean(1));
//console.log(Boolean(22));


//Operator if 
let agea = 18;
console.log((agea > 18) ? true : false);

if(agea == 18){
    console.log("18")
}

//Arrays
/*let arr = [2,3,4,5];
console.log(arr);
console.log(arr.indexOf(3))
console.log(arr.push(3));
console.log(arr);
console.log(arr.pop());
console.log(arr);
console.log(arr.splice(2,1));
console.log(arr);*/
