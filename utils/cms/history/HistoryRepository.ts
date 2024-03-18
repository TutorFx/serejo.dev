import HistoryController from "./HistoryController";

export default class {
    private repository: HistoryController[];

    getRepository = () => this.repository;

    constructor (repository: HistoryController[]) {
        this.repository = repository;
    }
}