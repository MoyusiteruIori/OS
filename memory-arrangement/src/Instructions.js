function createInstruction(pageNum, address, nextAddress, status) {
  return { pageNum, address, nextAddress, status };
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateInstructions() {
  let instructions = new Array(320);
  let totalNum = 321;
  let last = 319;
  let next = last;
  for (let i = 0; i < totalNum; i++) {
    switch (i % 4) {
      case 0: {
        let emptyIndices = [];
        for (let j = 0; j < last; j++) {
          if (instructions[j] === undefined) {
            emptyIndices.push(j);
          }
        }
        if (emptyIndices.length !== 0) {
          next = emptyIndices[getRndInteger(0, emptyIndices.length - 1)];
          if (i !== 0) {
            instructions[last] = createInstruction(
              Math.floor(last / 10),
              last,
              next,
              "未执行"
            );
          }

          last = next;
        } else totalNum++;

        break;
      }
      case 1: {
        let notFound = true;
        while (notFound) {
          next = (next + 1) % 320;
          if (instructions[next] === undefined) {
            instructions[last] = createInstruction(
              Math.floor(last / 10),
              last,
              next,
              "未执行"
            );
            last = next;
            notFound = false;
          }
        }
        break;
      }
      case 2: {
        let emptyIndices = [];
        for (let j = last + 1; j < 320; j++) {
          if (instructions[j] === undefined) {
            emptyIndices.push(j);
          }
        }
        if (emptyIndices.length !== 0) {
          next = emptyIndices[getRndInteger(0, emptyIndices.length - 1)];
          instructions[last] = createInstruction(
            Math.floor(last / 10),
            last,
            next,
            "未执行"
          );
          last = next;
        } else totalNum++;

        break;
      }
      case 3: {
        let notFound = true;
        while (notFound) {
          next = (next + 1) % 320;
          if (instructions[next] === undefined) {
            instructions[last] = createInstruction(
              Math.floor(last / 10),
              last,
              next,
              "未执行"
            );
            last = next;
            notFound = false;
          }
        }
        break;
      }
      default:
        break;
    }
  }
  return instructions;
}
