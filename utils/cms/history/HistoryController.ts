import type { MarkdownRoot } from "@nuxt/content/types";

import type { HistoryEntry } from "../types";
import { HistoryEntrySchema } from "../schemas";

export default class {
    org: string;
    title: string;
    location: string;

    start: string;
    end: string | null;
    
    body: MarkdownRoot | null;
    _id: string;


    constructor(history: HistoryEntry) {
        HistoryEntrySchema.parse(history)
        this.org = history.org;
        this.title = history.title;
        this.location = history.location;

        this.start = history.start;
        this.end = history?.end;

        this.body = history.body;
        this._id = history._id;
    }

    toJSON() {
        return this.toObject();
    }

    toObject() {
        return { ...this };
    }
}