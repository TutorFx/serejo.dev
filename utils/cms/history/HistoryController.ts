import type { MarkdownRoot } from "@nuxt/content/types";

import type { HistoryEntry } from "../types";
import { HistoryEntrySchema } from "../schemas";

import dayjs, { Dayjs } from "dayjs"

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

    getDateToLocaleString(locale: string = "en") {


        const dates = [];
        const dateToString = (date: Dayjs) => date.locale(locale).format("MMM, YYYY")



        dates.push(dayjs(this.start))
        if (this.end) {
            dates.push(dayjs(this.end))
        }

        return dates.map(dateToString)
    }
}