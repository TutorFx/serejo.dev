import HistoryController from "./cms/history/HistoryController";
import HistoryRepository from "./cms/history/HistoryRepository";
import HistoryService from "./cms/history/HistoryService";

import type { HistoryEntry } from "./cms/types";

export const getHistory = () => {
    const { locale } = useI18n()
    return useAsyncData(
        'history',
        () => queryContent<HistoryEntry>(locale.value, 'history').find().then((data) =>
            new HistoryRepository(data.map((entry) => new HistoryController(entry)))
        )
    )
}

export const getHistoryService = (repository: HistoryRepository) => new HistoryService(repository);