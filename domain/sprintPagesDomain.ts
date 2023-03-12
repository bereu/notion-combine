import {SprintPageDomain} from "./sprintPageDomain";

type TaskMatrixForDatFlame = {
    pageId: Array<string | null>;
    sprintId: Array<string | null>;
    sprintMemo: Array<string | null>;
    sprintStartDate: Array<Date | null>;
    sprintEndDate: Array<Date | null>;
    sprintGoal: Array<string | null>;
    sprintTitle: Array<string | null>;
}

export class SprintPagesDomain {
    #list: SprintPageDomain[]


    constructor(list: SprintPageDomain[]) {
        this.#list = list;
    }

    matrixForDataFlame(): TaskMatrixForDatFlame {
        const matrix: TaskMatrixForDatFlame = {
            pageId: [],
            sprintId: [],
            sprintMemo: [],
            sprintStartDate: [],
            sprintEndDate: [],
            sprintGoal: [],
            sprintTitle: [],
        }
        this.#list.forEach((sprintPageDomain) => {
            matrix.pageId.push(sprintPageDomain.pageId)
            matrix.sprintId.push(sprintPageDomain.sprintId)
            matrix.sprintMemo.push(sprintPageDomain.sprintMemo)
            matrix.sprintStartDate.push(sprintPageDomain.sprintStartDate)
            matrix.sprintEndDate.push(sprintPageDomain.sprintEndDate)
            matrix.sprintGoal.push(sprintPageDomain.sprintGoal)
            matrix.sprintTitle.push(sprintPageDomain.sprintTitle)
        })

        console.log(matrix)
        return matrix;
    }


}