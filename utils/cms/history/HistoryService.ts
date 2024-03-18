import HistoryRepository from "./HistoryRepository";

export default class {
    repository: HistoryRepository;

    getRepository = () => this.repository;

    constructor (repository: HistoryRepository) {
        this.repository = repository;
    }
}