
const tokenizer = (pattern: string): Array<string> => {
  return Array.from(pattern.matchAll(/(\+)|(\*(\{\d+\})?)/g), m => m[0]);
};

tokenizer("++*{4}*");//=

const tokenLength = (token: string): number => {
  let len = 0;
  if(token === "+") {
    len = 1;
  } else if(token === "*") {
    len = 3;
  } else if(/\*\{\d+\}/.test(token)) {
    const lenMatch = /(\d+)/.exec(token);
    if(lenMatch) {
      len = parseInt(lenMatch[0]);
    }
  }
  return len;
};

tokenLength("+"); //=
tokenLength("*"); //=
tokenLength("*{2}"); //=

type segregatedOutput = [string, string];

const consumeInput = (input: string, len: number): segregatedOutput => {
  if(len > input.length) {
    return [input, ""];
  } else {
    return [input.substring(0,len), input.substring(len)];
  }
};

consumeInput("foo",1);//=
consumeInput("oo",2);//=

const validateOutput = (output: string) => {
  // everything in the consumed (left) side of the tupel must be the same character
  return output[0].repeat(output.length) == output;
};

validateOutput("fee");//=
validateOutput("ee");//=

const testMatch = (input: string, pattern:string): boolean => {
  const tokens = tokenizer(pattern);
  let consumed:string;
  let unconsumed:string = input;
  tokens.forEach(token => {
    [consumed, unconsumed] = consumeInput(unconsumed, tokenLength(token));
    if (!validateOutput(consumed)) {
      return false;
    }
  });
  return unconsumed == "";
};

testMatch("g","+");  //=
testMatch("gheee","++*"); //=
testMatch("gheeee","++*"); //=
testMatch("gheeeee","++*{5}"); //=
