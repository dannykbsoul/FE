const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    privateData.set(this, {
      name: name,
      age: age
    });
  }
  getName() {
    return privateData.get(this).name;
  }
  getAge() {
    return privateData.get(this).age;
  }
}

const person1 = new Person('zj', 23);
const person2 = new Person('jz', 24);