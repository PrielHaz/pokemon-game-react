export class MoveData {
  constructor(
    public name: string,
     public mp: number, // * this is the move.power in api, If the power value of the move is null - consider it as 0.
     ) {}
}

// its in the form:
// 0
// :
// name
// :
// "karate-chop"
// power
// :
// 0
