import {Datetime} from "nodejs-polars";

export default class PageDomain {
    get point(): number | null {
        return this.#point;
    }

    #pageId: string
    #sprintID: string
    #sprint: any
    #dueDate: Date | null
    #status: string | null
    #reference: string | null
    #createdAt: Date
    #story: number | null
    #point: number | null
    #modifiedAt: Date | null
    #type: string | null
    #PRURL: string | null
    #assign: string | null
    #title: string


    get dueDate(): Date | null {
        return this.#dueDate;
    }

    get status(): string | null {
        return this.#status;
    }

    get createdAt(): Date {
        return this.#createdAt;
    }

    get sprint(): any {
        return this.#sprint;
    }

    get story(): number | null {
        return this.#story;
    }

    get modifiedAt(): Date | null {
        return this.#modifiedAt;
    }

    get type(): string | null {
        return this.#type;
    }

    get PRURL(): string | null {
        return this.#PRURL;
    }

    get assign(): string | null {
        return this.#assign;
    }

    get title(): string {
        return this.#title;
    }


    get pageId(): string {
        return this.#pageId;
    }

    get sprintID(): string {
        return this.#sprintID;
    }

    get reference(): string | null {
        return this.#reference;
    }

    constructor(page: any) {
        const properties = page.properties
        this.#pageId = properties.pageId?.formula.string
        this.#sprintID = properties.sprintID?.rollup?.array[0]?.formula.string
        this.#sprint = properties['調剤スプリント']?.relation[0]?.id
        this.#dueDate = properties['タスク期限']?.date?.start
        this.#status = properties['ステータス']?.status!.name
        this.#reference = properties['参考']?.url
        this.#createdAt = properties['作成日時']?.['created_time']
        this.#story = properties['ストーリー']?.relation[0]?.id
        this.#point = properties['ポイント'].number
        this.#modifiedAt = properties['最終更新日時']['last_edited_time']
        this.#type = properties['種類'].select?.name
        this.#PRURL = properties['PRリンク'].url
        this.#assign = properties['担当者'].people[0]?.name
        this.#title = properties['名前'].title[0]?.plain_text
    }

    get toList(): any[] {
        return [
            this.#pageId,
            this.#sprintID,
            this.#sprint,
            this.#dueDate,
            this.#status,
            this.#reference,
            this.#createdAt,
            this.#story,
            this.#point,
            this.#modifiedAt,
            this.#type,
            this.#PRURL,
            this.#assign,
            this.#title
        ]
    }

    get toObject(): any {
        return {
            pageId: this.#pageId,
            sprintID: this.#sprintID,
            sprint: this.#sprint,
            dueDate: this.#dueDate,
            status: this.#status,
            reference: this.#reference,
            createdAt: this.#createdAt,
            story: this.#story,
            point: this.#point,
            modifiedAt: this.#modifiedAt,
            type: this.#type,
            PRURL: this.#PRURL,
            assign: this.#assign,
            title: this.#title
        }
    }
}

