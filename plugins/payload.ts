import HistoryController from "~/utils/cms/history/HistoryController";
import HistoryRepository from "~/utils/cms/history/HistoryRepository";

// payload.js

export default definePayloadPlugin(() => {
    definePayloadReducer('HistoryRepository', (data) => {
        if (data instanceof HistoryRepository) {
            return data.getRepository().map((item) => item.toObject())
        }
    });

    definePayloadReviver('HistoryRepository', (data) => {
        if (Array.isArray(data)) {
            return new HistoryRepository(
                data.map((item) => new HistoryController(item))
            )
        }
    });
});