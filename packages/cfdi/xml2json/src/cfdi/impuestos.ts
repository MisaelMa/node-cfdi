export class Impuestos {
    constructor(data: any) {
        Object.assign(this, data);
    }
    data() {
        console.log(this, "impuestos data")
    }
}