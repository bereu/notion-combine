

export class SprintPageDomain {
    get sprintTitle(): string {
        return this.#sprintTitle;
    }
    #pageId: string;
    #sprintId: string;
    #sprintMemo: string;
    #sprintStartDate: Date;
    #sprintEndDate: Date;
    #sprintGoal: string;
    #sprintTitle: string;


    get pageId(): string {
        return this.#pageId;
    }

    get sprintId(): string {
        return this.#sprintId;
    }

    get sprintMemo(): string {
        return this.#sprintMemo;
    }

    get sprintStartDate(): Date {
        return this.#sprintStartDate;
    }

    get sprintEndDate(): Date {
        return this.#sprintEndDate;
    }

    get sprintGoal(): string {
        return this.#sprintGoal;
    }

    constructor(page:any) {
        const properties = page.properties;
        this.#pageId = page.id;
        this.#sprintId = properties?.ID.formula.string;
        this.#sprintMemo = properties?.['スプリントメモ']?.rich_text[0]?.plain_text;
        this.#sprintStartDate = properties?.['開始日'].date.start;
        this.#sprintEndDate = properties?.['終了日'].date.start;
        this.#sprintGoal = properties['スプリントゴール']?.rich_text[0]?.plain_text;
        this.#sprintTitle = properties?.['開始日_タイトル'].title[0].plain_text;
    }

    get toList(): any[] {
        return [
            this.#pageId,
            this.#sprintId,
            this.#sprintMemo,
            this.#sprintStartDate,
            this.#sprintEndDate,
            this.#sprintGoal,
            this.#sprintTitle,
        ]
    }
}