export interface IContractEvent {
    _id: string;
    name: "ContractCreatedEvent" |"ContractTerminatedEvent";
    contractId: number;
    premium?: number;
    startDate?: Date;
    terminationDate?: Date;
}