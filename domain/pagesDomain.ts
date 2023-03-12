import PageDomain from "./pageDomain";
import {Datetime} from "nodejs-polars";

type TaskMatrixForDatFlame = {
    pageId: any[]
    sprintId: any[]
    sprint: any[]
    dueDate: Array<Date | null>
    status: any[]
    reference: any[]
    createdAt: Array<Date | null>
    story: any[]
    point: any[]
    modifiedAt: Array<Date | null>
    type: any[]
    PRURL: any[]
    assign: any[]
    title: any[]
}


export default class PagesDomain{

    #list: PageDomain[]


    constructor(list: PageDomain[]) {
        this.#list = list;
    }


    get matrixForDataFlame(): TaskMatrixForDatFlame {
        const result: TaskMatrixForDatFlame = {
            pageId: [],
            sprintId: [],
            sprint: [],
            dueDate: [],
            status: [],
            reference: [],
            createdAt: [],
            story: [],
            point: [],
            modifiedAt: [],
            type: [],
            PRURL: [],
            assign: [],
            title: [],
        }


        this.#list.forEach(pageDomain => {
            result.pageId.push(pageDomain.pageId)
            result.sprintId.push(pageDomain.sprintID)
            result.sprint.push(pageDomain.sprint)
            result.dueDate.push(pageDomain.dueDate)
            result.status.push(pageDomain.status)
            result.reference.push(pageDomain.reference)
            result.createdAt.push(pageDomain.createdAt)
            result.story.push(pageDomain.story)
            result.point.push(pageDomain.point)
            result.modifiedAt.push(pageDomain.modifiedAt)
            result.type.push(pageDomain.type)
            result.PRURL.push(pageDomain.PRURL)
            result.assign.push(pageDomain.assign)
            result.title.push(pageDomain.title)
        })

        return result
    }
}
