const message = 'Hello from myMessage!';

const name = 'Andrew';

const location = 'Philadelphia';

const getGreeting = (name) => {
  return `Welcome to the course ${name}`;
};

export { message, name, getGreeting, location as default };
