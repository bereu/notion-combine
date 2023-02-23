import PageDomain from "./pageDomain";

type MatrixForDatFlame = {
    pageId: any[]
    sprintID: any[]
    sprint: any[]
    dueDate: any[]
    status: any[]
    reference: any[]
    createdAt: any[]
    story: any[]
    point: any[]
    modifiedAt: any[]
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


    get matrixForDataFlame(): MatrixForDatFlame {
        const result: MatrixForDatFlame = {
            pageId: [],
            sprintID: [],
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
            result.sprintID.push(pageDomain.sprintID)
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

        console.log({
            pageId: result.pageId.length,
            sprintID: result.sprintID.length,
            sprint: result.sprint.length,
            dueDate: result.dueDate.length,
            status: result.status.length,
            reference: result.reference.length,
            createdAt: result.createdAt.length,
            story: result.story.length,
            point: result.point.length,
            modifiedAt: result.modifiedAt.length,
            type: result.type.length,
            PRURL: result.PRURL.length,
            assign: result.assign.length,
            title: result.title.length,
        })

        return result
    }
}
