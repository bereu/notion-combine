import {Client} from "@notionhq/client";
import * as dotenv from 'dotenv'
import PagesDomain from "./domain/pagesDomain";
import PageDomain from "./domain/pageDomain";
import { BigQuery, BigQueryOptions } from '@google-cloud/bigquery';
dotenv.config()

import * as po from 'nodejs-polars'
import {DataFrame, Series} from "nodejs-polars";
import {DataType} from "nodejs-polars/bin/datatypes";
import * as fs from "fs";
import {SprintPageDomain} from "./domain/sprintPageDomain";
import {SprintPagesDomain} from "./domain/sprintPagesDomain";
import {TABLE_SCHEMA} from "./bq/schema";






// Initialize a new Notion client with your API key
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const queryOption: BigQueryOptions = {
    projectId: process.env.PROJECT_ID
}
const bigQuery = new BigQuery(queryOption)

// Specify the IDs of the two databases you want to download data from
const databaseId1 = "161817a46ebd4abab1be2270eaf8fa0a";
const databaseId2 = "053a48a881ab4b088124e6ad5ebac2fb";

const EXPORT_FILE_NAME = "test.csv"

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
    console.log(matrix);
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


    // Merge the data from the first database with the related data from the second database
    return database1.join(database2,{
        on: "sprintId",
        how: "left",
        }
    );
}

async function downloadSprintDatabase(): Promise<DataFrame> {

    const allPages = await downloadDatabase(databaseId2)

    // const response = await notion.databases.query({ database_id: databaseId });
    const data = allPages.map((page: any) => {
        return  new SprintPageDomain(page)

    });
    const matrix = new SprintPagesDomain(data).matrixForDataFlame()
    // @ts-ignore
    return new DataFrame(matrix);
}


async function loadCSV(fileName: string): Promise<void> {
    const datasetId = process.env.DATASET_ID;
    const tableId = process.env.TABLE_ID;
    const schema = TABLE_SCHEMA;

    if (datasetId === undefined || tableId === undefined) {
        console.log(datasetId)
        console.log(tableId)
        throw  Error("datasetID or tableId are undefined")
    }

    const [job] = await bigQuery
        .dataset(datasetId)
        .table(tableId)
        .load(EXPORT_FILE_NAME, {
            schema: schema,
            writeDisposition: 'WRITE_TRUNCATE',
            sourceFormat: 'CSV',
            allowJaggedRows: true,
            allowQuotedNewlines: true,
            skipLeadingRows: 1,
            fieldDelimiter: ',', // replace with your desired delimiter
        })




    if (job.status === undefined) {
        throw Error("job status is undefined")
    }

    console.log(`Job ${job.id} completed.`);

    const errors = job.status.errors;
    if (errors && errors.length > 0) {
        throw errors;
    }
}



// Define an async IIFE to download the data and join it
(async () => {
    try {
        // Download the data from both databases
        const database1 = await downloadTaskDatabase();
        const database2 = await downloadSprintDatabase();
        console.log(database2);
        console.log(database1);
        //
        // // Join the data from both databases
        const combinedData = await joinData(
            database1,
            database2,
            "sprintID",
            "sprintID"
        );

        console.log(combinedData);
        await combinedData.writeCSV(EXPORT_FILE_NAME)
        await loadCSV(EXPORT_FILE_NAME)
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
