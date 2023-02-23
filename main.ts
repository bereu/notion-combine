import {Client} from "@notionhq/client";
import * as dotenv from 'dotenv'
import PagesDomain from "./domain/pagesDomain";
import PageDomain from "./domain/pageDomain";
dotenv.config()

import * as po from 'nodejs-polars'
import {DataFrame, Series} from "nodejs-polars";
import {DataType} from "nodejs-polars/bin/datatypes";
import * as fs from "fs";




// async function main() {
//
//
//     const result = await notion.databases.query({
//
//         database_id: task_management_board_id,
//         filter: {
//             property: "ステータス",
//             status: {
//                 equals: "BACKLOG"
//             }
//         }
//     });
//
//     const pages = [...result.results];
//
//
//
//     // @ts-ignore
//     const pageDomainList = pages.map(page => new PageDomain(page));
//     const pagesDomain = new PagesDomain(pageDomainList);
//
//     console.log(pagesDomain.list[0].status);
//
//
// }



// Initialize a new Notion client with your API key
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Specify the IDs of the two databases you want to download data from
const databaseId1 = "161817a46ebd4abab1be2270eaf8fa0a";
const databaseId2 = "053a48a881ab4b088124e6ad5ebac2fb";


async function downloadDatabase(databaseId:string) {
    // Initialize an empty array to hold all the pages
    let allPages: any[] = [];

    // Initialize a variable to hold the next page to fetch
    let nextPage = undefined;

    // Fetch all pages from the database using pagination
    do {
        // Define the parameters for the API call
        // @ts-ignore
        const options = {
            database_id: databaseId,
            page_size: 100,
            start_cursor: nextPage,
        };

        // Fetch the next page of data from the API
        // @ts-ignore
        const response = await notion.databases.query(options);

        // Add the pages from the response to the array
        allPages = [...allPages, ...response.results];

        // Set the next page to fetch based on the response
        nextPage = response.next_cursor;
    } while (nextPage);

    return allPages
}

// Define a function to download the data from a single database and return it as a DataFrame
async function downloadTaskDatabase(): Promise<DataFrame> {
    const allPages = await downloadDatabase(databaseId1)

    console.log(allPages);
    // const response = await notion.databases.query({ database_id: databaseId });
    const data = allPages.map((page) => {
        return  new PageDomain(page)

    });
    const matrix = new PagesDomain(data).matrixForDataFlame
    // @ts-ignore
    return new DataFrame(matrix);
}

// Define a function to join the data from the two databases
async function joinData(
    database1: DataFrame,
    database2: DataFrame,
    relationPropertyName: string,
    pageIdPropertyName: string
): Promise<DataFrame> {
    // Retrieve the relation property from the first database
    const relationProperty = database1.select(relationPropertyName);

    // Retrieve the IDs of the related pages from the first database

    const relatedPageIds = relationProperty
        .unique().toSeries().toArray()


    // Filter the data from the second database to only include the related pages
    const relatedData = database2.filter((row: { get: (arg0: string) => any; }) =>
        relatedPageIds.includes(row.get(pageIdPropertyName))
    );

    // Merge the data from the first database with the related data from the second database
    return database1.join(relatedData,{
        on:pageIdPropertyName,
        how:"inner",
    }
    );
}

async function downloadSprintDatabase(): Promise<DataFrame> {

    const allPages = await downloadDatabase(databaseId2)

    // const response = await notion.databases.query({ database_id: databaseId });
    const data = allPages.map((page: any) => {
        return  new PageDomain(page)

    });
    const matrix = new PagesDomain(data).matrixForDataFlame
    // @ts-ignore
    return new DataFrame(matrix);
}


// Define an async IIFE to download the data and join it
(async () => {
    try {
        // Download the data from both databases
        const database1 = await downloadTaskDatabase();
        console.log(database1)
        // const database2 = await downloadDatabase(databaseId2);
        //
        // // Join the data from both databases
        // const combinedData = await joinData(
        //     database1,
        //     database2,
        //     "調剤スプリント",
        //     "sprintID"
        // );
        //
        // // Save the DataFrame to a CSV file
        // const csvString = combinedData.writeCSV();
        //
        //
        // console.log("Data downloaded and saved to combined_data.csv.");
    } catch (error) {
        console.error(error);
    }
})();
