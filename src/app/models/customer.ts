export class Customer {
    createdAt: number;
    updatedAt: number;
    id: number;
    name: string;
    address: string;
    birthDate: number;

    constructor(name: string, address: string, birthDate: number) {
        this.name = name;
        this.address = address;
        this.birthDate = birthDate;
    }
}