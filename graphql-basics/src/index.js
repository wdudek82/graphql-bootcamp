import myCurrentLocation, { getGreeting, message, name } from './myModule';

console.log('Hello GraphQL');

(() => console.log('Hello from the future!'))();

console.log(message, name, myCurrentLocation);
console.log(getGreeting('Jessica'));
